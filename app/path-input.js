'use strict'
const React = require('react')
const images = require('./images')
const sivEvents = require('./siv-events')
const PathInput = React.createClass({
  getInitialState () {
    return {
      value: ''
    }
  },
  updateValue (change) {
    this.setState({value: change.target.value})
  },
  render () {
    const handlePathInputSubmit = (event) => {
      event.preventDefault()
      const filePath = event.target.pathInput.value
      images.load(filePath)
        .then(img => {
          this.props.sivDispatch(
            sivEvents.imagesLoaded({[filePath]: img})
          )
          this.props.sivDispatch(
            sivEvents.setCurrentImg(filePath)
          )
        })
      this.setState({value: ''})
    }
    const currentImg = this.props.sivState.currentImg
    return React.createElement(
      'div',
      { id: 'PathInput',
        className: this.props.pathInputShown ? 'open' : '' },
      React.createElement(
        'form',
        { onSubmit: handlePathInputSubmit },
        React.createElement('input', { type: 'text',
          name: 'pathInput',
          placeholder: 'Image path...',
          value: this.state.value || currentImg,
          onChange: this.updateValue })
      )
    )
  }
})
module.exports = PathInput
