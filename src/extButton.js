const React = require('react');

const extButton = React.createClass({
  propTypes: {
      extName: React.PropTypes.string.isRequired,
  },

  statics: {
    openExt(extID) {
      const siv = this;
      const extObj = siv.state.extFiles.find(extObj => {
        return extObj.id = extID;
      });
      const Ext = require(extObj.path);
      const extensions = siv.state.extensions;
      extensions.unshift(<Ext/>);
      siv.setState({extensions: extensions});
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
