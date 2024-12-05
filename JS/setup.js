import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { startGame } from '../main.js';
import { scene, renderer, chosenPet, adjustItemHeight } from './globalVar.js';
import { importHouse } from './house.js';

// Pets Setup
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

//Bounding Box Visibility
let isBoundingBoxVisible = false; // Tracks if bounding boxes are visible
let petBoxHelper, houseBoxHelper; // BoxHelpers for the pet and house
export function setupBoundingBoxes() {
    

    // Create bounding box helpers
    petBoxHelper = new THREE.BoxHelper(chosenPet, 0xff0000); // Red for pet
    houseBoxHelper = new THREE.BoxHelper(importHouse, 0x0000ff); // Blue for house

    // Initially hide the helpers
    petBoxHelper.visible = false;
    houseBoxHelper.visible = false;

    // Add helpers to the scene
    scene.add(petBoxHelper);
    scene.add(houseBoxHelper);
}


export function updateBoundingBoxes() {
    // Update the bounding boxes dynamically
    petBoxHelper.update();
    houseBoxHelper.update();
}

export function toggleBoundingBoxes() {
    isBoundingBoxVisible = !isBoundingBoxVisible; // Toggle visibility state

    // Toggle visibility of the helpers
    petBoxHelper.visible = isBoundingBoxVisible;
    houseBoxHelper.visible = isBoundingBoxVisible;
}

createTrees();

export function createTrees() {
    const loader = new GLTFLoader();
    const treeCount = [60, 45, 30, 50]; // Number of trees in the ring
    const radius = [8 , 8.5, 9, 9.5]; // Radius of the ring


    // Load the tree model once and replicate
    loader.load('../assets/pine-tree/scene_textured.gltf', function (gltf) {
        for (let j = 0; j < 4; j++){
            for (let i = 0; i < treeCount[j]; i++) {
                const angle = (i / treeCount[j]) * Math.PI * 2; // Angle in radians for each tree
                const x = Math.cos(angle) * radius[j];
                const z = Math.sin(angle) * radius[j];

                // Clone the tree model
                const tree = gltf.scene.clone();
                tree.scale.set(0.2, 0.2, 0.2); // Scale the tree
                tree.position.set(x, 0, z); // Set the position on the ring

                // Add random rotation to the tree
                tree.rotation.y = Math.random() * Math.PI * 2; // Random rotation in radians
                const randomGreen = generateRandomGreen();

                const greenMaterial = new THREE.MeshStandardMaterial({ color: randomGreen });

                // Set a fully green material for all meshes
                tree.traverse((node) => {
                    if (node.isMesh) {
                        node.material = greenMaterial; // Override material with green
                        node.castShadow = true; // Enable shadow casting
                        node.receiveShadow = true; // Enable shadow receiving
                    }
                });

                // Adjust height based on the terrain
                adjustItemHeight(tree, .2);

                // Add the tree to the scene
                scene.add(tree);
            }
        }
    }, undefined, function (error) {
        console.error('Error loading GLTF:', error);
    });

    function generateRandomGreen() {
        // Generate random green values
        const r = Math.floor(Math.random() * 30); // Very low red (0 to 29)
        const g = Math.floor(Math.random() * 100) + 50; // Moderate green (50 to 149)
        const b = Math.floor(Math.random() * 30); // Very low blue (0 to 29)
        return (r << 16) | (g << 8) | b; // Combine RGB into a hexadecimal color
    }
}
