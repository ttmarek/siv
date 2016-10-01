'use strict';

const Path = require('path');
const React = require('react');
const FileBoxFile = require('./file-box-file');

class FileBoxDir extends React.Component {
  constructor() {
    super();
    this.state = {
      isDirHidden: false,
    };
  }

  render() {
    const {
      isDirHidden,
    } = this.state;

    const {
      currentImg,
      directory,
      onFileClick,
    } = this.props;

    const handleDirNameClick = event => {
      event.preventDefault();
      this.setState({ isDirHidden: !isDirHidden });
    };

    const dirName = directory.dir.split(Path.sep).pop();
    const fileList = directory.children.map((filePath, index) =>
      <FileBoxFile
        currentImg={currentImg}
        filePath={filePath}
        key={index}
        onClick={onFileClick}
      />
    );

    const arrowStyle = isDirHidden ? 'file-box-dir-hidden' : 'file-box-dir-shown';
    const fileListStyle = isDirHidden ? 'file-box-dir-listing hidden' : 'file-box-dir-listing';

    return (
      <li>
        <img
          className={arrowStyle}
          onClick={handleDirNameClick}
          role="presentation"
          src="../icons/ic_arrow_drop_down_black_18px.svg"
        />
        <a className="dir-link" href="" onClick={handleDirNameClick}>
          {dirName}
        </a>
        <ul className={fileListStyle}>
          {fileList}
        </ul>
      </li>
    );
  }
}

FileBoxDir.propTypes = {
  currentImg: React.PropTypes.string.isRequired,
  directory: React.PropTypes.shape({
    dir: React.PropTypes.string,
    children: React.PropTypes.arrayOf(React.PropTypes.string),
  }).isRequired,
  onFileClick: React.PropTypes.func.isRequired,
};

module.exports = FileBoxDir;
