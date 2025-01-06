'use strict';

import { redirectTo } from './redirect.js';

document.addEventListener('DOMContentLoaded', ()=>{
    let btnBack = document.querySelector('#btn-back');
    btnBack.addEventListener('click', ()=>{
        redirectTo('./borrower-details.html');
    });

    // Reference to the equipment container
    const equipmentContainer = document.querySelector('#equipment-container');

    // Function to fetch equipment data from JSON and load it
    const loadEquipment = async () => {
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
                img.src = `../assets/images/${equipment.image}`;
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
            });
        } catch (error) {
            console.error('Error loading equipment data:', error);
        }
    };

    // Load the equipment cards when the page is ready
    loadEquipment();
});