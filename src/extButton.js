const React = require('react');
const Redux = require('redux');

const extButton = React.createClass({
  propTypes: {
      extName: React.PropTypes.string.isRequired,
  },

  statics: {
    handleClose(extId) {
      const siv = this;
      const extStoresCopy = siv.state.extStores;
      delete extStoresCopy[extId];
      const extControls = siv.state.extControls.filter(Controls => {
        return Controls.extId != extId;
      });
      const layers = siv.state.layers.filter(Layer => {
        return Layer.extId != extId;
      });
      const loadedExts = siv.state.loadedExts.filter(loadedExt => {
        return loadedExt != extId;
      });
      siv.setState({
        extStores: extStoresCopy,
        extControls: extControls,
        layers: layers,
        loadedExts: loadedExts,
      });
    },
    
    onClick(extID) {
      const siv = this;
      siv.setState({filesShown: false});
      if (siv.state.loadedExts.indexOf(extID) === -1) {
        const extFileObj = siv.state.extFiles.find(extFileObj => {
          return extFileObj.id = extID;
        });
        const ext = require(extFileObj.path);
        const extStore = Redux.createStore(ext.reducer);
        extStore.subscribe(siv.forceUpdate.bind(siv));
        siv.setState({
          extStores: Object.assign({}, siv.state.extStores, {[ext.extId]: extStore}),
          extControls: [ext.Controls].concat(siv.state.extControls),
          layers: siv.state.layers.concat(ext.Layer),
          loadedExts: siv.state.loadedExts.concat(ext.extId),
        });
      }
    },
  },
  
  render () {
    return (
      <div
         role="button"
         className="btn btn-default"
         onClick={this.props.onClick}>
        {this.props.extName}
      </div>
    );
  }
});

module.exports = extButton;
