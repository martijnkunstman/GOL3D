/**
 * entry.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */

/*

game of life 2d rules

1. Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.
2. Any live cell with two or three live neighbours lives on to the next generation.
3. Any live cell with more than three live neighbours dies, as if by overpopulation.
4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

game of life 3d rules

How many neighbors does a cell have in 3D?
A cell has 26 neighbors in 3D. The 26 neighbors are the 6 cells that share a face with the cell, the 12 cells that share an edge with the cell, and the 8 cells that share a vertex with the cell.

//rules 2d 



alive
00000000 0
00000001 1
00000010 2
00000011 3
00000100 4
00000101 5
00000110 6
00000111 7
00001000 8
00001001 9
00001010 10
00001011 11
00001100 12
00001101 13
00001110 14
00001111 15
00010000 16
00010001 17
00010010 18
00010011 19











*/

import {
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  Vector3,
  MeshBasicMaterial,
  Mesh,
  Fog,
  Color,
  AmbientLight,
  DirectionalLight,
  PCFSoftShadowMap,
  MeshPhongMaterial,
  BoxGeometry,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

//import SeedScene from "./objects/Scene.js";

//resolution
let resolution = 15;
let cubeSize = 0.5;

let data = [];

const scene = new Scene();
scene.background = new Color(0x444444);
//scene.fog = new Fog(0x000000, 0, resolution * 4);
const light = new AmbientLight(0xff8888, 0.3); // soft white light
scene.add(light);
const directionalLight = new DirectionalLight(0x99ff99, 0.9);
directionalLight.position.set(resolution / 2, resolution / 3, resolution / 4);
directionalLight.target.position.set(0, 0, 0);
/*
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 512;
directionalLight.shadow.mapSize.height = 512;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 500;
directionalLight.shadow.radius = 10;
directionalLight.shadow.blurSamples = 25;
*/

scene.add(directionalLight);

const camera = new PerspectiveCamera();

const renderer = new WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap; // default THREE.PCFShadowMap
//const seedScene = new SeedScene();
const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;

// bounding cube
const geometry = new BoxGeometry(1, 1, 1);
const material = new MeshBasicMaterial({
  color: 0xffffff,
  wireframe: true,
  fog: true,
  depthWrite: true,
});
const cube = new Mesh(geometry, material);
cube.scale.set(resolution, resolution, resolution);

//scene.add(cube);
let data3d = [];

for (let x = 0; x < resolution; x++) {
  data.push([]);
  data3d.push([]);
  for (let y = 0; y < resolution; y++) {
    data[x].push([]);
    data3d[x].push([]);
    for (let z = 0; z < resolution; z++) {
      data[x][y].push(0);
      data3d[x][y].push(Math.round(Math.random()));
      let geometry = new BoxGeometry(cubeSize, cubeSize, cubeSize);
      let material = new MeshPhongMaterial({
        color: 0xaaaaff,
        //wireframe: false,
        //fog: true,
        //depthWrite: true,
      });
      let cube = new Mesh(geometry, material);
      cube.castShadow = false;
      cube.receiveShadow = false;
      cube.position.set(
        x - resolution / 2 + 0.5,
        y - resolution / 2 + 0.5,
        z - resolution / 2 + 0.5
      );

      cube.scale.set(data3d[x][y][z], data3d[x][y][z], data3d[x][y][z]);

      scene.add(cube);
      data[x][y][z] = cube;
    }
  }
}

function golUpdate() {
  let temp = [];
  for (let x = 0; x < resolution; x++) {
    temp[x] = [];
    for (let y = 0; y < resolution; y++) {
      temp[x][y] = [];
      for (let z = 0; z < resolution; z++) {
        temp[x][y][z] = data3d[x][y][z];
        let neighbors = checkNeighbors(x, y, z);
        if (data3d[x][y][z] == 1) {
          if (neighbors < 2 || neighbors > 3) {
            temp[x][y][z] = 0;
          }
        } else {
          if (neighbors == 3) {
            temp[x][y][z] = 1;
          }
        }
      }
    }
  }
  data3d = temp;
}

function checkNeighbors(x, y, z) {
  let neighbors = 0;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      for (let k = -1; k < 2; k++) {
        if (i == 0 && j == 0 && k == 0) {
          continue;
        }
        if (
          x + i >= 0 &&
          x + i < resolution &&
          y + j >= 0 &&
          y + j < resolution &&
          z + k >= 0 &&
          z + k < resolution
        ) {
          if (data3d[x + i][y + j][z + k] == 1) {
            neighbors++;
          }
        }
      }
    }
  }
  return neighbors;
}

// scene
//scene.add(seedScene);

// camera
camera.position.set(resolution, resolution, -resolution * 2);
camera.lookAt(new Vector3(0, 0, 0));

// renderer
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x7ec0ee, 1);

// render loop
const onAnimationFrameHandler = (timeStamp) => {
  renderer.render(scene, camera);
  //seedScene.update && seedScene.update(timeStamp);
  golUpdate();
  dataUpdate();
  controls.update();
  window.requestAnimationFrame(onAnimationFrameHandler);
};
window.requestAnimationFrame(onAnimationFrameHandler);

const dataUpdate = () => {
  for (let x = 0; x < resolution; x++) {
    for (let y = 0; y < resolution; y++) {
      for (let z = 0; z < resolution; z++) {
        //let cube = data[x][y][z];
        //cube.rotation.x += 0.001;
        //cube.rotation.y += 0.001;
        //cube.rotation.z += 0.001;
        //data[x][y][z].scale.set(Math.random(), Math.random(), Math.random());
        data[x][y][z].scale.set(
          data3d[x][y][z],
          data3d[x][y][z],
          data3d[x][y][z]
        );
      }
    }
  }
};

// resize
const windowResizeHanlder = () => {
  const { innerHeight, innerWidth } = window;
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
};
windowResizeHanlder();
window.addEventListener("resize", windowResizeHanlder);

// dom
document.body.style.margin = 0;
document.body.appendChild(renderer.domElement);
