import { scene, renderer } from './globalVar.js';
import { startGame } from '../main.js';

export function createPetSelectionPopup() {
    const popup = document.getElementById('pet-selection-popup');
    const petOptions = document.getElementById('pet-options');
    const startButton = document.getElementById('start-button');

    const pets = ['Sheep', 'Dog', 'Chicken'];

    pets.forEach(pet => {
        const label = document.createElement('label');
        label.classList.add('pet-option');
        
        label.innerHTML = `
            <input type="radio" name="pet" value="${pet.toLowerCase()}">
            <div class="pet-card">
                <img src="./assets/images/${pet.toLowerCase()}.png" alt="${pet}" class="pet-image">
                <span class="pet-name">${pet}</span>
            </div>
        `;
    
        petOptions.appendChild(label);
    });

    startButton.addEventListener('click', () => {
        const selectedPet = document.querySelector('input[name="pet"]:checked');
        const gamePopup = document.getElementById('game-popup');

        if (!selectedPet) {
            alert('Please select a pet!');
            return;
        }

        startGame(selectedPet.value);
        popup.classList.add('hidden'); // Hide the selection popup
        gamePopup.classList.remove('hidden'); // Show the game popup
    });

    popup.classList.remove('hidden'); // Display the popup initially
}


// Pausing the game until pet is selected
export function pauseBeforeSelection() {
    renderer.setAnimationLoop(null);
}