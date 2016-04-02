'use strict'
const React = require('react')
const h = require('react-hyperscript')
const setImage = require('./setImage')

const PathInput = React.createClass({
  propTypes: {
    sivDispatch: React.PropTypes.func.isRequired,
    sivState: React.PropTypes.object.isRequired,
    pathInputShown: React.PropTypes.bool.isRequired
  },

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
      setImage(filePath, this.props.sivDispatch)
      this.setState({value: ''})
    }
    const currentImg = this.props.sivState.currentImg
    return (
      h('div#PathInput', { className: this.props.pathInputShown ? 'open' : ''}, [
        h('form', { onSubmit: handlePathInputSubmit }, [
          h('input', {
            type: 'text',
            name: 'pathInput',
            placeholder: 'Image path...',
            value: this.state.value || currentImg,
            onChange: this.updateValue
          })
        ])
      ])
    )
  }
})
module.exports = PathInput
