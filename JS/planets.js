import * as THREE from 'three';
import { createPhongMaterial } from './shaders.js';
import { scene } from './sceneSetup.js';


let planets = [];

// Create orbiting planets
const orbitDistance = 3; // 调整为更靠近中心的距离
const planetSpeed = 0.02; // 设置它们的相同速度


// TODO: Create the green
let green_geom = new THREE.SphereGeometry(4, 32, 32);
let green_material = new THREE.MeshBasicMaterial({ color: 0x32cd32 });
let green = new THREE.Mesh(green_geom, green_material);
green.position.set(0, -5, 0);
scene.add(green);


// 修改 sun 的位置和速度，代表太阳
const sunGeom = new THREE.SphereGeometry(0.5, 16, 16);
const sunMaterial = createPhongMaterial({
    color: new THREE.Color(0xffff00),
    ambient: 1.0,
    diffusivity: 1.0,
    specularity: 1.0,
    smoothness: 100.0

});
const sun = new THREE.Mesh(sunGeom, sunMaterial);
sun.position.set(orbitDistance, -3, 0); // Move yellow planet (sun) to the right
scene.add(sun);

// 修改 moon 的位置和速度，代表月亮
const moonGeom = new THREE.SphereGeometry(0.5, 16, 16);
const moonMaterial = createPhongMaterial({
    color: new THREE.Color(0x0000D1),
    ambient: 1.0,
    diffusivity: 1.0,
    specularity: 1.0,
    smoothness: 100.0
});
const moon = new THREE.Mesh(moonGeom, moonMaterial);
moon.position.set(-orbitDistance, -3, 0); // Set initial position to match green planet's Y position
scene.add(moon);

// 在 planets 数组中存储它们的初始角度，使它们相距 180°
planets = [
    { mesh: sun, distance: orbitDistance, speed: planetSpeed, initialAngle: Math.PI },    // 太阳，从 180° 开始
    { mesh: moon, distance: orbitDistance, speed: planetSpeed, initialAngle: 0 }           // 月亮，从 0° 开始
];

export { planets };
