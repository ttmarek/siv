const React = require('react');

const FileNav = React.createClass({
  propTypes: {
    onPrevClick: React.PropTypes.func.isRequired,
    onNextClick: React.PropTypes.func.isRequired,
  },

  statics: {
    goTo(nextOrPrev) {
      const imgInspector = this;
      const pathsList = imgInspector.state.paths.list;
      const maxIndex = pathsList.length - 1;
      const currIndex = pathsList.indexOf(imgInspector.state.currentImg);
      let index = 0;
      
      if (nextOrPrev === 'next') {
        currIndex === maxIndex ? index = 0 : index = currIndex + 1;
      } else if (nextOrPrev === 'prev') {
        currIndex === 0 ? index = maxIndex : index = currIndex - 1;
      }
      
      this.setState({currentImg: pathsList[index]});
    },
  },
  
  render() {
    return (
      <div className="Toolbar-section FileNav">
        <div
           role="button"
           className="btn btn-blue"
           onClick={this.props.onPrevClick}>
          prev
        </div>
        <div
           role="button"
           className="btn btn-blue"
           onClick={this.props.onNextClick}>
          next
        </div>
      </div>
    );
  }
});

module.exports = FileNav;
