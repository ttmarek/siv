'use strict';

const React = require('react');
const FileBox = require('./file-box');
const fileBoxHeight = require('./file-box-height');

const Sidebar = React.createClass({
  propTypes: {
    sivDispatch: React.PropTypes.func.isRequired,
    extControls: React.PropTypes.array.isRequired,
    viewerDimensions: React.PropTypes.object.isRequired,
    fileBoxes: React.PropTypes.array.isRequired,
    currentImg: React.PropTypes.string.isRequired,
    extStores: React.PropTypes.object.isRequired,
    filesShown: React.PropTypes.bool.isRequired,
  },

  render() {
    const sivState = this.props.sivState;
    const extControls = this.props.extControls;
    const renderFiles = () => {
      const sidebarHeight = this.props.viewerDimensions.height - 30;
      const handleFileBoxClose = (id) => {
        this.props.sivDispatch({
          type: 'CLOSE_FILE_BOX',
          index: id,
        });
      };
      const handleImageClick = (path, Id) => {
        this.props.sivDispatch({
          type: 'SET_CURRENT_IMG',
          imgPath: path,
        });
        this.props.sivDispatch({
          type: 'SET_CURRENT_FILE_BOX',
          Id: Id,
        });
      };
      if (this.props.fileBoxes.length > 0) {
        return this.props.fileBoxes.map((fileBox, index) =>
          <FileBox
            key={index}
            Id={index}
            height={fileBoxHeight(this.props.fileBoxes.length, sidebarHeight)}
            onClose={handleFileBoxClose}
            onImgClick={handleImageClick}
            currentImg={this.props.currentImg}
            paths={fileBox.hierarchy}
          />
        );
      }
      return 'No Files To Display';
    };

    const renderControls = () => {
      if (extControls.length > 0) {
        return extControls.map((Controls, index) => {
          const extStore = this.props.extStores[Controls.extId];
          const isActive = index === 0;
          const titleColor = (() => {
            if (index === 0) {
              return { color: 'rgb(51, 122, 183)' };
            }
            return {};
          })();
          const close = () => {
            this.props.sivDispatch({
              type: 'CLOSE_EXTENSION',
              extId: Controls.extId,
            });
          };
          return (
            <div className="ext-container">
              <div className="ext-title">
                <span style={titleColor}>{Controls.extName}</span>
                <img src="../icons/ic_close_white_18px.svg" onClick={close} />
              </div>
              <Controls
                extDispatch={extStore ? extStore.dispatch : undefined}
                extState={extStore ? extStore.getState() : undefined}
                isActive={isActive}
                key={index}
                sivDispatch={this.props.sivDispatch}
                sivState={sivState}
              />
            </div>
          );
        });
      }
      return 'No Extensions To Display';
    };

    const classNames = (() => {
      if (this.props.filesShown) {
        return {
          toggleIcon: 'rotate',
          filesContainer: 'files-container visible',
          extContainer: 'extensions-container',
        };
      }
      return {
        toggleIcon: '',
        filesContainer: 'files-container',
        extContainer: 'extensions-container visible',
      };
    })();

    const showHideFiles = () => {
      this.props.sivDispatch({
        type: 'SHOW_HIDE_FILES',
      });
    };

    return (
      <div className="Sidebar">
        <div className="Sidebar-toggle-container" onClick={showHideFiles}>
          <div className="Sidebar-toggle-icon">
            <img
              className={classNames.toggleIcon}
              src="../icons/ic_chevron_right_black_24px.svg"
            />
          </div>
          <div className="Sidebar-toggle-title">files</div>
        </div>
        <div className={classNames.filesContainer}>
          {renderFiles()}
        </div>
        <div className={classNames.extContainer}>
          {renderControls()}
        </div>
      </div>
    );
  },
});

module.exports = Sidebar;
