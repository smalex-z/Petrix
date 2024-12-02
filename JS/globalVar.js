import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

//Main
var iconIndex = {
    currentIconIndex: 0, // Store the value as a property of an object
}
var blinkTime = {
    lastBlinkTime: 0, // Store the value as a property of an object
}


// Planets
const earthRadius = 24;
const orbitDistance = 80; // Adjust the distance closer to the center
const planetSpeed = 0.2; // Set the default speed to .02, testing set to .2

// Scene 
var defaultCamPos = new THREE.Vector3(0, earthRadius + 4, 10);
var defaultLook = new THREE.Vector3(0, earthRadius + 1, 0);
const housePosition = new THREE.Vector3(4, 0, 0); //Don't Touch Y value

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
controls.maxDistance = 50;

export { scene, camera, renderer, controls, defaultCamPos, defaultLook, housePosition, blinkTime, 
    iconIndex, earthRadius, orbitDistance, planetSpeed, MAX_STATUS, MIN_STATUS}