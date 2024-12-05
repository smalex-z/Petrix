import * as THREE from 'three';
const earthRadius = 48;

// 创建一个对象来表示鸡
const chicken = new THREE.Group();
chicken.isMoving = false; // Add a custom property to track movement
chicken.targetPosition = new THREE.Vector3(); // 目标位置

// 创建身体
const bodyGeometry = new THREE.BoxGeometry(1, 1.5, 1); // 宽度、高度、深度
const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff }); // 白色
const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
body.position.y = -0.25; // 调整身体的位置
chicken.add(body);

// 创建头部
const headGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
const head = new THREE.Mesh(headGeometry, headMaterial);
head.position.set(0.6, 0.6, 0); // 头部在身体前方
chicken.add(head);

// 创建喙 (beak)
const beakGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.4);
const beakMaterial = new THREE.MeshStandardMaterial({ color: 0xffa500 }); // 橙色
const beak = new THREE.Mesh(beakGeometry, beakMaterial);
beak.position.set(1, 0.6, 0); // 喙在头部前方
chicken.add(beak);

// 创建冠 (comb)
const combGeometry = new THREE.BoxGeometry(0.2, 0.4, 0.2);
const combMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // 红色
const comb = new THREE.Mesh(combGeometry, combMaterial);
comb.position.set(0.6, 1, 0); // 冠在头部顶部
chicken.add(comb);

// 创建尾巴
const tailGeometry = new THREE.BoxGeometry(0.4, 0.6, 0.4);
const tailMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
const tail = new THREE.Mesh(tailGeometry, tailMaterial);
tail.position.set(-0.8, 0, 0);
chicken.add(tail);

// 创建两条腿
const legGeometry = new THREE.BoxGeometry(0.2, 0.6, 0.2);
const legMaterial = new THREE.MeshStandardMaterial({ color: 0xffa500 }); // 橙色

const legPositions = [
    [-0.2, -1, -0.3],
    [-0.2, -1, 0.3]
];

for (let i = 0; i < 2; i++) {
    const leg = new THREE.Mesh(legGeometry, legMaterial);
    leg.position.set(legPositions[i][0], legPositions[i][1], legPositions[i][2]);
    chicken.add(leg);
}

// 创建两只翅膀
const wingGeometry = new THREE.BoxGeometry(0.4, 0.8, 0.1);
const wingMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
leftWing.position.set(0, 0, -0.6);
rightWing.position.set(0, 0, 0.6);
chicken.add(leftWing);
chicken.add(rightWing);

// 设置鸡的整体位置
chicken.position.set(2, earthRadius, 2); // 放置在地面上

// 将鸡添加到场景中
// scene.add(chicken);

// 缩小鸡的大小
chicken.scale.set(0.2, 0.2, 0.2);

// 确保鸡的所有子对象启用投射阴影
chicken.traverse((node) => {
    if (node.isMesh) {
        node.castShadow = true; // 允许投射阴影
        node.receiveShadow = true; // 允许接收阴影
    }
});

export { chicken };
