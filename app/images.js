function makeErrorImg() {
  const canvas = document.createElement('canvas');
  canvas.height = 90;
  canvas.width = 300;
  const ctx = canvas.getContext('2d');
  ctx.font = '30px Arial';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgb(51, 51, 51)';
  ctx.fillText = ('ERROR LOADING IMAGE', 150, 45);
  return canvas;
}

function load(imgSrc) {
  return new Promise(resolve => {
    const img = document.createElement('img');
    img.onload = () => {
      resolve(img);
    };
    img.onerror = () => {
      resolve(makeErrorImg());
    };
    img.src = imgSrc.replace(/#/g, '%23');
  });
}

function loadMany(imgPaths) {
  return new Promise(resolve => {
    const images = {};
    const imgsToLoad = imgPaths.length;
    let imgsLoaded = 0;
    imgPaths.forEach(path => {
      load(path).then(img => {
        imgsLoaded++;
        images[path] = img;
        if (imgsLoaded === imgsToLoad) {
          resolve(images);
        }
      });
    });
  });
}

module.exports = {
  load,
  loadMany,
};
