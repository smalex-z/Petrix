import * as THREE from 'three';
import { scene, earthRadius, moonRadius, sunRadius, orbitDistance, planetSpeed } from './globalVar.js'
import { createPhongMaterial } from './shaders.js';

let planets = [];
const textureLoader = new THREE.TextureLoader();

// Create the Earth
let earth_geom = new THREE.SphereGeometry(earthRadius, 128, 128);
const earthTexture = textureLoader.load('../assets/images/earth.jpg');

const earthMaterial = new THREE.MeshStandardMaterial({
    map: earthTexture,
});
let earth = new THREE.Mesh(earth_geom, earthMaterial);
earth.rotation.z = Math.PI / 2; // Rotate 90 degrees around X-axis
earth.position.set(0, 0, 0);
earth.castShadow = false; // 地球投射阴影
earth.receiveShadow = true; // 地球接收阴影
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
const sunTexture = textureLoader.load('../assets/images/sun.jpg');
const sunMaterial = new THREE.MeshStandardMaterial({ 
    map: sunTexture, 
    color: new THREE.Color(0xffe600), // Boost saturation
    emissive: new THREE.Color(0xffd700),
    emissiveIntensity: .2,
});

const sun = new THREE.Mesh(sunGeom, sunMaterial);
sun.position.set(-orbitDistance, 0, 0); // Move yellow planet (sun) to the right
sun.castShadow = true; // 太阳投射阴影
scene.add(sun);

// 为太阳添加光源
const sunLight = new THREE.DirectionalLight(0xffd700, 2, 500);

sunLight.castShadow = true;
// 设置阴影摄像机范围
sunLight.shadow.camera.left = -200;
sunLight.shadow.camera.right = 200;
sunLight.shadow.camera.top = 200;
sunLight.shadow.camera.bottom = -200;
sunLight.shadow.camera.near = 0.1;
sunLight.shadow.camera.far = 500;
sunLight.shadow.mapSize.width = 1024; // 提高分辨率
sunLight.shadow.mapSize.height = 1024;
sun.add(sunLight); // 光源跟随太阳移动

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

const moonTexture = textureLoader.load('../assets/images/moon.jpg');
const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });

const moon = new THREE.Mesh(moonGeom, moonMaterial);
moon.position.set(orbitDistance, 0, 0); // Set initial position to match green planet's Y position
moon.castShadow = true; // 月亮投射阴影
moon.receiveShadow = true; // 月亮接收阴影
scene.add(moon);

// 为月亮添加光源
const moonLight = new THREE.DirectionalLight(0x9999ff, 1, 300);
moonLight.castShadow = true;
moonLight.shadow.mapSize.width = 512;
moonLight.shadow.mapSize.height = 512;
moonLight.shadow.camera.near = 0.1;
moonLight.shadow.camera.far = 300;
moon.add(moonLight); // 光源跟随月亮移动

// Store their initial angles in the Planets array, so that they are 180 ° apart
planets = [
    { mesh: sun, distance: orbitDistance, speed: planetSpeed, initialAngle: 0 },    // 太阳，从 180° 开始
    { mesh: moon, distance: orbitDistance, speed: -planetSpeed, initialAngle: 0 }           // 月亮，从 0° 开始
];

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

export { planets, orbitDistance, updatePlanetMaterialUniforms };
