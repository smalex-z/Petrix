import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { scene, earthRadius } from './globalVar.js';

//Making a basic chicken on the planet 

// FULL CREDIT TO THE CREATOR FOR THE Chicken MODEL HERE:
// https://sketchfab.com/3d-models/chicken-stardew-valley-fan-art-8e3ac6635967406f933f6daf90d807f8#download
const loader = new GLTFLoader();

let importChicken;

loader.load('../assets/SV-chickens/8e3ac6635967406f933f6daf90d807f8_Textured.gltf', function (gltf) {
    console.log('Loaded GLTF:', gltf);
    
    //chicken 
    importChicken = gltf.scene; // Get the chicken object
    importChicken.scale.set(50, 50, 50); // Double the size along all axes
    importChicken.position.set(-5, 0, 5); // Adjust position as needed

    scene.add(importChicken);

    
    // 确保房子所有子对象启用了阴影
    // importChicken.traverse((node) => {
    //     if (node.isMesh) {
    //         node.castShadow = true;  // 投射阴影
    //         node.receiveShadow = true; // 接收阴影
    //     }
    // });

    adjustchickenHeight(importChicken, earthRadius);
}, undefined, function (error) {
    console.error('Error loading GLTF:', error);
});

function adjustchickenHeight(chicken, earthRadius) {
    console.log("adjusting")
    const x = chicken.position.x;
    const z = chicken.position.z;
    const y = Math.sqrt(Math.max(0, earthRadius ** 2 - x ** 2 - z ** 2));
    chicken.position.y = y;
}