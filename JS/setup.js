import { scene, renderer } from './globalVar.js';
import { startGame } from '../main.js';

export function createPetSelectionPopup() {
    const popup = document.createElement('div');
    popup.id = 'pet-selection-popup';
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.width = '300px';
    popup.style.backgroundColor = '#fff';
    popup.style.border = '2px solid #ccc';
    popup.style.borderRadius = '10px';
    popup.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.2)';
    popup.style.padding = '20px';
    popup.style.textAlign = 'center';
    popup.style.zIndex = '1000';

    const title = document.createElement('h2');
    title.innerText = 'Choose Your Pet';
    popup.appendChild(title);

    const pets = ['Sheep', 'Dog', 'Chicken'];

    pets.forEach(pet => {
        const label = document.createElement('label');
        label.style.display = 'flex'; // Use flexbox for alignment
        label.style.alignItems = 'center'; // Vertically align the radio button and text
        label.style.justifyContent = 'center'; // Center items horizontally
        label.style.margin = '10px 0';

        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'pet';
        radio.value = pet.toLowerCase();

        const text = document.createElement('span');
        text.innerText = pet;
        text.style.marginLeft = '10px'; // Add space between the radio button and the text

        label.appendChild(radio);
        label.appendChild(text);
        popup.appendChild(label);
    });

    // Apply additional styles to center the entire popup content


    const startButton = document.createElement('button');
    startButton.innerText = 'Start Game';
    startButton.style.marginTop = '20px';
    startButton.style.padding = '10px 20px';
    startButton.style.backgroundColor = '#4CAF50';
    startButton.style.color = 'white';
    startButton.style.border = 'none';
    startButton.style.borderRadius = '5px';
    startButton.style.cursor = 'pointer';

    startButton.addEventListener('click', () => {
        const selectedPet = document.querySelector('input[name="pet"]:checked');
        const gamePopup = document.getElementById('game-popup');

        if (!selectedPet) {
            alert('Please select a pet!');
            return;
        }
        startGame(selectedPet.value);
        document.body.removeChild(popup);
        gamePopup.style.display = 'block';
    });

    popup.appendChild(startButton);
    document.body.appendChild(popup);
}

// Pausing the game until pet is selected
export function pauseBeforeSelection() {
    renderer.setAnimationLoop(null);
}