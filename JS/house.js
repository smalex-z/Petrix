import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { scene, earthRadius } from './globalVar.js'; 

import { sheep } from './pet.js';

//Making a house on the planet 
function createHouse() {
    const houseGroup = new THREE.Group();

    // Create the base (walls)
    const wallGeometry = new THREE.BoxGeometry(1, 1, 1);
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const walls = new THREE.Mesh(wallGeometry, wallMaterial);
    walls.position.y = 0.5; // Raise walls to sit on the ground
    houseGroup.add(walls);

    // Create the roof
    const roofGeometry = new THREE.ConeGeometry(0.75, 1, 4);
    const roofMaterial = new THREE.MeshStandardMaterial({ color: 0xFF0000 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 1.5; // Place roof on top of walls
    roof.rotation.y = Math.PI / 4; // Align the cone to form a pyramid
    houseGroup.add(roof);

    // Create the door
    const doorGeometry = new THREE.BoxGeometry(0.3, 0.5, 0.1);
    const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 });
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(0, 0.25, 0.51); // Slightly in front of the wall
    houseGroup.add(door);

    return houseGroup;
}


const house = createHouse();
house.position.set(2, 0, 2); // Adjust position as needed
//scene.add(house);

// FULL CREDIT TO THE CREATOR FOR THE HOUSE MODEL HERE: https://sketchfab.com/3d-models/stardew-valley-cabin-98daf2e9e1c0468cbb322c1a97d672a1
const loader = new GLTFLoader();
let importHouse;
loader.load('../images/stardew_valley_cabin/scene.gltf', function (gltf) {
    importHouse = gltf.scene; // Get the house object
    importHouse.position.set(2, 0, 2); // Adjust position as needed
    scene.add(importHouse);
    adjustHouseHeight(importHouse, earthRadius);
});

function adjustHouseHeight(house, earthRadius) {
    const x = house.position.x;
    const z = house.position.z;
    const y = Math.sqrt(Math.max(0, earthRadius ** 2 - x ** 2 - z ** 2));
    house.position.y = y;
}



function checkPetHouseInteraction() {
    const distanceToHouse = sheep.position.distanceTo(house.position);

    if (distanceToHouse < 2) { // Interaction range
        console.log('Pet is near the house.');
        // Example: Increase happiness or other stats
        updatePetStatusDisplay();
    }
}

export { checkPetHouseInteraction };
