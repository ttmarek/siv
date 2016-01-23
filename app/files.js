'use strict';
const Path = require('path');
const React = require('react');
const Image = require('./image');
const sivEvents = require('./siv-events');

const FileComponent = React.createClass({
  setCurrentImg(click) {
    click.preventDefault();
    const filePath = click.target.getAttribute('data-file-path');
    this.props.sivDispatch(
      sivEvents.setCurrentImg(filePath)
    );
  },

  render() {
    const style = (() => {
      const currentImg = this.props.sivState.currentImg;
      if (currentImg === this.props.filePath) {
        return {
          background: '#337ab7',
          color: '#f1f1f1',
        };
      } else {
        return {};
      }
    })();

    return React.createElement(
      'li',
      null,
      React.createElement(
        'a',
        { href: '',
          'data-file-path': this.props.filePath,
          style: style,
          onClick: this.setCurrentImg },
        Path.basename(this.props.filePath)
      )
    );
  }
});


const DirComponent = React.createClass({
  getInitialState() {
    return {
      hidden: false,
    };
  },

  toggleVisibility(click) {
    click.preventDefault();
    this.setState({hidden: !this.state.hidden});
  },

  dirName(dir) {
    return dir.split(Path.sep).pop();
  },

  render() {
    const children = this.props.dirObj.children.map((path, index) => {
      return React.createElement(FileComponent, {
        key: index,
        sivDispatch: this.props.sivDispatch,
        sivState: this.props.sivState,
        filePath: path });
    });

    return React.createElement(
      'li',
      { className: 'dir' },
      React.createElement('img', { style: this.state.hidden ? { transform: 'rotate(-90deg)' } : {},
        onClick: this.toggleVisibility,
        src: 'icons/ic_arrow_drop_down_black_18px.svg' }),
      React.createElement(
        'a',
        { href: '',
          className: 'dir-link',
          onClick: this.toggleVisibility },
        this.dirName(this.props.dirObj.dir)
      ),
      React.createElement(
        'ul',
        { style: this.state.hidden ? { display: 'none' } : {} },
        children
      )
    );
  }
});

const FilesComponent = React.createClass({
  render() {
    const pathsHierarchy = this.props.sivState.filePaths.hierarchy;
    const components = pathsHierarchy.map((path, index) => {
      switch (typeof path) {
      case 'string':
        return React.createElement(FileComponent, {
          key: index,
          filePath: path,
          sivDispatch: this.props.sivDispatch,
          sivState: this.props.sivState });
      case 'object':
        return React.createElement(DirComponent, {
          key: index,
          dirObj: path,
          sivDispatch: this.props.sivDispatch,
          sivState: this.props.sivState });
      default:
        return '';
      }
    });

    return React.createElement(
      'ul',
      null,
      components
    );
  }
});

module.exports = FilesComponent;
