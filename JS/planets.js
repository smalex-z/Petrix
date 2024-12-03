import * as THREE from 'three';
import { scene, earthRadius, moonRadius, sunRadius, orbitDistance, planetSpeed } from './globalVar.js'
import { createPhongMaterial } from './shaders.js';


let planets = [];
const textureLoader = new THREE.TextureLoader();

// Create the Earth
let earth_geom = new THREE.SphereGeometry(earthRadius, 32, 32);
const earthTexture = textureLoader.load('../images/earth.jpg');

const earthMaterial = new THREE.MeshStandardMaterial({ 
    map: earthTexture, 
});
let earth = new THREE.Mesh(earth_geom, earthMaterial);
earth.rotation.z = Math.PI / 2; // Rotate 90 degrees around X-axis
earth.position.set(0, 0, 0);
scene.add(earth);


// 修改 sun 的位置和速度，代表太阳
const sunGeom = new THREE.SphereGeometry(sunRadius, 64, 64);
// const sunMaterial = createPhongMaterial({
//     color: new THREE.Color(0xffff00),
//     ambient: 1.0,
//     diffusivity: 1.0,
//     specularity: 1.0,
//     smoothness: 100.0
// });

// TODO: Make the Sun Brighter
const sunTexture = textureLoader.load('../images/sun.jpg');
const sunMaterial = new THREE.MeshStandardMaterial({ 
    map: sunTexture, 
    color: new THREE.Color(0xffe600), // Boost saturation
    emissive: new THREE.Color(0xffd700),
    emissiveIntensity: .2,
});

const sun = new THREE.Mesh(sunGeom, sunMaterial);
sun.position.set(-orbitDistance, 0, 0); // Move yellow planet (sun) to the right
scene.add(sun);

// 修改 moon 的位置和速度，代表月亮
// Modify the position and speed of the Moon, represent the moon
const moonGeom = new THREE.SphereGeometry(moonRadius, 16, 16);
// const moonMaterial = createPhongMaterial({
//     color: new THREE.Color(0x0000D1),
//     ambient: 1.0,
//     diffusivity: 1.0,
//     specularity: 1.0,
//     smoothness: 100.0
// });

const moonTexture = textureLoader.load('../images/moon.jpg');
const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });

const moon = new THREE.Mesh(moonGeom, moonMaterial);
moon.position.set(orbitDistance, 0, 0); // Set initial position to match green planet's Y position
scene.add(moon);

// Store their initial angles in the Planets array, so that they are 180 ° apart
planets = [
    { mesh: sun, distance: orbitDistance, speed: planetSpeed, initialAngle: 0 },    // 太阳，从 180° 开始
    { mesh: moon, distance: orbitDistance, speed: -planetSpeed, initialAngle: 0 }           // 月亮，从 0° 开始
];

export { planets, orbitDistance };
