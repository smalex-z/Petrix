import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { scene, housePosition, adjustItemHeight } from './globalVar.js';


//Making a basic house on the planet 
//NOT USED ATM
function createHouse() {
    const houseGroup = new THREE.Group();

    // Create the base (walls)
    const wallGeometry = new THREE.BoxGeometry(1, 1, 1);
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const walls = new THREE.Mesh(wallGeometry, wallMaterial);
    walls.position.y = 0.5; // Raise walls to sit on the ground
    //walls.castShadow = true; // 投射阴影
    //walls.receiveShadow = true; // 接收阴影
    houseGroup.add(walls);

    // Create the roof
    const roofGeometry = new THREE.ConeGeometry(0.75, 1, 4);
    const roofMaterial = new THREE.MeshStandardMaterial({ color: 0xFF0000 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 1.5; // Place roof on top of walls
    roof.rotation.y = Math.PI / 4; // Align the cone to form a pyramid
    //roof.castShadow = true;
    //roof.receiveShadow = true;
    houseGroup.add(roof);

    // Create the door
    const doorGeometry = new THREE.BoxGeometry(0.3, 0.5, 0.1);
    const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 });
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(0, 0.25, 0.51); // Slightly in front of the wall
    //door.castShadow = true;
    //door.receiveShadow = true;
    houseGroup.add(door);

    return houseGroup;
}

const house = createHouse();
house.position.set(0, 0.5, 0); // 调整屋子的高度和位置
// 确保房子的所有子对象启用阴影

// FULL CREDIT TO THE CREATOR FOR THE HOUSE MODEL HERE:
// https://sketchfab.com/3d-models/stardew-valley-cabin-98daf2e9e1c0468cbb322c1a97d672a1
const loader = new GLTFLoader();
let importHouse;

loader.load('../assets/stardew_valley_cabin/scene.gltf', function (gltf) {
    //House 
    importHouse = gltf.scene; // Get the house object
    importHouse.scale.set(2, 2, 2); // Double the size along all axes
    importHouse.position.copy(housePosition); // Adjust position as needed

    scene.add(importHouse);

    // 确保房子所有子对象启用了阴影
    importHouse.traverse((node) => {
        if (node.isMesh) {
            node.castShadow = true;  // 投射阴影
            node.receiveShadow = true; // 接收阴影
        }
    });

    //Support Block
    const blockGeometry = new THREE.BoxGeometry(3, .5, 3); // Adjust size as needed
    const blockMaterial = new THREE.MeshStandardMaterial({ color: 0x6b8530 }); // Green color
    const supportBlock = new THREE.Mesh(blockGeometry, blockMaterial);
    supportBlock.position.set(housePosition.x - .375, 0, housePosition.z - .45);

    scene.add(supportBlock);

    adjustItemHeight(importHouse, 0);
    adjustItemHeight(supportBlock, .25);
});

export { importHouse, house };
