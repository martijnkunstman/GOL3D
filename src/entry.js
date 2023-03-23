/**
 * entry.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
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
let resolution = 5;
let cubeSize = 0.8;

const scene = new Scene();
scene.background = new Color(0x444444);
scene.fog = new Fog(0x000000, 0, resolution * 4);
const light = new AmbientLight( 0xffffff, 0.3 ); // soft white light
scene.add( light );
const directionalLight = new DirectionalLight( 0xffffff, 0.9 );
directionalLight.position.set( resolution/2, resolution/3, resolution/4);
directionalLight.target.position.set( 0, 0, 0 );
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 512;
directionalLight.shadow.mapSize.height = 512;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 500;
directionalLight.shadow.radius = 10;
directionalLight.shadow.blurSamples = 25;


scene.add( directionalLight );

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

for (let x = 0; x < resolution; x++) {
  for (let y = 0; y < resolution; y++) {
    for (let z = 0; z < resolution; z++) {
      let geometry = new BoxGeometry(cubeSize, cubeSize, cubeSize);
      let material = new MeshPhongMaterial({
        color: 0xffffff,
        //wireframe: false,
        fog: true,
        //depthWrite: true,
      });
      let cube = new Mesh(geometry, material);
      cube.castShadow = true;
      cube.receiveShadow = true;
      cube.position.set(
        x - resolution / 2 + 0.5,
        y - resolution / 2 + 0.5,
        z - resolution / 2 + 0.5
      );
      scene.add(cube);
    }
  }
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
  controls.update();
  window.requestAnimationFrame(onAnimationFrameHandler);
};
window.requestAnimationFrame(onAnimationFrameHandler);

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
