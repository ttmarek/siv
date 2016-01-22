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
        return React.createElement(Files, { sivState: sivState,
          sivDispatch: this.props.sivDispatch });
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
          return React.createElement(Controls, { key: index,
            sivState: sivState,
            isActive: isActive,
            sivDispatch: this.props.sivDispatch,
            extState: extStore ? extStore.getState() : undefined,
            extDispatch: extStore ? extStore.dispatch : undefined });
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

    return React.createElement(
      'div',
      { className: 'Sidebar' },
      React.createElement(
        'div',
        { className: 'Sidebar-toggle-container', onClick: showHideFiles },
        React.createElement(
          'div',
          { className: 'Sidebar-toggle-icon' },
          React.createElement('img', { className: classNames.toggleIcon,
            src: 'icons/ic_chevron_left_black_24px.svg' })
        ),
        React.createElement(
          'div',
          { className: 'Sidebar-toggle-title' },
          'files'
        )
      ),
      React.createElement(
        'div',
        { className: classNames.filesContainer },
        renderFiles()
      ),
      React.createElement(
        'div',
        { className: classNames.extContainer },
        renderExtControls()
      )
    );
  },
});

module.exports = Sidebar;
