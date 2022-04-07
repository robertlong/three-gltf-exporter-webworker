import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  ACESFilmicToneMapping,
  EquirectangularReflectionMapping,
  sRGBEncoding,
} from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";

let scene;
let camera;
let renderer;

export async function start(canvas, pixelRatio, width, height) {
  const rgbeLoader = new RGBELoader();
  const envMap = await rgbeLoader.loadAsync(new URL("/venice_sunset_1k.hdr", import.meta.url).href);
  envMap.mapping = EquirectangularReflectionMapping;

  scene = new Scene();
  scene.environment = envMap;
  scene.background = envMap;

  camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.x = -1;
  camera.position.z = 2;
  camera.lookAt(0, 0, 0);
  scene.add(camera);

  renderer = new WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(width, height, false);
  renderer.physicallyCorrectLights = true;
  renderer.toneMappingExposure = 1;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.outputEncoding = sRGBEncoding;
  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });

  const gltfLoader = new GLTFLoader();
  const gltf = await gltfLoader.loadAsync(new URL("/DamagedHelmet.glb", import.meta.url).href);
  scene.add(gltf.scene);
}

export function resize(width, height) {
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
}

export async function exportGLTF() {
  const gltfExporter = new GLTFExporter();

  const buffer = await gltfExporter.parseAsync(scene, {
    binary: true,
    onlyVisible: false,
    embedImages: true,
  });

  console.log(buffer);

  return buffer;
}
