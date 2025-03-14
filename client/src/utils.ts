export const rotateImage = (base64Image: string) => {
  return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = base64Image;
      img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          if (!ctx) return reject('Could not create canvas context');
          
          // Set new canvas dimensions
          canvas.width = img.height;
          canvas.height = img.width;
          
          // Rotate the canvas by 90 degrees
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate(Math.PI / 2);
          ctx.drawImage(img, -img.width / 2, -img.height / 2);
          
          // Convert back to base64
          resolve(canvas.toDataURL());
      };
      img.onerror = (err) => reject(err);
  });
}

export const deepCopy = <T>(item: T): T => {
  return JSON.parse(JSON.stringify(item))
}

export const insertAt = <T>(arr: T[], item: T, index: number): T[] => {
  if (index < 0) {
      throw new Error("Index out of bounds");
  }

  return [...arr.slice(0, index), item, ...arr.slice(index)];
}