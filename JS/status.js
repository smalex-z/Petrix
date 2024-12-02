import { hungerSprite, hygieneSprite, happinessSprite } from './icons.js';
import { lastBlinkTime, currentIconIndex } from '../main.js';
import { camera } from './sceneSetup.js';

let iconsToShow = []; // 当前需要显示的图标列表

// 定义宠物的状态
let petStatus = {
    life: 100,         // 生命值，0-100
    hunger: 0,       // 饥饿度，0-100
    hygiene: 100,      // 卫生度，0-100
    happiness: 100,     // 快乐度，0-100
    petAlive: true,     // 定义宠物的生命状态
};

// 定义状态的最大值和最小值
const MAX_STATUS = 100;
const MIN_STATUS = 0;


// 更新状态显示的函数
function updatePetStatusDisplay() {
    document.getElementById('life-status').textContent = petStatus.life.toFixed(0);
    document.getElementById('hunger-status').textContent = petStatus.hunger.toFixed(0);
    document.getElementById('hygiene-status').textContent = petStatus.hygiene.toFixed(0);
    document.getElementById('happiness-status').textContent = petStatus.happiness.toFixed(0);
}


function updatePetStatus() {
    if (!petStatus.petAlive) return;

    // 增加饥饿度
    petStatus.hunger = Math.min(petStatus.hunger + 0.1, MAX_STATUS);

    // 减少卫生度和快乐度
    petStatus.hygiene = Math.max(petStatus.hygiene - 0.05, MIN_STATUS);
    petStatus.happiness = Math.max(petStatus.happiness - 0.05, MIN_STATUS);

    // 检查需要显示的图标
    const newIconsToShow = [];

    if (petStatus.hunger > 10) {
        newIconsToShow.push(hungerSprite);
    }
    if (petStatus.hygiene < 90) {
        newIconsToShow.push(hygieneSprite);
    }
    if (petStatus.happiness < 90) {
        newIconsToShow.push(happinessSprite);
    }

    // 如果图标列表发生变化，更新图标显示
    if (!arraysEqual(iconsToShow, newIconsToShow)) {
        updateIconsDisplay(newIconsToShow);
    }

    updatePetStatusDisplay();
}


function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

function updateIconsDisplay(icons) {
    iconsToShow = icons;

    // 重置当前图标索引
    currentIconIndex = 0;

    // 隐藏所有图标
    hungerSprite.visible = false;
    hygieneSprite.visible = false;
    happinessSprite.visible = false;

    // 如果有图标需要显示，显示第一个
    if (iconsToShow.length > 0) {
        iconsToShow[currentIconIndex].visible = true;
    }

    // Reset the flashmeter
    lastBlinkTime = Date.now();
    iconVisible = true; 
}

export { petStatus, updatePetStatusDisplay, updatePetStatus, iconsToShow, MIN_STATUS, MAX_STATUS };
