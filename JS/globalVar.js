import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

//Main
var currentIconIndex = 0; // 当前显示的图标索引
var lastBlinkTime = 0; // 上次切换可见性的时间


// Planets
const earthRadius = 24;
const orbitDistance = 80; // Adjust the distance closer to the center
const planetSpeed = 0.2; // Set the default speed to .02, testing set to .2

// Scene 
var defaultCamPos = new THREE.Vector3(0, earthRadius + 3, 10);
var defaultLook = new THREE.Vector3(0, earthRadius, 0);

// Scene Setup

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

export { scene, camera, renderer, controls, defaultCamPos, defaultLook, lastBlinkTime, 
    currentIconIndex, earthRadius, orbitDistance, planetSpeed}