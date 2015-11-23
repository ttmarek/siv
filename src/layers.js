const React = require('react');

const LayerComponent = React.createClass({
  componentDidMount() {
    this.props.onRender(this.refs.node,
                        this.props.viewerState);

  },

  componentDidUpdate() {
    this.props.onRender(this.refs.node,
                        this.props.viewerState);
  },
  
  render() {
    const styles = {
      zIndex: this.props.zIndex,
      display: this.props.hidden ? 'none' : 'block',
    };
    
    return (
      <canvas
         ref="node"
         className="Layer"
         style={styles}>
      </canvas>
    );
  }
});

class Layer {
  constructor(layerName) {
    this.name = layerName;
    this.hidden = false;
    this.onRender = null;
  }
}

/**
 * Stores an update to a given layer's object.
 * If the layer doesn't exist then it moves to the front of the layer
 * list. Otherwise, the layer updates in its original place.
 * @param {string} layerName
 * @param {Object} imgLayer
 */
function update(layerName, imgLayer) {
  let layers = this.state.layers; 
  
  let index = layers.findIndex(layer => {
    return layer.name === layerName;
  });

  if (index === -1) {
    layers.unshift(imgLayer);    
  } else {
    layers[index] = imgLayer;
  }

  this.setState({layers: layers});
}


/**
 * Retrieves a layer object with a given name.
 * @boundto ImgInspector = this
 * @param {string} layerName
 * @returns {Object|undefined} The layer object if it exists, or
 * undefined if it doesn't exist. 
 */
function get(layerName) {
  return this.state.layers.find(layer => {
    return layer.name === layerName;
  });
}


module.exports = {
  get,
  update,
  Layer,
  Component: LayerComponent,
};
