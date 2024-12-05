import * as THREE from 'three';
const earthRadius = 48;

// 创建一个对象来表示狗
const dog = new THREE.Group();

// 创建身体
const bodyGeometry = new THREE.BoxGeometry(2, 1, 1); // 宽度、高度、深度
const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 }); // 棕色
const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
body.position.y = -0.5; // 调整身体的位置
dog.add(body);

// 创建头部
const headGeometry = new THREE.BoxGeometry(1, 1, 1);
const headMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
const head = new THREE.Mesh(headGeometry, headMaterial);
head.position.set(1.4, 0.3, 0); // 头部在身体前方
dog.add(head);

// 创建鼻子
const noseGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
const noseMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 }); // 深灰色
const nose = new THREE.Mesh(noseGeometry, noseMaterial);
nose.position.set(1.9, 0.2, 0); // 鼻子在头部前方
dog.add(nose);

// 创建耳朵
const earGeometry = new THREE.BoxGeometry(0.2, 0.6, 0.2);
const earMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
const leftEar = new THREE.Mesh(earGeometry, earMaterial);
const rightEar = new THREE.Mesh(earGeometry, earMaterial);
leftEar.position.set(1.2, 0.8, -0.4);
rightEar.position.set(1.2, 0.8, 0.4);
dog.add(leftEar);
dog.add(rightEar);

// 创建尾巴
const tailGeometry = new THREE.BoxGeometry(0.3, 0.8, 0.3);
const tailMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
const tail = new THREE.Mesh(tailGeometry, tailMaterial);
tail.position.set(-1.1, -0.2, 0);
tail.rotation.z = Math.PI / 4; // 尾巴稍微向上翘
dog.add(tail);

// 创建四条腿
const legGeometry = new THREE.BoxGeometry(0.3, 0.8, 0.3);
const legMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });

const legPositions = [
    [-0.7, -1.2, -0.35],
    [-0.7, -1.2, 0.35],
    [0.7, -1.2, -0.35],
    [0.7, -1.2, 0.35]
];

for (let i = 0; i < 4; i++) {
    const leg = new THREE.Mesh(legGeometry, legMaterial);
    leg.position.set(legPositions[i][0], legPositions[i][1], legPositions[i][2]);
    dog.add(leg);
}

// 创建项圈
const collarGeometry = new THREE.TorusGeometry(0.6, 0.1, 16, 100);
const collarMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // 红色
const collar = new THREE.Mesh(collarGeometry, collarMaterial);
collar.position.set(1.4, 0, 0); // Place near the neck
collar.rotation.x = Math.PI / 2;
dog.add(collar);

// 设置狗的整体位置
dog.position.set(2, earthRadius , 2); // 放置在地面上

// 将狗添加到场景中
// scene.add(dog);

// 缩小狗的大小
dog.scale.set(0.2, 0.2, 0.2);

// 确保狗的所有子对象启用投射阴影
dog.traverse((node) => {
    if (node.isMesh) {
        node.castShadow = true; // 允许投射阴影
        node.receiveShadow = true; // 允许接收阴影
    }
});

export { dog };
