# three-gltf-exporter-webworker

Demo showcasing exporting a glTF from a WebWorker ([Three.js PR](https://github.com/mrdoob/three.js/pull/23857))

This demo works should work in all modern browsers, it will only use the WebWorker if your browser supports OffscreenCanvas. At the time of publishing, only Chromium-based browsers support OffscreenCanvas.

[Live Demo](https://robertlong.github.io/three-gltf-exporter-webworker/)

## Running

```
cd three-gltf-exporter-webworker
npm install
npm run dev
```