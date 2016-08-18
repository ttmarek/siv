'use strict';

const React = require('react');
const {
  extname,
  basename,
} = require('path');

class FileBoxFile extends React.Component {
  componentDidUpdate() {
    const {
      currentImg,
      filePath,
    } = this.props;

    if (currentImg === filePath) {
      this.element.scrollIntoViewIfNeeded();
    }
  }

  render() {
    const {
      currentImg,
      fileBoxID,
      filePath,
      onClick,
    } = this.props;

    const handleFileClick = event => {
      event.preventDefault();
      onClick(filePath, fileBoxID);
    };

    const fileName = basename(filePath, extname(filePath)); // sans extension

    return (
      <li>
        <a
          className={currentImg === path ? 'active' : ''}
          href=""
          onClick={handleFileClick}
          ref={element => this.element = element}
        >
          {fileName}
        </a>
      </li>
    );
  }
}

FileBoxFile.propTypes = {
  currentImg: React.PropTypes.string.isRequired,
  fileBoxID: React.PropTypes.number.isRequired,
  filePath: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func.isRequired,
};

module.exports = FileBoxFile;
