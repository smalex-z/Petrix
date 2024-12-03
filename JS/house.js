import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { scene, earthRadius, housePosition } from './globalVar.js';

import { sheep } from './sheep';
import { dog } from './dog';
import { chicken } from './chickens.js';



//Making a basic house on the planet 
//NOT USED ATM
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
house.position.copy(housePosition); // Adjust position as needed
//scene.add(house);


// FULL CREDIT TO THE CREATOR FOR THE HOUSE MODEL HERE:
// https://sketchfab.com/3d-models/stardew-valley-cabin-98daf2e9e1c0468cbb322c1a97d672a1
const loader = new GLTFLoader();
let importHouse;
let houseBoundingBox = new THREE.Box3();
loader.load('../images/stardew_valley_cabin/scene.gltf', function (gltf) {
    //House 
    importHouse = gltf.scene; // Get the house object
    importHouse.scale.set(2, 2, 2); // Double the size along all axes
    importHouse.position.copy(housePosition); // Adjust position as needed
    scene.add(importHouse);

    //Support Block
    const blockGeometry = new THREE.BoxGeometry(3, .5, 3); // Adjust size as needed
    const blockMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 }); // Green color
    const supportBlock = new THREE.Mesh(blockGeometry, blockMaterial);

    scene.add(supportBlock);
    houseBoundingBox.setFromObject(importHouse);



    adjustHouseHeight(importHouse, earthRadius);
    adjustBlockHeight(supportBlock, earthRadius);

});


function adjustHouseHeight(house, earthRadius) {
    const x = house.position.x;
    const z = house.position.z;
    const y = Math.sqrt(Math.max(0, earthRadius ** 2 - x ** 2 - z ** 2));
    house.position.y = y;
}

function adjustBlockHeight(block, earthRadius) {
    const x = housePosition.x - .375;
    const z = housePosition.z - .45;
    const y = Math.sqrt(Math.max(0, earthRadius ** 2 - x ** 2 - z ** 2)) - .25;
    block.position.set(x, y, z); // Adjust position as needed
}



function checkPetHouseInteraction() {
    const distanceToHouseSheep = sheep.position.distanceTo(house.position);
    const distanceToHouseDog = dog.position.distanceTo(house.position);
    const distanceToHouseChicken = chicken.position.distanceTo(house.position);


    // if (distanceToHouseChicken < 2) { // Interaction range
    //     console.log('Pet is near the house.');
    //     // Example: Increase happiness or other stats
    //     updatePetStatusDisplay();
    // }
    // if (distanceToHouseDog < 2) { // Interaction range
    //     console.log('Pet is near the house.');
    //     // Example: Increase happiness or other stats
    //     updatePetStatusDisplay();
    // }
    // if (distanceToHouseSheep < 2) { // Interaction range
    //     console.log('Pet is near the house.');
    //     // Example: Increase happiness or other stats
    //     updatePetStatusDisplay();
    // }
}

export { checkPetHouseInteraction, houseBoundingBox, importHouse };
