import { start, resize, exportGLTF } from "./renderer";

self.addEventListener("message", ({ data }) => {
  switch (data.type) {
    case "start":
      start(data.canvas, data.pixelRatio, data.width, data.height);
      break;
    case "resize":
      resize(data.width, data.height);
      break;
    case "export":
      exportGLTF().then((buffer) => {
        self.postMessage(
          {
            type: "result",
            buffer
          },
          [buffer]
        );
      });
      break;
    default:
      break;
  }
});
