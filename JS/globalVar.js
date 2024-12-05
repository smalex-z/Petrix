import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { sheep } from './sheep';
import { dog } from './dog';
import { chicken } from './chickens.js';
import { hungerSprite, hygieneSprite, happinessSprite } from './icons.js';
import { importHouse } from './house.js';



//Main
var iconIndex = {
    currentIconIndex: 0, // Store the value as a property of an object
}
var blinkTime = {
    lastBlinkTime: 0, // Store the value as a property of an object
}

// Planets
const earthRadius = 48;
const orbitDistance = 140; // Adjust the distance closer to the center
const planetSpeed = 0.4; // Set the default speed to .02, testing set to .2
const moonRadius = 4;
const sunRadius = 8;

// Scene 
var defaultCamPos = new THREE.Vector3(0, earthRadius + 6, 16);
var defaultLook = new THREE.Vector3(0, earthRadius + 2, 0);
const housePosition = new THREE.Vector3(4, 0, 0); //Don't Touch Y value

// Pets
var chosenPet;
var unselectedPets = [];

export function initializeUnselectedPets(selectedPet) {
    if (selectedPet === 'sheep') {
        chosenPet = sheep;
        unselectedPets.push(dog);
        unselectedPets.push(chicken);
    } else if (selectedPet === 'dog') {
        chosenPet = dog;
        unselectedPets.push(sheep);
        unselectedPets.push(chicken);
    } else if (selectedPet === 'chicken') {
        chosenPet = chicken;
        unselectedPets.push(dog);
        unselectedPets.push(sheep);
    }
    
    // Filter out the chosen pet
    chosenPet.castShadow = true; // 启用宠物投射阴影
    chosenPet.receiveShadow = true; // 启用宠物接收阴影

    chosenPet.add(hungerSprite);
    chosenPet.add(hygieneSprite);
    chosenPet.add(happinessSprite);

    // Set initial positions for unselected pets
    unselectedPets[0].position.set(importHouse.position.x - 8, importHouse.position.y, importHouse.position.z -2);
    unselectedPets[1].position.set(importHouse.position.x - 5, importHouse.position.y, importHouse.position.z -2);

    scene.add(chosenPet);

    unselectedPets.forEach(pet => {
        adjustItemHeight(pet, -.2);
        scene.add(pet);
    });
}

// Status
// 定义状态的最大值和最小值
const MAX_STATUS = 100;
const MIN_STATUS = 0;

// sceneSetup.js
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.copy(defaultCamPos); // Z offset for depth, Y aligns with the sphere's top portion
camera.lookAt(defaultLook); // Focus on the top edge of the sphere (positive Y)


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.copy(defaultLook);
controls.enabled = true;
controls.minDistance = 10;
controls.maxDistance = 1000;

function adjustItemHeight(item, offset) {
    const x = item.position.x;
    const z = item.position.z;
    const y = Math.sqrt(Math.max(0, earthRadius ** 2 - x ** 2 - z ** 2)) - offset;
    item.position.y = y;
}

export {
    scene, camera, renderer, controls, defaultCamPos, defaultLook, housePosition, blinkTime,
    iconIndex, earthRadius, sunRadius, moonRadius, orbitDistance, planetSpeed, MAX_STATUS, MIN_STATUS,
    chosenPet, unselectedPets, adjustItemHeight
}
