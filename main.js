import * as THREE from 'three';
import { sheep } from './JS/pet.js'
import { scene, camera, renderer, controls } from './JS/sceneSetup.js';
import { translationMatrix, rotationMatrixX, rotationMatrixY, rotationMatrixZ } from './JS/utils.js';
import { planets, orbitDistance } from './JS/planets.js';
import './JS/lighting.js';
import { petStatus, updatePetStatusDisplay, updatePetStatus, iconsToShow, MIN_STATUS, MAX_STATUS } from './JS/status.js';
import { hungerSprite, hygieneSprite, happinessSprite } from './JS/icons.js';
import { handleCameraAttachment, updateCameraPosition } from './JS/cameraControl.js';




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

    const distanceFromCenter = Math.sqrt(newPosition.x ** 2 + newPosition.z ** 2);

    if (distanceFromCenter <= maxRadius) {
        targetPosition.copy(newPosition);
        isMoving = true;
    } else {
        // Beyond the range, turn around and try to move again
        sheep.rotation.y += Math.PI;

        // Calculate the new direction and location
        const adjustedDirection = new THREE.Vector3(0, 0, 1);
        adjustedDirection.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), sheep.rotation.y));

        const adjustedNewPosition = sheep.position.clone().add(adjustedDirection.multiplyScalar(distance));

        const adjustedDistanceFromCenter = adjustedNewPosition.length();

        if (adjustedDistanceFromCenter <= maxRadius) {
            targetPosition.copy(adjustedNewPosition);
            isMoving = true;
        } else {
            // If it is still exceeded and does not move, you can try other actions in the next random action.
            isMoving = false;
        }
    }
}


function adjustSheepHeight() {
    const x = sheep.position.x;
    const z = sheep.position.z;
    const radius = 16; // 球的半径，与 green_geom 的半径一致

    const y = Math.sqrt(Math.max(0, radius * radius - x * x - z * z));

    sheep.position.y = y + 0.2; //0.2 是羊离地面的高度
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

//Making a house on the planet 
function createHouse() {
    const houseGroup = new THREE.Group();

    // Create the base (walls)
    const wallGeometry = new THREE.BoxGeometry(1, 1, 1);
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const walls = new THREE.Mesh(wallGeometry, wallMaterial);
    walls.position.y = 0.5; // Raise walls to sit on the ground
    houseGroup.add(walls);

    // Create the roof
    const roofGeometry = new THREE.ConeGeometry(0.75, 1, 4);
    const roofMaterial = new THREE.MeshStandardMaterial({ color: 0xFF0000 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 1.5; // Place roof on top of walls
    roof.rotation.y = Math.PI / 4; // Align the cone to form a pyramid
    houseGroup.add(roof);

    // Create the door
    const doorGeometry = new THREE.BoxGeometry(0.3, 0.5, 0.1);
    const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 });
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(0, 0.25, 0.51); // Slightly in front of the wall
    houseGroup.add(door);

    return houseGroup;
}


const house = createHouse();
house.position.set(2, 0, 2); // Adjust position as needed
scene.add(house);

function adjustHouseHeight(house, planetRadius) {
    const x = house.position.x;
    const z = house.position.z;
    const y = Math.sqrt(Math.max(0, planetRadius ** 2 - x ** 2 - z ** 2));
    house.position.y = y;
}
adjustHouseHeight(house, 16); // Assuming the planet's radius is 16


function checkPetHouseInteraction() {
    const distanceToHouse = sheep.position.distanceTo(house.position);

    if (distanceToHouse < 1) { // Interaction range
        console.log('Pet is near the house.');
        // Example: Increase happiness or other stats
        updatePetStatusDisplay();
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
    alert('Your Pet has Died'); //TODO: death screen
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
document.addEventListener('keydown', (event) => handleCameraAttachment(event, planets), false);

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


// Day and night system
function updateBackgroundColor(normalizedAngle, isDay) {
    let color;

    if (isDay) {
        // Daytime logic
        if (normalizedAngle > 0.75) {
            // Early Day (Soft Blue)
            const intensity = Math.abs((normalizedAngle - 1) / 0.25); // Normalize from 0 to 1
            color = new THREE.Color(
                0.1 * intensity, // R: Increase red component for light blue
                0.2 * intensity, // G: Increase green component for light blue
                0.3 * intensity  // B: Increase blue component for light blue
            );

        } else if (normalizedAngle <= 0.75 && normalizedAngle > 0) {
            // Midday (Light Blue to Bright Blue)
            const middayIntensity = (0.75 - normalizedAngle) / 0.75; // Normalize to fade from 0 to 1
            color = new THREE.Color(
                0.1 + 0.4 * (middayIntensity), // R: Light blue to bright blue
                0.2 + 0.6 * (middayIntensity), // G: Light green to bright green
                0.3 + 0.65 * (middayIntensity)  // B: Light blue to bright blue
            );

        } else if (normalizedAngle <= 0 && normalizedAngle > -.5) {
            // Mid to late day (Bright Blue to light pink)
            const middayIntensity = Math.abs((0.5 + normalizedAngle) / 0.5); // Normalize to fade from 0 to 1
            color = new THREE.Color(
                0.5 + 0 * (middayIntensity), // R: Light blue to bright blue
                0.2 + 0.6 * (middayIntensity), // G: Light green to bright green
                0.35 + 0.6 * (middayIntensity)  // B: Light blue to bright blue
            );
        } else if (normalizedAngle <= -.5 && normalizedAngle > -1) {
            // late day (light pink to orange)
            const middayIntensity = 1 - Math.abs((0.5 + normalizedAngle) / 0.5); // Normalize to fade from 0 to 1
            color = new THREE.Color(
                0.7 - .2 * (middayIntensity), // R: Light blue to bright blue
                0.25 - .05 * (middayIntensity), // G: Light green to bright green
                0.1 + 0.15 * (middayIntensity)  // B: Light blue to bright blue
            );
        }
        else {

        }
    } else {
        if (normalizedAngle <= -.75 && normalizedAngle > -1) {
            // Late Day (orange to black)
            const lateDayIntensity = 1 - Math.abs((1 + normalizedAngle) / 0.25); // Normalize to fade from 0 to 1
            color = new THREE.Color(
                .7 * (lateDayIntensity),   // R: Constant for warm yellow
                0.25 * (lateDayIntensity), // G: Fade green
                0.1 * (lateDayIntensity)  // B: Fade blue
            );
        } else {
            // Nighttime logic
            color = new THREE.Color(
                0,
                0,
                0,
            );
        }
    }

    scene.background = color;
}




function animate() {
    console.log(`Camera Position: x=${camera.position.x}, y=${camera.position.y}, z=${camera.position.z}`);
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    console.log(`Camera Direction: x=${cameraDirection.x}, y=${cameraDirection.y}, z=${cameraDirection.z}`);

    requestAnimationFrame(animate);

    let time = clock.getElapsedTime();

    if (time - lastActionTime > actionInterval) {
        performRandomAction();
        lastActionTime = time;
    }



    // Update the location of sheep
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
    // Modify the flashing logic
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
    checkPetHouseInteraction();

    // 更新图标的朝向，使其面向摄像机
    [hungerSprite, hygieneSprite, happinessSprite].forEach(sprite => {
        sprite.quaternion.copy(camera.quaternion);
    });


    // TODO: Loop through all the orbiting planets and apply transformation to create animation effect
    planets.forEach(function (obj, index) {
        let planet = obj.mesh;

        let distance = obj.distance;
        let speed = obj.speed;
        let initialAngle = obj.initialAngle;

        // Calculate the position of the planet
        let angle = (initialAngle + speed * time) % (2 * Math.PI);
        let orbitRotation = new THREE.Matrix4().makeRotationZ(angle);
        let translation = new THREE.Matrix4().makeTranslation(distance, 0, 0);
        let model_transform = new THREE.Matrix4().multiplyMatrices(orbitRotation, translation);

        planet.matrix.copy(model_transform);
        planet.matrixAutoUpdate = false;

        // Get the transformed position of the sun
        if (index === 0) { // Only check for the sun
            let sunPosition = new THREE.Vector3();
            planet.getWorldPosition(sunPosition);

            const sunX = sunPosition.x;
            const sunY = sunPosition.y;

            if (sunY > 0) {
                // Daytime
                updateBackgroundColor((sunX / distance), true);
            } else {
                // Nighttime
                updateBackgroundColor((sunX / distance), false);
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

export { scene, lastBlinkTime, currentIconIndex }