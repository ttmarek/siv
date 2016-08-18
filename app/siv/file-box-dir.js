'use strict';

const Path = require('path');
const React = require('react');
const FileBoxFile = require('./file-box-file');

const FileBoxDir = React.createClass({
  propTypes: {
    Id: React.PropTypes.number.isRequired,
    currentImg: React.PropTypes.string.isRequired,
    dirObj: React.PropTypes.object.isRequired,
    onImgClick: React.PropTypes.func.isRequired,
  },
  getInitialState() {
    return {
      hidden: false,
    };
  },
  render() {
    const toggleVisibility = (click) => {
      click.preventDefault();
      this.setState({ hidden: !this.state.hidden });
    };

    const dirName = this.props.dirObj.dir.split(Path.sep).pop();
    const children = this.props.dirObj.children.map((path, index) =>
      <FileBoxFile
        currentImg={this.props.currentImg}
        fileBoxID={this.props.id}
        filePath={path}
        key={index}
        onClick={this.props.onImgClick}
      />
    );

    return (
      <li>
        <img
          className={this.state.hidden ? 'file-box-dir-hidden' : 'file-box-dir-shown'}
          onClick={toggleVisibility}
          src="../icons/ic_arrow_drop_down_black_18px.svg"
        />
        <a className="dir-link" href="" onClick={toggleVisibility}>
          {dirName}
        </a>
        <ul
          className={this.state.hidden ? 'file-box-dir-listing hidden' : 'file-box-dir-listing'}
        >
          {children}
        </ul>
      </li>
    );
  },
});

module.exports = FileBoxDir;
