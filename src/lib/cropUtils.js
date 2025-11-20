/**
 * Generates a cropped image blob URL from an original image and crop coordinates.
 * @param {string} imageSrc - The source URL of the image
 * @param {Object} crop - The crop object { x, y, width, height } in pixels
 * @param {string} fileName - Optional filename
 * @returns {Promise<string>} - A promise that resolves to the blob URL
 */
export async function getCroppedImg(imageSrc, crop, fileName = "cropped.png") {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  // Set canvas size to the cropped size
  canvas.width = crop.width;
  canvas.height = crop.height;

  // Draw the cropped image onto the canvas
  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Canvas is empty"));
        return;
      }
      blob.name = fileName;
      resolve(URL.createObjectURL(blob));
    }, "image/png");
  });
}

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });
