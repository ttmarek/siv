'use strict';

const React = require('react');
const FileBoxDir = require('./file-box-dir');
const FileBoxFile = require('./file-box-file');

const FileBox = (props) => {
  const filesAndDirs = props.paths.map((path, index) => {
    switch (typeof path) {
      case 'string':
        return (
          <FileBoxFile
            currentImg={props.currentImg}
            fileBoxID={props.Id}
            filePath={path}
            key={index}
            onClick={props.onImgClick}
          />
        );
      case 'object':
        return (
          <FileBoxDir
            Id={props.Id}
            currentImg={props.currentImg}
            dirObj={path}
            key={index}
            onImgClick={props.onImgClick}
          />
        );
      default:
        return '';
    }
  });

  return (
    <div className="file-box" style={{ height: props.height }}>
      <div className="file-box-controls">
        <img
          src="../icons/ic_close_black_18px.svg"
          onClick={() => props.onClose(props.Id)}
        />
      </div>
      <div className="file-box-content">
        <ul>{filesAndDirs}</ul>
      </div>
    </div>
  );
};

module.exports = FileBox;
