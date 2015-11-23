const React = require('react');
const Image = require('./image');

const PathInput = React.createClass({

  statics: {
    setCurrentImgOnEnter(keyPress) {
      const ii = this;
      if (keyPress.key === 'Enter') {
        Image.addLayerIfNeeded.bind(ii)();
        ii.setState({currentImg: keyPress.target.value});
      }
    }
  },


  getInitialState() {
    return {
      value: '',
      shown: false,
    };
  },

  toggleVisibility() {
    this.setState({shown: !this.state.shown});
  },
  
  updateValue(change) {
    this.setState({value: change.target.value});
  },
  
  render() {
    const toggleClass = ['PathInput-control',
                         this.state.shown ? 'open' : ''].join(' ');
    const inputClass = ['PathInput',
                        this.state.shown ? 'open' : ''].join(' ');
    return (
      <div>
        <div className={toggleClass}
             role="button"
             onClick={this.toggleVisibility}>
          <img src="icons/ic_expand_more_black_24px.svg"/>
        </div>
        <input className={inputClass}
             type="text"
             placeholder="Image path..."
             value={this.state.value || this.props.currentImg}
             onChange={this.updateValue}
             onKeyUp={this.props.onInputKeyUp}/>
      </div>
    );
  }
});

module.exports = PathInput;
