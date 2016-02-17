const React = require('react')

const Button = React.createClass({
  propTypes: {
    btnType: React.PropTypes.string.isRequired,
    btnName: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func.isRequired
  },

  render () {
    const className = (() => {
      switch (this.props.btnType) {
        case 'blue':
          return 'btn btn-blue'
        case 'regular':
          return 'btn btn-default'
        default:
          return 'btn'
      }
    })()
    return React.DOM.button(
      {
        className,
        onClick: this.props.onClick
      },
      this.props.btnName
    )
  }
})

module.exports = Button
