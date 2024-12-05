import * as THREE from 'three';
import { scene } from './globalVar.js';
import { orbitDistance } from './planets.js';

// 太阳光源
const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
sunLight.position.set(-orbitDistance, orbitDistance, orbitDistance);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 4096; // 提高分辨率
sunLight.shadow.mapSize.height = 4096;
sunLight.shadow.camera.left = -50;
sunLight.shadow.camera.right = 50;
sunLight.shadow.camera.top = 50;
sunLight.shadow.camera.bottom = -50;
sunLight.shadow.camera.near = 0.1;
sunLight.shadow.camera.far = 500;
scene.add(sunLight);

// 太阳目标点
const sunTarget = new THREE.Object3D();
sunTarget.position.set(0, 0, 0); // 默认目标点为场景中心
scene.add(sunTarget);
sunLight.target = sunTarget;

// 月亮光源
const moonLight = new THREE.DirectionalLight(0x333366, 5);
moonLight.position.set(orbitDistance, orbitDistance, -orbitDistance);
moonLight.castShadow = true;
moonLight.shadow.mapSize.width = 4096;
moonLight.shadow.mapSize.height = 4096;
moonLight.shadow.camera.left = -50;
moonLight.shadow.camera.right = 50;
moonLight.shadow.camera.top = 50;
moonLight.shadow.camera.bottom = -50;
moonLight.shadow.camera.near = 0.1;
moonLight.shadow.camera.far = 500;
scene.add(moonLight);

// 月亮目标点
const moonTarget = new THREE.Object3D();
moonTarget.position.set(0, 0, 0);
scene.add(moonTarget);
moonLight.target = moonTarget;

// 地面接收阴影
const groundGeometry = new THREE.PlaneGeometry(1, 1);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true; // 地面接收阴影
scene.add(ground);

// 环境光
const ambientLight = new THREE.AmbientLight(0x404040, 1);
scene.add(ambientLight);

// Day and night system
function updateBackgroundColor(normalizedAngle, isDay) {
    let color;

    if (isDay) {
        // Daytime logic
        if (normalizedAngle < 0.125) {
            // Early Day (Soft Blue)
            const intensity = Math.abs((normalizedAngle) / 0.125); // Normalize from 0 to 1
            color = new THREE.Color(
                0.1 * intensity, // R: Increase red component for light blue
                0.2 * intensity, // G: Increase green component for light blue
                0.3 * intensity  // B: Increase blue component for light blue
            );

        } else if (normalizedAngle >= 0.125 && normalizedAngle < .25) {
            // Midday (Light Blue to Bright Blue)
            const middayIntensity = 1 - (0.25 - normalizedAngle) / 0.125; // Normalize to fade from 0 to 1
            color = new THREE.Color(
                0.1 + 0.4 * (middayIntensity), // R: Light blue to bright blue
                0.2 + 0.6 * (middayIntensity), // G: Light green to bright green
                0.3 + 0.65 * (middayIntensity)  // B: Light blue to bright blue
            );

        } else if (normalizedAngle >= .25 && normalizedAngle < .375) {
            // Mid to late day (Bright Blue to light pink)
            const middayIntensity = Math.abs((0.375 - normalizedAngle) / 0.125); // Normalize to fade from 0 to 1
            color = new THREE.Color(
                0.5 + 0 * (middayIntensity), // R: Light blue to bright blue
                0.2 + 0.6 * (middayIntensity), // G: Light green to bright green
                0.35 + 0.6 * (middayIntensity)  // B: Light blue to bright blue
            );
        } else if (normalizedAngle >= .375 && normalizedAngle < .5) {
            // late day (light pink to orange)
            const middayIntensity = Math.abs((0.5 - normalizedAngle) / 0.125); // Normalize to fade from 0 to 1
            color = new THREE.Color(
                0.7 - .2 * (middayIntensity), // R: Light blue to bright blue
                0.25 - .05 * (middayIntensity), // G: Light green to bright green
                0.1 + 0.15 * (middayIntensity)  // B: Light blue to bright blue
            );
        }
        else {

        }
    } else {
        if (normalizedAngle >= .5 && normalizedAngle < .625) {
            // Late Day (orange to black)
            const lateDayIntensity = Math.abs((.625 - normalizedAngle) / 0.125); // Normalize to fade from 0 to 1
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

export { sunLight, moonLight, ambientLight, sunTarget, moonTarget, updateBackgroundColor };