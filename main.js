import * as THREE from 'three';
import { scene, camera, renderer, controls, earthRadius, blinkTime, iconIndex, 
    MIN_STATUS, MAX_STATUS, chosenPet, unselectedPets, initializeUnselectedPets,  
    adjustItemHeight} from './JS/globalVar.js';
import { translationMatrix, rotationMatrixX, rotationMatrixY, rotationMatrixZ } from './JS/utils.js';
import { handleCameraAttachment, updateCameraPosition } from './JS/cameraControl.js';
import { createPetSelectionPopup, pauseBeforeSelection, setupBoundingBoxes, toggleBoundingBoxes, updateBoundingBoxes } from './JS/setup.js';
import { sunLight, moonLight, sunTarget, moonTarget, updateBackgroundColor } from './JS/lighting.js';
import { performRandomAction, moveChosenPet } from './JS/movement.js';;

import { importHouse, house } from './JS/house.js';
import { planets, orbitDistance, updatePlanetMaterialUniforms } from './JS/planets.js';
import { petStatus, updatePetStatusDisplay, updatePetStatus, iconsToShow } from './JS/status.js';
import { hungerSprite, hygieneSprite, happinessSprite, addSprite } from './JS/icons.js';



// 全局变量
let lastActionTime = 0; // 上次动作的时间
const actionInterval = 1; // 动作间隔时间（秒）
const moveSpeed = 0.05; // 羊移动的速度

const blinkInterval = 500; // 闪烁间隔，单位为毫秒

let clock = new THREE.Clock();
// Create additional variables as needed here
var petBoundingBox;
var houseBoundingBox;
var unselectedPetsBoundingBoxes = [];



// 获取交互栏的元素
const interactionTitle = document.getElementById('interaction-title');
const interactionButtons = document.getElementById('interaction-buttons');

// 初始状态下隐藏按钮
interactionButtons.style.display = 'none';

// 添加点击事件监听器
interactionTitle.addEventListener('click', () => {
    // 切换显示和隐藏
    if (interactionButtons.style.display === 'none' || interactionButtons.style.display === '') {
        interactionButtons.style.display = 'block';
    } else {
        interactionButtons.style.display = 'none';
    }
});


// 获取按钮元素
const feedButton = document.getElementById('feed-button');
const cleanButton = document.getElementById('clean-button');
const playButton = document.getElementById('play-button');

// 为按钮添加事件监听器
feedButton.addEventListener('click', () => {
    if (petStatus.petAlive) {
        // 饥饿度恢复 5（减少饥饿度值 5）
        petStatus.hunger = Math.max(petStatus.hunger - 5, MIN_STATUS);
        // 生命值恢复 3
        petStatus.life = Math.min(petStatus.life + 3, MAX_STATUS);
        updatePetStatusDisplay();
    }
});

cleanButton.addEventListener('click', () => {
    if (petStatus.petAlive) {
        // 卫生度恢复 5
        petStatus.hygiene = Math.min(petStatus.hygiene + 5, MAX_STATUS);
        // 生命值恢复 2
        petStatus.life = Math.min(petStatus.life + 2, MAX_STATUS);
        updatePetStatusDisplay();
    }
});

playButton.addEventListener('click', () => {
    if (petStatus.petAlive) {
        // 快乐度恢复 5
        petStatus.happiness = Math.min(petStatus.happiness + 5, MAX_STATUS);
        // 生命值恢复 1
        petStatus.life = Math.min(petStatus.life + 1, MAX_STATUS);
        updatePetStatusDisplay();
    }
});

// Add a key event listener for the toggle
window.addEventListener('keydown', (event) => {
    if (event.key === '`') { // Backtick key
        toggleBoundingBoxes();
    }
});



let lifeDecreaseInterval = null; // 存储生命值减少的定时器

function updateLifeDecreaseInterval() {
    // 先清除之前的定时器
    if (lifeDecreaseInterval) {
        clearInterval(lifeDecreaseInterval);
    }

    let interval = 0;

    // 根据饥饿度设置生命值减少的间隔
    const hunger = petStatus.hunger;

    if (hunger >= 0 && hunger <= 10) {
        interval = 30000; // 30 秒
    } else if (hunger > 10 && hunger <= 20) {
        interval = 25000; // 25 秒
    } else if (hunger > 20 && hunger <= 30) {
        interval = 20000; // 20 秒
    } else if (hunger > 30 && hunger <= 40) {
        interval = 15000; // 15 秒
    } else if (hunger > 40 && hunger <= 50) {
        interval = 10000; // 10 秒
    } else if (hunger > 50 && hunger <= 70) {
        interval = 5000;  // 5 秒
    } else if (hunger > 70 && hunger <= 100) {
        interval = 1000;  // 1 秒
    }

    // 如果间隔为 0，不需要减少生命值
    if (interval > 0) {
        lifeDecreaseInterval = setInterval(() => {
            if (petStatus.petAlive) {
                petStatus.life = Math.max(petStatus.life - 1, MIN_STATUS);

                // 如果生命值降为 0，宠物死亡
                if (petStatus.life <= 0) {
                    petStatus.petAlive = false;
                    petDies();
                }

                updatePetStatusDisplay();
            }
        }, interval);
    }
}

function petDies() {
    alert('Your Pet has Died'); //TODO: death screen
    scene.remove(chosenPet);

    // 清除定时器
    clearInterval(lifeDecreaseInterval);
    lifeDecreaseInterval = null;
}




// 每秒钟调用一次 updatePetStatus
setInterval(updatePetStatus, 1000);

// 初始化生命值减少的定时器
updateLifeDecreaseInterval();



// Handle window resize
window.addEventListener('resize', onWindowResize, false);

// Handle keyboard input
document.addEventListener('keydown', (event) => handleCameraAttachment(event, planets), false);

pauseBeforeSelection();
createPetSelectionPopup();

let isInSafeZone = false; // Tracks if the pet is in the safe zone
let safeZoneRadius = 2.5; // Minimum distance pet must maintain from the house
let collisionCooldown = false; // Cooldown to prevent repeated collisions

function checkCollisions() {
    // Update bounding boxes
    petBoundingBox.setFromObject(chosenPet);
    houseBoundingBox.setFromObject(importHouse);

    unselectedPetsBoundingBoxes.forEach((boundingBox, index) => {
        boundingBox.setFromObject(unselectedPets[index]);
    });

    // Create a buffer zone by expanding the house's bounding box
    const bufferedBoundingBox = houseBoundingBox.clone();
    bufferedBoundingBox.expandByScalar(0.5); // Adjust buffer size as needed

    // Calculate distance and direction between pet and house
    const direction = chosenPet.position.clone().sub(importHouse.position).normalize();
    const distanceToHouse = chosenPet.position.distanceTo(importHouse.position);

    // If the pet is too close to the house, adjust its position
    if (distanceToHouse < safeZoneRadius) {
        //console.log("Pet is trying to enter the safe zone. Adjusting position.");

        // Move the pet outward to maintain the safe zone radius
        const moveDistance = safeZoneRadius - distanceToHouse;
        chosenPet.position.add(direction.multiplyScalar(moveDistance));
    }

    // Check if the pet is inside the buffer zone and move it away if necessary
    if (petBoundingBox.intersectsBox(bufferedBoundingBox) && !collisionCooldown) {
        //console.log("Collision detected! Moving pet away.");

        // Move the pet outward based on the buffer zone
        const moveDistance = 0.5; // Adjust the distance to fully clear the buffer zone
        chosenPet.position.add(direction.multiplyScalar(moveDistance));

        // Activate cooldown to prevent rapid collision responses
        collisionCooldown = true;
        setTimeout(() => {
            collisionCooldown = false;
        }, 1000); // 1-second cooldown
    }

    // Check collision between unselected pets and house
    unselectedPetsBoundingBoxes.forEach((boundingBox, index) => {
        if (boundingBox.intersectsBox(houseBoundingBox)) {
            // Handle collision for unselected pet
            const direction = unselectedPets[index].position.clone().sub(importHouse.position).normalize();
            unselectedPets[index].position.add(direction.multiplyScalar(0.5)); // Adjust as needed
        }
    });

    // Optional: Check collisions between pets themselves (if needed)
    unselectedPetsBoundingBoxes.forEach((boundingBox1, i) => {
        unselectedPetsBoundingBoxes.forEach((boundingBox2, j) => {
            if (i !== j && boundingBox1.intersectsBox(boundingBox2)) {
                // Handle collision logic between unselected pets (e.g., adjust their positions)
                const direction = unselectedPets[i].position
                    .clone()
                    .sub(unselectedPets[j].position)
                    .normalize();
                unselectedPets[i].position.add(direction.multiplyScalar(0.2)); // Adjust as needed
            }
        });
    });
}



function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function startGame(selectedPet) {
    
    initializeUnselectedPets(selectedPet)
    // Bounding Boxes
    petBoundingBox = new THREE.Box3().setFromObject(chosenPet);
    houseBoundingBox = new THREE.Box3().setFromObject(importHouse);
    unselectedPetsBoundingBoxes = unselectedPets.map((pet) => new THREE.Box3().setFromObject(pet));

    setupBoundingBoxes();
    addSprite();

    animate(); // Resume rendering
}

renderer.shadowMap.enabled = true; // 启用阴影映射
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 使用柔和阴影

function animate() {

    requestAnimationFrame(animate);

    // 获取太阳和月亮的当前位置
    const sunPosition = new THREE.Vector3();
    planets[0].mesh.getWorldPosition(sunPosition);

    const moonPosition = new THREE.Vector3();
    planets[1].mesh.getWorldPosition(moonPosition);

    // 更新目标点到房子的位置
    sunTarget.position.set(house.position.x, house.position.y, house.position.z);
    moonTarget.position.set(house.position.x, house.position.y, house.position.z);

    // 更新光源位置
    sunLight.position.copy(sunPosition);
    moonLight.position.copy(moonPosition);

    // 动态更新光源目标点
    sunLight.target.position.copy(house.position);
    moonLight.target.position.copy(house.position);


    let time = clock.getElapsedTime();

    if (time - lastActionTime > actionInterval) {
        performRandomAction();
        lastActionTime = time;
    }

    moveChosenPet();
    updateBoundingBoxes();
    checkCollisions();
   

    // Update the location of pet
    unselectedPets.forEach(pet => {
        if (pet.isMoving) {
            checkCollisions();
            const delta = pet.targetPosition.clone().sub(pet.position);
            const distanceToTarget = delta.length();

            if (distanceToTarget > moveSpeed) {
                // Normalize direction and move
                delta.normalize().multiplyScalar(moveSpeed);
                pet.position.add(delta);
            } else {
                // Snap to the target position
                pet.position.copy(pet.targetPosition);
                pet.isMoving = false; // Stop moving
            }

            // Adjust height based on the environment
            adjustItemHeight(pet, -.25);
        }
    });

    // Modify the flashing logic
    if (iconsToShow.length > 0) {
        let now = Date.now();

        if (now - blinkTime.lastBlinkTime >= blinkInterval) {
            // 切换可见性
            if (iconsToShow[iconIndex.currentIconIndex].visible) {
                // 当前图标可见，隐藏它
                iconsToShow[iconIndex.currentIconIndex].visible = false;
            } else {
                // 当前图标不可见，切换到下一个图标并显示
                iconIndex.currentIconIndex = (iconIndex.currentIconIndex + 1) % iconsToShow.length;
                iconsToShow[iconIndex.currentIconIndex].visible = true;
                console.log("flash please")
                console.log(iconsToShow[iconIndex.currentIconIndex].position)
            }
            // 重置计时器
            blinkTime.lastBlinkTime = now;
        }
    }


    // Update the orientation of the icon, so that it faces the camera
    [hungerSprite, hygieneSprite, happinessSprite].forEach(sprite => {
        sprite.quaternion.copy(camera.quaternion);
    });


    // Rotation Logic
    planets.forEach(function (obj, index) {
        let planet = obj.mesh;

        let distance = obj.distance;
        let speed = obj.speed;
        let initialAngle = obj.initialAngle;

        // Calculate the position of the planet
        let angle = (initialAngle + speed * time) % (2 * Math.PI);

        let orbitRotation = new THREE.Matrix4().makeRotationZ(angle);
        let translation = new THREE.Matrix4().makeTranslation(distance, 0, 0);

        const tiltAngle = Math.PI / 4; // 45 degrees
        const rotAngle = Math.PI / 2;


        let model_transform;


        if (index === 0) { // Sun Rotation
            // Sun-specific orbit: Tilted at 45 degrees
            model_transform = new THREE.Matrix4()
                .multiply(rotationMatrixY(-rotAngle))
                .multiply(rotationMatrixX(tiltAngle))
                .multiply(orbitRotation)
                .multiply(translation);
        } else {
            // Moon-specific orbit: Tilted at -45 degrees
            // Combine tilt with the normal orbit rotation and translation
            model_transform = new THREE.Matrix4()
                .multiply(rotationMatrixY(rotAngle))
                .multiply(rotationMatrixX(tiltAngle))
                .multiply(orbitRotation)
                .multiply(translation);
        }
        planet.matrix.copy(model_transform);
        planet.matrixAutoUpdate = false;

        // Get the transformed position of the sun
        if (index === 0) { // Only check for the sun
            let sunPosition = new THREE.Vector3();
            planet.getWorldPosition(sunPosition);

            const sunY = sunPosition.y;

            if (sunY > 0) {
                // Daytime
                updateBackgroundColor((angle / (2 * Math.PI)), true);
            } else {
                // Nighttime
                updateBackgroundColor((angle / (2 * Math.PI)), false);
            }
        }

        updatePlanetMaterialUniforms(planet);

        // Update the camera position based on attachment
        updateCameraPosition(index, planet, model_transform);
    });

    // Update controls only when the camera is not attached
    if (controls.enabled) {
        controls.update();
    }

    renderer.render(scene, camera);
}

export { startGame }