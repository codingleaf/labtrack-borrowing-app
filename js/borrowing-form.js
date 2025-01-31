'use strict';

import { Spinbox } from './spinbox.js';
import { validateForm } from './borrower-details-validation.js';
import { generateSummary } from './generate-summary.js';
import { generateQR } from './generate-qr.js';

// Timeout
let blTimeoutID;
let confirmTimeoutID;

// EquipmentData
let equipmentData;

// Borrowing List
let borrowingList = [];

// Data Summary (For Generating QR Code)
let qrData;

// Function to fetch equipment data from JSON and load it
async function loadEquipment() {
    // Reference to the equipment container
    const equipmentContainer = document.querySelector('#equipment-container');

    // Reference to the hidden row template for the borrowing list
    const rowTemplate = document.querySelector('#row-template');

    // Reference to the borrowing list table
    const tableBody = document.querySelector('#borrowing-list-table > tbody');

    try {
        // Fetch equipment data from equipment.json
        const response = await fetch('../assets/data/equipment.json');
        if (!response.ok) {
            throw new Error('Failed to fetch equipment data');
        }
        equipmentData = await response.json();

        // Loop through the data and create equipment cards
        equipmentData.forEach(equipment => {
            const equipmentCard = document.createElement('div');
            equipmentCard.classList.add('equipment-card');

            // attach equipment id to the card 
            equipmentCard.setAttribute('data-id', equipment['id'])

            // Add image
            const img = document.createElement('img');
            img.src = `../assets/images/${equipment['image']}`;
            img.alt = equipment['name'];
            
            // Add equipment name
            const name = document.createElement('h3');
            name.textContent = equipment['name'];

            // Add equipment specification
            const specification = document.createElement('p');
            specification.textContent = equipment['specification'] ? `(${equipment['specification']})` : '';

            // Add equipment description
            const description = document.createElement('p');
            description.textContent = equipment['description'] ? equipment['description'] : '';

            // Add borrow button
            const btnBorrow = document.createElement('button');
            btnBorrow.textContent = 'Borrow';
            btnBorrow.addEventListener('click', () => {
                // don't add if item is already in the borrowing list
                if (borrowingList.some(listItem => listItem['id'] === equipment['id'])) {
                    blTimeoutID = showNotification('#borrowing-list-notification', 'ITEM ALREADY ADDED', blTimeoutID);
                    return;
                }

                // clone row template
                const newRow = rowTemplate.cloneNode(true);
                
                // add image
                const equipmentImage = newRow.querySelector('.equipment-image')
                equipmentImage.src = img.src;

                // add equipment name
                const equipmentName = newRow.querySelector('.equipment-name');
                equipmentName.textContent = equipment['name'];

                // add equipment specification
                const equipmentSpecification = newRow.querySelector('.equipment-specification');
                equipmentSpecification.textContent = equipment['specification'];

                // add equipment description
                const equipmentDescription = newRow.querySelector('.equipment-description');
                equipmentDescription.textContent = equipment['description'];

                // initialize spinbox
                const spinbox = newRow.querySelector('.spinbox');
                new Spinbox(spinbox);

                // initialize delete button
                const btnDelete = newRow.querySelector('button.delete');
                btnDelete.addEventListener('click', () => {
                    const index = borrowingList.findIndex(listItem => listItem['id'] === equipment['id'])
                    if (index > -1) {
                        borrowingList.splice(index, 1);
                    }
                    newRow.remove();
                })

                // remove id
                newRow.removeAttribute('id');
                newRow.removeAttribute('class');

                // attach equipment id to the row
                newRow.setAttribute('data-id', equipment['id']);

                // unhide new row
                newRow.classList.remove('hidden');

                // add class to each row
                newRow.classList.add('borrowing-list-row')
                
                // append new row
                tableBody.appendChild(newRow);

                // add equipment to borrowing list
                borrowingList.push({ id: equipment['id'],
                                     name: equipment['name'],
                                     specification: equipment['specification'],
                                     description: equipment['description'],
                                     quantity: 1 });

                // notification
                let notificationText = `ADDED ${equipment['name']}`;
                notificationText += equipment['specification'] ? ` (${equipment['specification']})` : '';
                notificationText += equipment['description'] ? `, ${equipment['description']}` : '';
                blTimeoutID = showNotification('#borrowing-list-notification', notificationText, blTimeoutID);
            })

            // Append image, name, specification, and description to card
            equipmentCard.appendChild(img);
            equipmentCard.appendChild(name);
            if (specification.textContent) {
                equipmentCard.appendChild(specification);
            }
            if (description.textContent) {
                equipmentCard.appendChild(description);
            }
            equipmentCard.appendChild(btnBorrow);

            // Append the card to the container
            equipmentContainer.appendChild(equipmentCard);

            searchFilter();
        });
    } catch (error) {
        console.error('Error loading equipment data:', error);
    }
};

function searchFilter() {
    // Search Filter
    const searchInput = document.querySelector('#search-input');
    const equipmentCards = document.querySelectorAll('.equipment-card');

    // Listen for input events on the search bar
    searchInput.addEventListener('input', (event) => {
        const searchText = event.target.value.toLowerCase();

        equipmentCards.forEach((card) => {
            const cardName = card.querySelector('h3').textContent.toLowerCase();
    
            // Show or hide the card based on the search text
            if (cardName.includes(searchText)) {
                card.classList.remove('hidden'); // Show card
            } else {
                card.classList.add('hidden'); // Hide card
            }
        });
    });
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
    // Hide course details field if designation is Faculty
    const toggleCourseDetails = () => {
        if (designationInput.value !== "1") { 
            courseDetailsField.classList.add('hidden');
        } else {
            courseDetailsField.classList.remove('hidden');
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