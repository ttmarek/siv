const React = require('react');
const Layers = require('./layers');

const imgLayerName = 'image';

const errImg = (() => {
  let canvas = document.createElement('canvas');
  canvas.height = 90;
  canvas.width = 300;
  let ctx = canvas.getContext('2d');
  ctx.font = '30px Arial';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgb(51, 51, 51)';
  ctx.fillText('INVALID PATH', 150, 45);
  return canvas;
})();


function addLayerIfNeeded() {

  let imgLayer = Layers.get.bind(this)(imgLayerName);

  if (!imgLayer) {
    imgLayer = new Layers.Layer(imgLayerName);
  }
  
  imgLayer.onRender = (imgCanvas, viewerState) => {
    if (viewerState.size.width != imgCanvas.width) {
      imgCanvas.width = viewerState.size.width;
    }

    if (viewerState.size.height != imgCanvas.height) {
      imgCanvas.height = viewerState.size.height;
    }
    
    draw(viewerState.currentImg, imgCanvas);
  };
  
  Layers.update.bind(this)(imgLayerName, imgLayer);
}

/**
 * Loads an image.
 * @param {string} imgPath
 * @param {Object} callback - function that runs as soon as the image
 * loads, the loaded image object is passed in as the object's first
 * parameter.
 */
function load(imgPath, callback) {

  let img = document.createElement('img');
  
  img.onerror = () => {
    if (callback) callback(errImg);
  };

  img.onload = () => {
    if (callback) callback(img);
  };

  // percent encode any hash/pound characters
  imgPath = imgPath.replace(/#/g, '%23');

  img.src = imgPath;
}


function center(img, canvas) {
  
  let width = img.width;
  let height = img.height;
  let aspect = width/height;
  let dx = 0;
  let dy = 0;
  
  if (width > canvas.width || height > canvas.height) {
    // resize so the image fits within the canvas whilst
    // maintaining its aspect ratio.
    if (width - canvas.width > height - canvas.height) {
      width = canvas.width;
      height = width/aspect;
    } else {
      height = canvas.height;
      width = height * aspect;
    }
  }

  // // 2px margin on either side:
  // width = width - 4; height = height - 4;

  dx = (canvas.width/2 - width/2);
  dy = (canvas.height/2 - height/2);
  
  return {
    dx: dx,
    dy: dy,
    width: width,
    height: height
  };
}

function draw(imgPath, canvasElement) {
  
  load(imgPath, (img) => {
    
    let ctx = canvasElement.getContext('2d');

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    
    let position = center(img, canvasElement);

    ctx.drawImage(img,
                  position.dx,
                  position.dy,
                  position.width,
                  position.height);
  });
}

module.exports = {
  addLayerIfNeeded,
};
