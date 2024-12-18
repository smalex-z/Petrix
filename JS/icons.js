import * as THREE from 'three';
import { chosenPet } from './globalVar.js';

// 创建纹理加载器
const textureLoader = new THREE.TextureLoader();

// 加载图标纹理
const hungerTexture = textureLoader.load('../assets/images/hunger.png');
const hygieneTexture = textureLoader.load('../assets/images/hygiene.png');
const happinessTexture = textureLoader.load('../assets/images/happiness.png');

// 创建 SpriteMaterial
const hungerMaterial = new THREE.SpriteMaterial({ map: hungerTexture });
const hygieneMaterial = new THREE.SpriteMaterial({ map: hygieneTexture });
const happinessMaterial = new THREE.SpriteMaterial({ map: happinessTexture });

// 创建 Sprite
const hungerSprite = new THREE.Sprite(hungerMaterial);
const hygieneSprite = new THREE.Sprite(hygieneMaterial);
const happinessSprite = new THREE.Sprite(happinessMaterial);

// 设置初始不可见
hungerSprite.visible = false;
hygieneSprite.visible = false;
happinessSprite.visible = false;

// 调整图标大小
const iconScale = 1.5;
hungerSprite.scale.set(iconScale, iconScale, iconScale);
hygieneSprite.scale.set(iconScale, iconScale, iconScale);
happinessSprite.scale.set(iconScale, iconScale, iconScale);

// 将图标添加到羊的头上
export function addSprite(){
    console.log("sprites added");
    chosenPet.add(hungerSprite);
    chosenPet.add(hygieneSprite);
    chosenPet.add(happinessSprite);
}

// 设置图标的位置（羊头的上方）
const iconOffsetY = 2; // 根据羊的尺寸调整
hungerSprite.position.set(0, iconOffsetY, 0);
hygieneSprite.position.set(0, iconOffsetY, 0);
happinessSprite.position.set(0, iconOffsetY, 0);

// 定义变量
hungerSprite.renderOrder = 1;
hygieneSprite.renderOrder = 1;
happinessSprite.renderOrder = 1;

export { hungerSprite, hygieneSprite, happinessSprite };
