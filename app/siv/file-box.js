'use strict';

const React = require('react');
const FileBoxDir = require('./file-box-dir');
const FileBoxFile = require('./file-box-file');

function FileBox(props) {
  const {
    currentImg,
    fileBoxHeight,
    onClose,
    onFileClick,
    paths,
  } = props;

  const filesAndDirs = paths.map((path, index) => {
    if (typeof path === 'object') {
      return (
        <FileBoxDir
          currentImg={currentImg}
          directory={path}
          key={index}
          onFileClick={onFileClick}
        />
      );
    }
    return (
      <FileBoxFile
        currentImg={currentImg}
        filePath={path}
        key={index}
        onClick={onFileClick}
      />
    );
  });

  const fileBoxStyles = { height: `${fileBoxHeight}px` };

  return (
    <div className="file-box" style={fileBoxStyles}>
      <div className="file-box-controls">
        <img
          role="presentation"
          src="../icons/ic_close_black_18px.svg"
          onClick={onClose}
        />
      </div>
      <div className="file-box-content">
        <ul>{filesAndDirs}</ul>
      </div>
    </div>
  );
}

FileBox.propTypes = {
  currentImg: React.PropTypes.string.isRequired,
  fileBoxHeight: React.PropTypes.number.isRequired,
  onClose: React.PropTypes.func.isRequired,
  onFileClick: React.PropTypes.func.isRequired,
  paths: React.PropTypes.arrayOf(
    React.PropTypes.oneOfType([
      React.PropTypes.string, // file
      React.PropTypes.object, // directory
    ])
  ).isRequired,
};

module.exports = FileBox;
