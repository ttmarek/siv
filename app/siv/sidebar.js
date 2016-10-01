'use strict';

const React = require('react');
const FileBox = require('./file-box');
const ControlPanel = require('./ControlPanel');
const calcFileBoxHeight = require('./file-box-height');

function Sidebar(props) {
  const {
    currentImg,
    extensionsControls,
    fileBoxes,
    onExtensionClose,
    onFileBoxClose,
    onFileClick,
    onFilesToggleClick,
  } = props;

  const sivState = props.sivState; // TODO: Get rid of this
  const sivDispatch = props.sivDispatch; // TODO: get rid of this
  const extStores = props.extStores; // TODO: Get rid of this

  const sidebarHeight = props.viewerDimensions.height - 30;
  const fileBoxHeight = calcFileBoxHeight(fileBoxes.length, sidebarHeight);
  const files = fileBoxes.map((fileBox, fileBoxID) =>
    <FileBox
      currentImg={currentImg}
      fileBoxHeight={fileBoxHeight}
      key={fileBoxID}
      onClose={onFileBoxClose}
      onFileClick={onFileClick}
      paths={fileBox.hierarchy}
    />
  );

  const controlPanels = extensionsControls.map((ExtensionControls, index) => {
    const extensionStore = extStores[ExtensionControls.extId];
    const isActive = index === 0;
    const handleControlPanelClose = () => {
      onExtensionClose(ExtensionControls.extId);
    };
    return (
      <ControlPanel
        extensionName={ExtensionControls.extName}
        isActive={isActive}
        onClose={handleControlPanelClose}
      >
        <ExtensionControls
          extDispatch={extensionStore.dispatch}
          extState={extensionStore.getState()}
          isActive={isActive}
          key={index}
          sivDispatch={sivDispatch}
          sivState={sivState}
        />
      </ControlPanel>
    );
  });

  const classNames = (() => {
    if (props.filesShown) {
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

  return (
    <div className="Sidebar">
      <div className="Sidebar-toggle-container" onClick={onFilesToggleClick}>
        <div className="Sidebar-toggle-icon">
          <img
            className={classNames.toggleIcon}
            src="../icons/ic_chevron_right_black_24px.svg"
          />
        </div>
        <div className="Sidebar-toggle-title">files</div>
      </div>
      <div className={classNames.filesContainer}>
        {files}
      </div>
      <div className={classNames.extContainer}>
        {controlPanels}
      </div>
    </div>
  );
}

Sidebar.PropTypes = {
  onExtensionClose: React.PropTypes.func.isRequired,
  onFileBoxClose: React.PropTypes.func.isRequired,
  onFileClick: React.PropTypes.func.isRequired,
  onFilesToggleClick: React.PropTypes.func.isRequired,
  //
  extensionsControls: React.PropTypes.array.isRequired,
  sivDispatch: React.PropTypes.func.isRequired,
  extControls: React.PropTypes.array.isRequired,
  viewerDimensions: React.PropTypes.object.isRequired,
  fileBoxes: React.PropTypes.array.isRequired,
  currentImg: React.PropTypes.string.isRequired,
  extStores: React.PropTypes.object.isRequired,
  filesShown: React.PropTypes.bool.isRequired,
};

module.exports = Sidebar;
