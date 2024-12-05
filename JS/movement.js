import * as THREE from 'three';

import { adjustItemHeight, chosenPet, unselectedPets } from './globalVar.js';

const moveDistance = 0.4; // 每步移动的距离
const maxRadius = 4; // 羊活动的最大半径


function performRandomAction() {
    // 移除以下行，让羊在每次动作间隔都能执行新的随机动作
    // if (isMoving) return;

    unselectedPets.forEach(pet => {
        const action = Math.floor(Math.random() * 5);

        switch (action) {
            case 0:
                // 不动
                pet.isMoving = false;
                break;
            case 1:
                // 左转
                pet.rotation.y += Math.PI / 2;
                break;
            case 2:
                // 右转
                pet.rotation.y -= Math.PI / 2;
                break;
            case 3:
                // 前进两步
                movePet(pet, moveDistance * 2);
                break;
            case 4:
                // 后退两步
                pet.rotation.y += Math.PI; // 转身
                movePet(pet, moveDistance * 2);
                break;
        }
    });
}

function movePet(pet, distance) {
    const direction = new THREE.Vector3(0, 0, 1);
    direction.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), pet.rotation.y));

    const newPosition = pet.position.clone().add(direction.multiplyScalar(distance));

    const distanceFromCenter = Math.sqrt(newPosition.x ** 2 + newPosition.z ** 2);

    if (distanceFromCenter <= maxRadius) {
        pet.targetPosition.copy(newPosition);
        pet.isMoving = true;
    } else {
        // Beyond the range, turn around and try to move again
        pet.rotation.y += Math.PI;

        // Calculate the new direction and location
        const adjustedDirection = new THREE.Vector3(0, 0, 1);
        adjustedDirection.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), pet.rotation.y));

        const adjustedNewPosition = pet.position.clone().add(adjustedDirection.multiplyScalar(distance));

        const adjustedDistanceFromCenter = adjustedNewPosition.length();

        if (adjustedDistanceFromCenter <= maxRadius) {
            pet.targetPosition.copy(adjustedNewPosition);
            pet.isMoving = true;
        } else {
            // If it is still exceeded and does not move, you can try other actions in the next random action.
            pet.rotation.y += Math.PI;
        }
    }
}

// Movement speed for the chosen pet
const moveSpeed = 0.05;

// Flags to track which keys are pressed
var keysPressed = {
    w: false,
    a: false,
    s: false,
    d: false,
};

// Listen for keydown and keyup events
document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (keysPressed.hasOwnProperty(key)) {
        keysPressed[key] = true;
    }
});

document.addEventListener('keyup', (event) => {
    const key = event.key.toLowerCase();
    if (keysPressed.hasOwnProperty(key)) {
        keysPressed[key] = false;
    }
});

function moveChosenPet() {
    if (keysPressed.w) {
        chosenPet.position.z -= moveSpeed; // Move forward
    }
    if (keysPressed.s) {
        chosenPet.position.z += moveSpeed; // Move backward
    }
    if (keysPressed.a) {
        chosenPet.position.x -= moveSpeed; // Move left
    }
    if (keysPressed.d) {
        chosenPet.position.x += moveSpeed; // Move right
    }
    adjustItemHeight(chosenPet , -.25);
}

export { performRandomAction, movePet, moveChosenPet };
