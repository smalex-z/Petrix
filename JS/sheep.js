import * as THREE from 'three';
const earthRadius = 48;

// 创建一个对象来表示羊
const sheep = new THREE.Group();

// 创建身体
const bodyGeometry = new THREE.BoxGeometry(2, 1, 1); // 宽度、高度、深度
const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
body.position.y = -0.5; // 调整身体的位置
sheep.add(body);

// 创建头部
const headGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
const head = new THREE.Mesh(headGeometry, headMaterial);
head.position.set(1.4, 0.1, 0); // 头部在身体前方
sheep.add(head);

// 创建脸部（稍微深色）
const faceGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
const faceMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
const face = new THREE.Mesh(faceGeometry, faceMaterial);
face.position.set(1.6, 0.1, 0); // 脸部在头部前方
sheep.add(face);

// 创建四条腿
const legGeometry = new THREE.BoxGeometry(0.3, 0.6, 0.3);
const legMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });

const legPositions = [
    [-0.7, -1.3, -0.35],
    [-0.7, -1.3, 0.35],
    [0.7, -1.3, -0.35],
    [0.7, -1.3, 0.35]
];

for (let i = 0; i < 4; i++) {
    const leg = new THREE.Mesh(legGeometry, legMaterial);
    leg.position.set(legPositions[i][0], legPositions[i][1], legPositions[i][2]);
    sheep.add(leg);
}

// 创建尾巴
const tailGeometry = new THREE.BoxGeometry(0.2, 0.4, 0.2);
const tailMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
const tail = new THREE.Mesh(tailGeometry, tailMaterial);
tail.position.set(-1.1, -0.8, 0);
sheep.add(tail);

// 设置羊的整体位置
sheep.position.set(2, earthRadius + 0.3, 2); // 放置在地面上

// 将羊添加到场景中
// 创建宠物网格
sheep.scale.set(0.2, 0.2, 0.2); // 缩小羊的大小

// 确保羊的所有子对象启用投射阴影
sheep.traverse((node) => {
    if (node.isMesh) {
        node.castShadow = true; // 允许投射阴影
        node.receiveShadow = true; // 允许接收阴影
    }
});

export { sheep };
