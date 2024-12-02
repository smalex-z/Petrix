// sceneSetup.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 17, 6); // Z offset for depth, Y aligns with the sphere's top portion
camera.lookAt(0, 16, 0); // Focus on the top edge of the sphere (positive Y)


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 16, 0);
controls.enabled = true;
controls.minDistance = 10;
controls.maxDistance = 50;

export { scene, camera, renderer, controls };
