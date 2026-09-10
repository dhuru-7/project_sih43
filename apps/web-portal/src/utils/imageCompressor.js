/**
 * Compress an image file using HTML5 Canvas.
 * Resizes max dimensions to maxWidth/maxHeight (default 256x256)
 * and applies JPEG compression (quality 0.8) to keep payload ~10-25 KB.
 *
 * @param {File|Blob} file
 * @param {Object} options
 * @param {number} [options.maxWidth=256]
 * @param {number} [options.maxHeight=256]
 * @param {number} [options.quality=0.8]
 * @returns {Promise<string>} Base64 Data URL of compressed image
 */
export const compressImage = (file, options = {}) => {
  const { maxWidth = 256, maxHeight = 256, quality = 0.8 } = options;

  return new Promise((resolve, reject) => {
    if (!file || !(file instanceof Blob)) {
      return reject(new Error('Invalid image file provided'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image element'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Failed to acquire canvas 2D context'));
        }

        // High quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};
