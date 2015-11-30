const Path = require('path');
const React = require('react');
const Image = require('./image');

const FileComponent = React.createClass({

  propTypes: {
    filePath: React.PropTypes.string.isRequired,
    onFileClick: React.PropTypes.func.isRequired,
    currentImg: React.PropTypes.string.isRequired,
  },

  statics: {
    setCurrentImg(click) {
      click.preventDefault();
      const filePath = click.target.getAttribute('data-file-path');
      this.setState({currentImg: filePath});
    }
  },
  
  render() {
    let style = {};
    
    if (this.props.currentImg === this.props.filePath) {
      style = {
        background: '#337ab7',
        color: '#f1f1f1',
      };
    }

    return (
      <li>
        <a href=""
           data-file-path={this.props.filePath}
           style={style}
           onClick={this.props.onFileClick}>
          {Path.basename(this.props.filePath)}
        </a>
      </li>
    );
  }
});


const DirComponent = React.createClass({
  
  propTypes: {
    dir: React.PropTypes.object.isRequired,
    pathsList: React.PropTypes.array.isRequired,
    onFileClick: React.PropTypes.func.isRequired,
    currentImg: React.PropTypes.string.isRequired,
  },

  getInitialState() {
    return {
      hidden: true,
    };
  },  

  toggleVisibility(click) {
    click.preventDefault();
    this.setState({hidden: !this.state.hidden});
  },
  
  dirName(dir) {
    return dir.split(Path.sep).pop();
  },
  
  render() {
    
    return (
      <li className="dir">
        <img style={this.state.hidden ? {transform: 'rotate(-90deg)'} : {}}
             onClick={this.toggleVisibility}
             src="icons/ic_arrow_drop_down_black_18px.svg"/>
        <a href=""
           className="dir-link"
           onClick={this.toggleVisibility}>
          {this.dirName(this.props.dir.path)}
        </a>        
        <PathsComponent
           pathsHierarchy={this.props.dir.contents}
           pathsList={this.props.pathsList}
           hidden={this.state.hidden}
           currentImg={this.props.currentImg}
           onFileClick={this.props.onFileClick}/>
      </li>
    );
  }
});

const PathsComponent = React.createClass({
  propTypes: {
    pathsHierarchy: React.PropTypes.array.isRequired,
    pathsList: React.PropTypes.array.isRequired,
    onFileClick: React.PropTypes.func.isRequired,
    currentImg: React.PropTypes.string.isRequired,
  },

  render() {
    const components = this.props.pathsHierarchy.map((path, index) => {
      switch (typeof path) {
      case 'string':
        return (
          <FileComponent
             key={index}
             filePath={path}
             currentImg={this.props.currentImg}
             onFileClick={this.props.onFileClick} />
        );
      case 'object':
        return (
          <DirComponent
             key={index}
             dir={path}
             pathsList={this.props.pathsList}
             currentImg={this.props.currentImg}
             onDirClick={this.props.onDirClick}
             onFileClick={this.props.onFileClick} />
        );
      default:
        return '';
      }
    });
    
    return (
      <ul style={this.props.hidden ? {display: 'none'} : {}}>
        {components}
      </ul>
    );
  }

});

module.exports = {
  Component: PathsComponent,
  Dir: DirComponent,
  File: FileComponent,
};
