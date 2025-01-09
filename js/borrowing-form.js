'use strict';

import { Spinbox } from './spinbox.js'
import { validateForm } from './borrower-details-validation.js'

// Timeout
let timeoutID;

// Function to fetch equipment data from JSON and load it
async function loadEquipment() {
    // Reference to the equipment container
    const equipmentContainer = document.querySelector('#equipment-container');

    // Reference to the hidden row template for the borrowing list
    const rowTemplate = document.querySelector('#row-template');

    // Reference to the borrowing list table
    const tableBody = document.querySelector('#borrowing-list-table > tbody');

    // Reference to notification popup
    const notification = document.querySelector('.notification');

    // Borrowing List
    let borrowingList = [];

    try {
        // Fetch equipment data from equipment.json
        const response = await fetch('../assets/data/equipment.json');
        if (!response.ok) {
            throw new Error('Failed to fetch equipment data');
        }
        const equipmentData = await response.json();

        // Loop through the data and create equipment cards
        equipmentData.forEach(equipment => {
            const equipmentCard = document.createElement('div');
            equipmentCard.classList.add('equipment-card');
            
            // Add image
            const img = document.createElement('img');
            img.src = `../assets/images/${equipment['image']}`;
            img.alt = equipment['name'];
            
            // Add equipment name
            const name = document.createElement('h3');
            name.textContent = equipment['name'];

            // Add borrow button
            const btnBorrow = document.createElement('button');
            btnBorrow.textContent = 'Borrow';
            btnBorrow.addEventListener('click', () => {
                // don't add if item is already in the borrowing list
                if (borrowingList.includes(equipment['name'])) {
                    console.log('ITEM HAS ALREADY BEEN ADDED!')
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

                // initialize spinbox
                const spinbox = newRow.querySelector('.spinbox');
                new Spinbox(spinbox);

                // initialize delete button
                const btnDelete = newRow.querySelector('button.delete');
                btnDelete.addEventListener('click', () => {
                    const index = borrowingList.indexOf(equipment['name'])
                    if (index > -1) {
                        borrowingList.splice(index, 1);
                    }
                    newRow.remove();
                    console.log(`REMOVED ${equipment['name']}`);
                })

                // remove id
                newRow.removeAttribute('id');
                newRow.removeAttribute('class');

                // unhide new row
                newRow.classList.remove('hidden');
                
                // append new row
                tableBody.appendChild(newRow);

                borrowingList.push(equipment['name']);

                notification.textContent = `ADDED ${equipment['name']}`;

                showNotification();

                console.log(`ADDED ${equipment['name']}`);
            })

            // Append image and name to card
            equipmentCard.appendChild(img);
            equipmentCard.appendChild(name);
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

function showNotification() {
    const notification = document.querySelector('.notification');
    notification.classList.add('show-notification');
  
    if (timeoutID) {
        clearTimeout(timeoutID);
    }

    // Automatically hide the popup after 3 seconds
    timeoutID = setTimeout(() => {
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

    pages.forEach((page, index) => {
        const btnNext = page.querySelector('.btn-next')
        if (btnNext) {
            btnNext.addEventListener('click', () => {
                nextPage(pages, index);
            })
        }
    })

    // Prevent form submission for validation
    document.querySelector('form').addEventListener('submit', function (e) {
        e.preventDefault();
    });
    
    const btnValidateForm = document.querySelector('#btn-validate-form');
    btnValidateForm.addEventListener('click', () => {
        const proceed = validateForm();
        if (proceed) {
            nextPage(pages, 0);
        }
    })
    
    loadEquipment();
});