const React = require('react');
const Files = require('./files');
const sivEvents = require('./siv-events');

const Sidebar = React.createClass({
  render() {
    const sivState = this.props.sivState;
    const pathsList = sivState.filePaths.pathsList;
    const extControls = sivState.extControls;
    const renderFiles = () => {
      if (pathsList.length > 0) {
        return (
          <Files sivState={sivState}
                 sivDispatch={this.props.sivDispatch}/>
        );
      } else if (this.props.imagesLoading) {
        return 'Images Loading...';
      }
      return 'No File To Display';
    };
    const renderExtControls = () => {
      if (extControls.length > 0) {
        return extControls.map((Controls, index) => {
          const extStore = sivState.extStores[Controls.extId];
          const isActive = index === 0;
          return (
            <Controls key={index}
                      sivState={sivState}
                      isActive={isActive}
                      sivDispatch={this.props.sivDispatch}
                      extState={extStore ? extStore.getState() : undefined}
                      extDispatch={extStore ? extStore.dispatch : undefined}/>
          );
        });
      } else {
        return 'No Extensions To Display';
      }
    };
    const classNames = (() => {
      if (sivState.filesShown) {
        return {
          toggleIcon: 'rotate',
          filesContainer: 'files-container visible',
          extContainer: 'extensions-container',
        };
      } else {
        return {
          toggleIcon: '',
          filesContainer: 'files-container',
          extContainer: 'extensions-container visible',
        };
      }
    })();

    const showHideFiles = () => {
      this.props.sivDispatch(
        sivEvents.sidebarToggleClicked()
      );
    };

    return (
      <div className="Sidebar">
        <div className="Sidebar-toggle-container" onClick={showHideFiles}>
          <div className="Sidebar-toggle-icon">
            <img className={classNames.toggleIcon}
                 src="icons/ic_chevron_left_black_24px.svg"/>
          </div>
          <div className="Sidebar-toggle-title">
            files
          </div>
        </div>
        <div className={classNames.filesContainer}>
          {renderFiles()}
        </div>
        <div className={classNames.extContainer}>
          {renderExtControls()}
        </div>
      </div>
    );
  },
});

module.exports = Sidebar;
