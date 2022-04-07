function createInfoEl(message) {
  const el = document.createElement("div");
  el.classList.add("info");

  const span = document.createElement("span");
  span.innerText = message;
  el.appendChild(span);

  const button = document.createElement("button");
  button.innerText = "Export glTF";
  el.appendChild(button);

  document.body.appendChild(el);

  return button;
}

function downloadFile(buffer, fileName) {
  const blob = new Blob([buffer], { type: "application/octet-stream" });
  const el = document.createElement("a");
  el.style.display = "none";
  document.body.appendChild(el);
  el.href = URL.createObjectURL(blob);
  el.download = fileName;
  el.click();
  document.body.removeChild(el);
}

const canvas = document.getElementById("canvas");

if (typeof OffscreenCanvas !== "undefined") {
  const button = createInfoEl("Using WebWorker + OffscreenCanvas");

  const offscreenCanvas = canvas.transferControlToOffscreen();

  const worker = new Worker(new URL("./worker.js", import.meta.url), {
    type: "module",
  });

  worker.postMessage(
    {
      type: "start",
      canvas: offscreenCanvas,
      width: window.innerWidth,
      height: window.innerHeight,
    },
    [offscreenCanvas]
  );

  window.addEventListener("resize", () => {
    worker.postMessage({
      type: "resize",
      pixelRatio: devicePixelRatio,
      width: window.innerWidth,
      height: window.innerHeight,
    });
  });

  button.addEventListener("click", () => {
    worker.postMessage({
      type: "export",
    });
  });

  worker.addEventListener("message", ({ data }) => {
    if (data.type === "result") {
      downloadFile(data.buffer, "scene.glb");
    }
  });
} else {
  const button = createInfoEl("OffscreenCanvas Unsupported");

  import("./renderer.js").then((renderer) => {
    renderer.start(
      canvas,
      devicePixelRatio,
      window.innerWidth,
      window.innerHeight
    );

    window.addEventListener("resize", () => {
      renderer.resize(window.innerWidth, window.innerHeight);
    });

    button.addEventListener("click", () => {
      renderer.exportGLTF().then((buffer) => {
        downloadFile(buffer, "scene.glb");
      });
    })
  }).catch(error => {
    console.error(error);
  });;
}
