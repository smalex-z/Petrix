import * as THREE from 'three';
import { createPhongMaterial } from './shaders.js';
import { scene } from './sceneSetup.js';


let planets = [];

// Create orbiting planets
const orbitDistance = 50; // Adjust the distance closer to the center
const planetSpeed = 0.2; // Set the same speed default speed: .02, testing set to .1



// TODO: Create the green
let green_geom = new THREE.SphereGeometry(16, 32, 32);
let green_material = new THREE.MeshBasicMaterial({ color: 0x32cd32 });
let green = new THREE.Mesh(green_geom, green_material);
green.position.set(0, 0, 0);
scene.add(green);


// 修改 sun 的位置和速度，代表太阳
const sunGeom = new THREE.SphereGeometry(4, 64, 64);
const sunMaterial = createPhongMaterial({
    color: new THREE.Color(0xffff00),
    ambient: 1.0,
    diffusivity: 1.0,
    specularity: 1.0,
    smoothness: 100.0

});
const sun = new THREE.Mesh(sunGeom, sunMaterial);
sun.position.set(-orbitDistance, 0, 0); // Move yellow planet (sun) to the right
scene.add(sun);

// 修改 moon 的位置和速度，代表月亮
// Modify the position and speed of the Moon, represent the moon
const moonGeom = new THREE.SphereGeometry(0.5, 16, 16);
const moonMaterial = createPhongMaterial({
    color: new THREE.Color(0x0000D1),
    ambient: 1.0,
    diffusivity: 1.0,
    specularity: 1.0,
    smoothness: 100.0
});
const moon = new THREE.Mesh(moonGeom, moonMaterial);
moon.position.set(orbitDistance, 0, 0); // Set initial position to match green planet's Y position
scene.add(moon);

// Store their initial angles in the Planets array, so that they are 180 ° apart
planets = [
    { mesh: sun, distance: orbitDistance, speed: planetSpeed, initialAngle: 0 },    // 太阳，从 180° 开始
    { mesh: moon, distance: orbitDistance, speed: planetSpeed, initialAngle: Math.PI }           // 月亮，从 0° 开始
];

export { planets, orbitDistance };
