const React = require('react');

const ImageLayer = React.createClass({
  extId: 'image',
  propTypes: {
    currentImg: React.PropTypes.string,
    viewerDimensions: React.PropTypes.object,
    zIndex: React.PropTypes.number,
  },

  componentDidMount() {
    if (this.props.currentImg) {
      this.load(this.props.currentImg)
        .then(this.drawImg.bind(null, this.refs.canvas));
    }
  },
  
  componentDidUpdate() {
    if (this.props.currentImg) {
      this.load(this.props.currentImg)
        .then(this.drawImg.bind(null, this.refs.canvas));
    }
  },
  
  render() {
    return (
      <canvas
         ref="canvas"
         style={{zIndex: this.props.zIndex}}
         width={this.props.viewerDimensions.width}
         height={this.props.viewerDimensions.height}
         className="Layer">
      </canvas>
    );
  },

  drawImg(canvas, img) {
    const ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let position = this.center(img, canvas);
    ctx.drawImage(img,
                  position.dx,
                  position.dy,
                  position.width,
                  position.height);
  },

  load(imgPath) {
    return new Promise((resolve, reject) => {
      const img = document.createElement('img');
      img.onerror = () => {
        resolve(this.getErrorImg());
      };

      img.onload = () => {
        resolve(img);
      };
      
      img.src = imgPath.replace(/#/g, '%23');
    });
  },

  getErrorImg() {
    const canvas = document.createElement('canvas');
    canvas.height = 90;
    canvas.width = 300;
    let ctx = canvas.getContext('2d');
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgb(51, 51, 51)';
    ctx.fillText('INVALID PATH', 150, 45);
    return canvas;
  },

  center(img, canvas) {
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
    
    dx = (canvas.width/2 - width/2);
    dy = (canvas.height/2 - height/2);
    
    return {
      dx: dx,
      dy: dy,
      width: width,
      height: height
    };
  }
});

module.exports = ImageLayer;
