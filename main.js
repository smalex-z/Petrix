import * as THREE from 'three';
import { sheep } from './JS/pet.js'
import { scene, camera, renderer, controls } from './JS/sceneSetup.js'; 
import { translationMatrix, rotationMatrixX, rotationMatrixY, rotationMatrixZ } from './JS/utils.js';
import { planets } from './JS/planets.js';
import './JS/lighting.js';
import { petStatus, updatePetStatusDisplay, updatePetStatus, iconsToShow, MIN_STATUS, MAX_STATUS } from './JS/status.js';
import { hungerSprite, hygieneSprite, happinessSprite } from './JS/icons.js';



// 全局变量
let lastActionTime = 0; // 上次动作的时间
const actionInterval = 2; // 动作间隔时间（秒）
const moveDistance = 0.4; // 每步移动的距离
const maxRadius = 4; // 羊活动的最大半径
const moveSpeed = 0.05; // 羊移动的速度

let isMoving = false; // 羊是否正在移动
let targetPosition = new THREE.Vector3(); // 目标位置
const blinkInterval = 500; // 闪烁间隔，单位为毫秒
let lastBlinkTime = 0; // 上次切换可见性的时间
let currentIconIndex = 0; // 当前显示的图标索引

let clock = new THREE.Clock();
let attachedObject = null;
let blendingFactor = 0.1;
// Create additional variables as needed here



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
            sheep.rotation.y += Math.PI / 2;
            break;
        case 2:
            // 右转
            sheep.rotation.y -= Math.PI / 2;
            break;
        case 3:
            // 前进两步
            moveSheep(moveDistance * 2);
            break;
        case 4:
            // 后退两步
            sheep.rotation.y += Math.PI; // 转身
            moveSheep(moveDistance * 2);
            break;
    }
}

function moveSheep(distance) {
    const direction = new THREE.Vector3(0, 0, 1);
    direction.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), sheep.rotation.y));

    const newPosition = sheep.position.clone().add(direction.multiplyScalar(distance));

    const distanceFromCenter = newPosition.length();

    if (distanceFromCenter <= maxRadius) {
        targetPosition.copy(newPosition);
        isMoving = true;
    } else {
        // 超出范围，转身并尝试再次移动
        sheep.rotation.y += Math.PI;

        // 重新计算新的方向和位置
        const adjustedDirection = new THREE.Vector3(0, 0, 1);
        adjustedDirection.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), sheep.rotation.y));

        const adjustedNewPosition = sheep.position.clone().add(adjustedDirection.multiplyScalar(distance));

        const adjustedDistanceFromCenter = adjustedNewPosition.length();

        if (adjustedDistanceFromCenter <= maxRadius) {
            targetPosition.copy(adjustedNewPosition);
            isMoving = true;
        } else {
            // 如果仍然超出范围，不移动，但可以在下一次随机动作时尝试其他动作
            isMoving = false;
        }
    }
}


function adjustSheepHeight() {
    const x = sheep.position.x;
    const z = sheep.position.z;
    const radius = 4; // 球的半径，与 green_geom 的半径一致

    const y = Math.sqrt(Math.max(0, radius * radius - x * x - z * z));

    sheep.position.y = -5 + y + 0.2; // -5 是球的中心 Y 坐标，0.2 是羊离地面的高度
}



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

function getHungerRange(hunger) {
    if (hunger >= 0 && hunger <= 10) {
        return 1;
    } else if (hunger > 10 && hunger <= 20) {
        return 2;
    } else if (hunger > 20 && hunger <= 30) {
        return 3;
    } else if (hunger > 30 && hunger <= 40) {
        return 4;
    } else if (hunger > 40 && hunger <= 50) {
        return 5;
    } else if (hunger > 50 && hunger <= 70) {
        return 6;
    } else if (hunger > 70 && hunger <= 100) {
        return 7;
    } else {
        return 0;
    }
}


function petDies() {
    alert('你的宠物已经死亡。');
    scene.remove(sheep);

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
document.addEventListener('keydown', onKeyDown, false);

animate();



// This function is used to update the uniform of the planet's materials in the animation step. No need to make any change
function updatePlanetMaterialUniforms(planet) {
    const material = planet.material;
    if (!material.uniforms) return;

    const uniforms = material.uniforms;

    const numLights = 1;
    const lights = scene.children.filter(child => child.isLight).slice(0, numLights);
    // Ensure we have the correct number of lights
    if (lights.length < numLights) {
        console.warn(`Expected ${numLights} lights, but found ${lights.length}. Padding with default lights.`);
    }

    // Update model_transform and projection_camera_model_transform
    planet.updateMatrixWorld();
    camera.updateMatrixWorld();

    uniforms.model_transform.value.copy(planet.matrixWorld);
    uniforms.projection_camera_model_transform.value.multiplyMatrices(
        camera.projectionMatrix,
        camera.matrixWorldInverse
    ).multiply(planet.matrixWorld);

    // Update camera_center
    uniforms.camera_center.value.setFromMatrixPosition(camera.matrixWorld);

    // Update squared_scale (in case the scale changes)
    const scale = planet.scale;
    uniforms.squared_scale.value.set(
        scale.x * scale.x,
        scale.y * scale.y,
        scale.z * scale.z
    );

    // Update light uniforms
    uniforms.light_positions_or_vectors.value = [];
    uniforms.light_colors.value = [];
    uniforms.light_attenuation_factors.value = [];

    for (let i = 0; i < numLights; i++) {
        const light = lights[i];
        if (light) {
            let position = new THREE.Vector4();
            if (light.isDirectionalLight) {
                // For directional lights
                const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(light.quaternion);
                position.set(direction.x, direction.y, direction.z, 0.0);
            } else if (light.position) {
                // For point lights
                position.set(light.position.x, light.position.y, light.position.z, 1.0);
            } else {
                // Default position
                position.set(0.0, 0.0, 0.0, 1.0);
            }
            uniforms.light_positions_or_vectors.value.push(position);

            // Update light color
            const color = new THREE.Vector4(light.color.r, light.color.g, light.color.b, 1.0);
            uniforms.light_colors.value.push(color);

            // Update attenuation factor
            let attenuation = 0.0;
            if (light.isPointLight || light.isSpotLight) {
                const distance = light.distance || 1000.0; // Default large distance
                attenuation = 1.0 / (distance * distance);
            } else if (light.isDirectionalLight) {
                attenuation = 0.0; // No attenuation for directional lights
            }
            // Include light intensity
            const intensity = light.intensity !== undefined ? light.intensity : 1.0;
            attenuation *= intensity;

            uniforms.light_attenuation_factors.value.push(attenuation);
        } else {
            // Default light values
            uniforms.light_positions_or_vectors.value.push(new THREE.Vector4(0.0, 0.0, 0.0, 0.0));
            uniforms.light_colors.value.push(new THREE.Vector4(0.0, 0.0, 0.0, 1.0));
            uniforms.light_attenuation_factors.value.push(0.0);
        }
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// TODO: Implement the camera attachment given the key being pressed
// Hint: This step you only need to determine the object that are attached to and assign it to a variable you have to store the attached object.
function onKeyDown(event) {
    switch (event.key) {
        case '3': // Attach camera to Planet 3
            attachedObject = 0; // Index for Planet 3
            controls.enabled = false;
            break;
        case '4': // Attach camera to Planet 4
            attachedObject = 1; // Index for Planet 4
            controls.enabled = false;
            break;
        case '0': // Detach camera and return to default view
            attachedObject = null;
            camera.position.set(0, 10, 20); // Default position
            camera.lookAt(0, 0, 0); // Look at the origin
            controls.enabled = true; // Enable orbit controls
            break;
    }
}

// Day and night system
function updateBackgroundColor(angle, isDay) {
    let color;
    let intensity;

    if (isDay) { // 白天
        if (angle < Math.PI / 2) {
            intensity = angle / (Math.PI / 2);
            color = new THREE.Color(0.5 * intensity, 0.7 * intensity, 1 * intensity);
        } else {
            intensity = (Math.PI - angle) / (Math.PI / 2);
            color = new THREE.Color(0.5 * intensity, 0.7 * intensity, 1 * intensity);
        }
    } else { // 夜晚
        if (angle < Math.PI / 2) {
            intensity = 1 - angle / (Math.PI / 2);
            color = new THREE.Color(0.05 * intensity, 0.05 * intensity, 0.2 * intensity);
        } else {
            intensity = (angle - Math.PI / 2) / (Math.PI / 2);
            color = new THREE.Color(0.05 * intensity, 0.05 * intensity, 0.2 * intensity);
        }
    }

    scene.background = color;
}



function animate() {
    requestAnimationFrame(animate);

    let time = clock.getElapsedTime();



    if (time - lastActionTime > actionInterval) {
        performRandomAction();
        lastActionTime = time;
    }




    // 更新羊的位置
    if (isMoving) {
        let delta = targetPosition.clone().sub(sheep.position);
        let distanceToTarget = delta.length();
        if (distanceToTarget > moveSpeed) {
            delta.normalize().multiplyScalar(moveSpeed);
            sheep.position.add(delta);
            adjustSheepHeight();
        } else {
            sheep.position.copy(targetPosition);
            adjustSheepHeight();
            isMoving = false;
        }
    }
    // 修改闪烁逻辑
    if (iconsToShow.length > 0) {
        let now = Date.now();
        if (now - lastBlinkTime >= blinkInterval) {
            // 切换可见性
            if (iconsToShow[currentIconIndex].visible) {
                // 当前图标可见，隐藏它
                iconsToShow[currentIconIndex].visible = false;
            } else {
                // 当前图标不可见，切换到下一个图标并显示
                currentIconIndex = (currentIconIndex + 1) % iconsToShow.length;
                iconsToShow[currentIconIndex].visible = true;
            }
            // 重置计时器
            lastBlinkTime = now;
        }
    }

    // 更新图标的朝向，使其面向摄像机
    [hungerSprite, hygieneSprite, happinessSprite].forEach(sprite => {
        sprite.quaternion.copy(camera.quaternion);
    });


    // TODO: Loop through all the orbiting planets and apply transformation to create animation effect
    planets.forEach(function (obj, index) {
        let planet = obj.mesh;

        let distance = obj.distance;
        let speed = obj.speed;
        let initialAngle = obj.initialAngle; // 获取初始角度

        // 计算星体的位置，应用初始角度并进行顺时针旋转
        let angle = (initialAngle - speed * time) % (2 * Math.PI);
        //if (angle < 0) angle += 2 * Math.PI; // 确保 angle 在 [0, 2 * Math.PI] 范围内
        let orbitRotation = new THREE.Matrix4().makeRotationZ(angle); // 改为 Z 轴旋转
        let translation = new THREE.Matrix4().makeTranslation(distance, 0, 3); // 沿 x 轴平移
        let model_transform = new THREE.Matrix4().multiplyMatrices(orbitRotation, translation);



        planet.matrix.copy(model_transform);
        planet.matrixAutoUpdate = false;

        // 判断是白天还是夜晚
        if (index === 0 && angle >= 0 && angle < Math.PI) {
            updateBackgroundColor(angle, true); // 白天
        } else if (index === 1 && angle >= Math.PI && angle < 2 * Math.PI) {
            updateBackgroundColor(angle - Math.PI, false); // 夜晚
        }


        updatePlanetMaterialUniforms(planet);




        // Camera attachment logic here, when certain planet is being attached, we want the camera to be following the planet by having the same transformation as the planet itself. No need to make changes.
        if (attachedObject === index) {
            let cameraTransform = new THREE.Matrix4();

            // Copy the transformation of the planet (Hint: for the wobbling planet 3, you might have to rewrite to the model_tranform so that the camera won't wobble together)
            cameraTransform.copy(model_transform);

            // Add a translation offset of (0, 0, 10) in front of the planet
            let offset = translationMatrix(0, 0, 10);
            cameraTransform.multiply(offset);

            // Apply the new transformation to the camera position
            let cameraPosition = new THREE.Vector3();
            cameraPosition.setFromMatrixPosition(cameraTransform);
            camera.position.lerp(cameraPosition, blendingFactor);

            // Make the camera look at the planet
            let planetPosition = new THREE.Vector3();
            planetPosition.setFromMatrixPosition(planet.matrix);
            camera.lookAt(planetPosition);

            // Disable controls
            controls.enabled = false;
            // TODO: If camera is detached, slowly lerp the camera back to the original position and look at the origin
        } else if (attachedObject === null) {
            let defaultPosition = new THREE.Vector3(0, 0, 0);
            camera.position.lerp(defaultPosition, 0.1);
            let lookAtPosition = new THREE.Vector3(0, 0, 0); // 摄像机稍微往下看
            camera.lookAt(lookAtPosition);
            // Enable controls
            controls.enabled = true;
        }
    });



    // Update controls only when the camera is not attached
    if (controls.enabled) {
        controls.update();
    }

    renderer.render(scene, camera);
}

export { scene }