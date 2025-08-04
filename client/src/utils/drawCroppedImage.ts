/**
 * Draws the source image onto a canvas and overlays a rotatable crop box.
 * @param {string} imageUrl - The URL of the source image.
 * @param {object} crop - The crop parameters (x, y, size, rotation).
 * @param {React.RefObject<HTMLCanvasElement>} canvasRef - A ref to the canvas element.
 * @param {function} callback - A function to call after drawing, passing the canvas and scale.
 * @param {number} maxWidth - The maximum width for the canvas, used to scale the image down.
 */
export function drawCroppedImage(
  imageUrl: string, 
  crop: { x: number; y: number; size: number; rotation: number }, 
  canvasRef: React.RefObject<HTMLCanvasElement>, 
  callback?: (canvas: HTMLCanvasElement, scale: number) => void, 
  maxWidth?: number
) {
  const canvas = canvasRef.current;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  
  const image = new Image();
  image.src = imageUrl;

  // Ensure the image is loaded before drawing
  image.onload = () => {
    // Use the passed maxWidth, with a fallback to 600 if not provided.
    const MAX_WIDTH = maxWidth || 600;
    
    // Calculate the scale factor to fit the image within MAX_WIDTH, without scaling up.
    const scale = Math.min(MAX_WIDTH / image.width, 1);

    const scaledWidth = image.width * scale;
    const scaledHeight = image.height * scale;

    // Set the canvas dimensions to match the scaled image
    canvas.width = scaledWidth;
    canvas.height = scaledHeight;

    // Clear the canvas and draw the scaled image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, scaledWidth, scaledHeight);

    // Save the current context state
    ctx.save();

    // Set styles for the crop box overlay
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;

    // Translate and rotate the context to draw the rotated crop box
    ctx.translate((crop.x + crop.size / 2) * scale, (crop.y + crop.size / 2) * scale);
    ctx.rotate((crop.rotation || 0) * Math.PI / 180);

    // Draw the rectangular crop box
    ctx.strokeRect(
      (-crop.size / 2) * scale,
      (-crop.size / 2) * scale,
      crop.size * scale,
      crop.size * scale
    );

    // Restore the context to its original state
    ctx.restore();

    // Execute the callback function, passing the canvas and the calculated scale
    if (callback) {
      callback(canvas, scale);
    }
  };

  image.onerror = () => {
    console.error("Image failed to load.");
  };
}