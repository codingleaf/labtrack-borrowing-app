'use strict';

import { redirectTo } from './redirect.js';

// Function to fetch equipment data from JSON and load it
async function loadEquipment() {
    // Reference to the equipment container
    const equipmentContainer = document.querySelector('#equipment-container');

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
            img.src = `../assets/icons/icon-labtrack.png`;
            img.alt = equipment.name;
            img.classList.add('equipment-image');
            
            // Add equipment name
            const name = document.createElement('h3');
            name.textContent = equipment.name;

            // Add borrow button
            const btnBorrow = document.createElement('button');
            btnBorrow.textContent = 'Borrow';

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

// Load equipment on page load
document.addEventListener('DOMContentLoaded', () => {
    let btnBack = document.querySelector('#btn-back');
        btnBack.addEventListener('click', ()=>{
            redirectTo('./borrower-details.html');
    });

    loadEquipment();
});