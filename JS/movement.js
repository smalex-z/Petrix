import * as THREE from 'three';

import { scene, camera, renderer, controls, earthRadius, blinkTime, iconIndex, 
    MIN_STATUS, MAX_STATUS, chosenPet } from './globalVar.js';

const moveDistance = 0.4; // 每步移动的距离
const maxRadius = 4; // 羊活动的最大半径
var isMoving = false; // 羊是否正在移动
var targetPosition = new THREE.Vector3(); // 目标位置


function performRandomAction() {
    // 移除以下行，让羊在每次动作间隔都能执行新的随机动作
    // if (isMoving) return;

    const action = Math.floor(Math.random() * 5);

    switch (action) {
        case 0:
            // 不动
            isMoving = false;
            break;
        case 1:
            // 左转
            chosenPet.rotation.y += Math.PI / 2;
            break;
        case 2:
            // 右转
            chosenPet.rotation.y -= Math.PI / 2;
            break;
        case 3:
            // 前进两步
            movePet(moveDistance * 2);
            break;
        case 4:
            // 后退两步
            chosenPet.rotation.y += Math.PI; // 转身
            movePet(moveDistance * 2);
            break;
    }
}

function movePet(distance) {
    const direction = new THREE.Vector3(0, 0, 1);
    direction.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), chosenPet.rotation.y));

    const newPosition = chosenPet.position.clone().add(direction.multiplyScalar(distance));

    const distanceFromCenter = Math.sqrt(newPosition.x ** 2 + newPosition.z ** 2);

    if (distanceFromCenter <= maxRadius) {
        targetPosition.copy(newPosition);
        isMoving = true;
    } else {
        // Beyond the range, turn around and try to move again
        chosenPet.rotation.y += Math.PI;

        // Calculate the new direction and location
        const adjustedDirection = new THREE.Vector3(0, 0, 1);
        adjustedDirection.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), chosenPet.rotation.y));

        const adjustedNewPosition = chosenPet.position.clone().add(adjustedDirection.multiplyScalar(distance));

        const adjustedDistanceFromCenter = adjustedNewPosition.length();

        if (adjustedDistanceFromCenter <= maxRadius) {
            targetPosition.copy(adjustedNewPosition);
            isMoving = true;
        } else {
            // If it is still exceeded and does not move, you can try other actions in the next random action.
            chosenPet.rotation.y += Math.PI;
        }
    }
}

function adjustPetHeight() {
    const x = chosenPet.position.x;
    const z = chosenPet.position.z;

    const y = Math.sqrt(Math.max(0, earthRadius * earthRadius - x * x - z * z));

    chosenPet.position.y = y + 0.2; //0.2 是羊离地面的高度
}

function setMoving(bool) {
    isMoving = bool;
}

export { performRandomAction, movePet, adjustPetHeight, isMoving, setMoving, targetPosition};
