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
      filePath,
      onClick,
    } = this.props;

    const handleFileClick = event => {
      event.preventDefault();
      onClick(filePath);
    };

    const fileName = basename(filePath, extname(filePath)); // sans extension
    const fileLinkStyle = currentImg === filePath ? 'active' : '';
    const saveElementRef = element => { this.element = element; };

    return (
      <li>
        <a
          className={fileLinkStyle}
          href=""
          onClick={handleFileClick}
          ref={saveElementRef}
        >
          {fileName}
        </a>
      </li>
    );
  }
}

FileBoxFile.propTypes = {
  currentImg: React.PropTypes.string.isRequired,
  filePath: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func.isRequired,
};

module.exports = FileBoxFile;
