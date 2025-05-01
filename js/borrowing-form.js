'use strict';

import { Spinbox } from './spinbox.js';
import { validateForm } from './borrower-details-validation.js';
import { generateSummary } from './generate-summary.js';
import { generateQR } from './generate-qr.js';

// Timeout
let blTimeoutID;
let confirmTimeoutID;

// Borrowing List
let borrowingList = [];

// Data Summary (For Generating QR Code)
let qrData;

function setEquipmentImage(imgElement, imageName) {
    const imgPath = `../assets/images/${imageName}`;
    const fallbackPath = '../assets/images/placeholder.jpg';

    const testImage = new Image();
    testImage.onload = () => imgElement.src = imgPath;
    testImage.onerror = () => imgElement.src = fallbackPath;
    testImage.src = imgPath;
}

async function loadEquipment() {
    const equipmentContainer = document.querySelector('#equipment-container');
    const rowTemplate = document.querySelector('#row-template');
    const tableBody = document.querySelector('#borrowing-list-table > tbody');
    const equipmentCardTemplate = document.querySelector('#equipment-card-template');
  
    let equipmentData = [];
  
    try {
      // Fetch from Firestore
      const doc = await firebase.firestore().collection("equipment_data").doc("equipment").get();
      if (!doc.exists) throw new Error("No document found");
  
      const firestoreData = doc.data();
      equipmentData = firestoreData.data || [];
  
    } catch (firebaseError) {
      console.warn('⚠️ Firebase load failed, falling back to equipment.json:', firebaseError);
  
      try {
        const localRes = await fetch('../assets/data/equipment.json');
        if (!localRes.ok) throw new Error('Failed to fetch local equipment data');
        equipmentData = await localRes.json();
      } catch (localError) {
        console.error('❌ Failed to load equipment from both Firebase and local:', localError);
        return;
      }
    }
  
    equipmentData.forEach(equipment => {
        const cardClone = equipmentCardTemplate.content.cloneNode(true);
        const equipmentCard = cardClone.querySelector('.equipment-card');
      
        equipmentCard.setAttribute('data-id', equipment['id']);
        equipmentCard.setAttribute('data-category', equipment['category']);
      
        const img = equipmentCard.querySelector('img');
        setEquipmentImage(img, equipment['image']);
      
        equipmentCard.querySelector('.equipment-name').textContent = equipment['name'];
        equipmentCard.querySelector('.equipment-specification').textContent = equipment['specification'] ? `(${equipment['specification']})` : '';
        equipmentCard.querySelector('.equipment-description').textContent = equipment['description'] || '';
      
        const btnBorrow = equipmentCard.querySelector('.btn-borrow');
        btnBorrow.addEventListener('click', () => {
          // Prevent adding duplicate item
          if (borrowingList.some(listItem => listItem['id'] === equipment['id'])) {
            blTimeoutID = showNotification('#borrowing-list-notification', 'ITEM ALREADY ADDED', blTimeoutID);
            return;
          }
        
          // Clone row template
          const newRow = rowTemplate.cloneNode(true);
          newRow.removeAttribute('id');
          newRow.classList.remove('hidden');
          newRow.classList.add('borrowing-list-row');
          newRow.setAttribute('data-id', equipment['id']);
        
          // Fill equipment details
          newRow.querySelector('.equipment-image').src = img.src;
          newRow.querySelector('.equipment-name').textContent = equipment['name'];
          newRow.querySelector('.equipment-specification').textContent = equipment['specification'] || '';
          newRow.querySelector('.equipment-description').textContent = equipment['description'] || '';
          newRow.querySelector('.equipment-qty span:last-child').textContent = equipment['quantity'] ?? '0';
        
          // Initialize spinbox (quantity selector)
          const spinbox = newRow.querySelector('.spinbox');
          new Spinbox(spinbox);
          const input = spinbox.querySelector('.spinbox-input');
          input.setAttribute('max', equipment['quantity'] ?? '999');
        
          // Setup delete button
          const btnDelete = newRow.querySelector('button.delete');
          btnDelete.addEventListener('click', () => {
            const index = borrowingList.findIndex(listItem => listItem['id'] === equipment['id']);
            if (index > -1) borrowingList.splice(index, 1);
            newRow.remove();
          });
        
          // Append to table body
          tableBody.appendChild(newRow);
        
          // Add to borrowing list (for internal tracking)
          borrowingList.push({
            id: equipment['id'],
            name: equipment['name'],
            specification: equipment['specification'],
            description: equipment['description'],
            quantity: 1
          });
        
          // Show success notification
          let notificationText = `ADDED ${equipment['name']}`;
          if (equipment['specification']) notificationText += ` (${equipment['specification']})`;
          if (equipment['description']) notificationText += `, ${equipment['description']}`;
          blTimeoutID = showNotification('#borrowing-list-notification', notificationText, blTimeoutID);
        });        

        // Set the available quantity
        const qtyParagraph = equipmentCard.querySelector('.equipment-qty');
        const qtySpans = qtyParagraph.querySelectorAll('span');
        
        if (equipment['quantity'] > 0) {
          qtyParagraph.classList.remove('hidden'); // Make sure it's visible
          qtySpans[1].textContent = equipment['quantity'];
          btnBorrow.disabled = false;
          btnBorrow.textContent = 'Borrow';
          btnBorrow.classList.remove('disabled');
        } else {
          qtyParagraph.classList.add('hidden'); // Hide "Available: 0"
          btnBorrow.disabled = true;
          btnBorrow.textContent = 'Unavailable';
          btnBorrow.classList.add('disabled');
        }        
      
        equipmentContainer.appendChild(cardClone);
      });      
  
    applyFilters();
}  

function applyFilters() {
    // Search and Category Filter
    const searchInput = document.querySelector('#search-input');
    const categoryFilter = document.querySelector('#filter-category');
    const equipmentCards = document.querySelectorAll('.equipment-card');

    function filterCards() {
        const searchText = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;

        equipmentCards.forEach((card) => {
            const cardName = card.querySelector('h3').textContent.toLowerCase();
            const cardCategory = card.getAttribute('data-category');
            
            const matchesSearch = cardName.includes(searchText);
            const matchesCategory = selectedCategory === "" || cardCategory === selectedCategory;

            // Show card if it matches both filters, otherwise hide it
            card.classList.toggle('hidden', !(matchesSearch && matchesCategory));
        });
    }

    // Listen for input and change events
    searchInput.addEventListener('input', filterCards);
    categoryFilter.addEventListener('change', filterCards);
}

function previousPage(pages, currentPageIndex) {
    const previousPageIndex = currentPageIndex - 1;
    if (previousPageIndex >= 0) {
        pages
            .filter(page => page !== pages[previousPageIndex])
            .forEach(page => page.classList.add('hidden'));
        pages[previousPageIndex].classList.remove('hidden');
    }
    else {
        window.location.href = '../index.html';
    }
}

function nextPage(pages, currentPageIndex) {
    const nextPageIndex = currentPageIndex + 1;
    if (nextPageIndex >= 0 && nextPageIndex < pages.length) {
        pages
            .filter(page => page !== pages[nextPageIndex])
            .forEach(page => page.classList.add('hidden'));
        pages[nextPageIndex].classList.remove('hidden');
    }
}

function showNotification(element, text, timeoutID) {
    const notification = document.querySelector(element);
    notification.textContent = text;
    notification.classList.add('show-notification');
  
    if (timeoutID) {
        clearTimeout(timeoutID);
    }

    // Automatically hide the popup after 2 seconds
    return setTimeout(() => {
        notification.classList.remove('show-notification');
    }, 2000);
}

// Main
document.addEventListener('DOMContentLoaded', () => {
    const pages = [...document.querySelectorAll('.page')];
    pages.forEach((page, index) => {
        const btnBack = page.querySelector('.btn-back')
        if (btnBack) {
            btnBack.addEventListener('click', () => {
                previousPage(pages, index);
            })
        }
    })

    // Prevent form submission for validation
    document.querySelector('form').addEventListener('submit', function (e) {
        e.preventDefault();
    });

    const designationInput = document.querySelector('#designation');
    const courseDetailsField = document.querySelector('#course-details-field');
    const idLabel = document.querySelector('#borrower-id-field > label')
    // Hide course details field if designation is Faculty
    const toggleCourseDetails = () => {
        if (designationInput.value === "1") { 
            courseDetailsField.classList.remove('hidden');
            idLabel.textContent = 'Student ID';
        } else {
            courseDetailsField.classList.add('hidden');
            idLabel.textContent = 'Faculty ID';
        }
    }
    toggleCourseDetails(); // run on page load
    designationInput.addEventListener('change', toggleCourseDetails);

    // Validate Borrower Details Form
    const btnValidateForm = document.querySelector('#btn-validate-form');
    btnValidateForm.addEventListener('click', () => {
        const proceed = validateForm();
        if (proceed) {
            nextPage(pages, 0);
        }
    })

    // BorrowingList
    const btnBorrowingList = document.querySelector('#btn-borrowing-list');
    btnBorrowingList.addEventListener('click', () => {
        nextPage(pages, 1);
    })

    // Confirm Borrowing List (Show Summary)
    const btnConfirm = document.querySelector('#btn-confirm');
    btnConfirm.addEventListener('click', () => {
        if (borrowingList.length > 0) {
            qrData = generateSummary(borrowingList);
            nextPage(pages, 2);
        } else {
            confirmTimeoutID = showNotification('#confirm-notification', 'List is Empty', confirmTimeoutID);
        }
    })

    const btnGenerateQR = document.querySelector('#btn-generate-qr');
    btnGenerateQR.addEventListener('click', () => {
        generateQR(qrData, '../assets/icons/icon-labtrack.png');
        nextPage(pages, 3);
    })
    
    loadEquipment();
});