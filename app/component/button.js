const React = require('react')

const Button = React.createClass({
  propTypes: {
    btnType: React.PropTypes.string.isRequired,
    btnName: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func.isRequired,
    active: React.PropTypes.bool
  },

  render () {
    const classes = ['btn']
    if (this.props.btnType === 'blue') {
      classes.push('btn-blue')
    } else if (this.props.btnType === 'regular') {
      classes.push('btn-default')
    }
    if (this.props.active) {
      classes.push('active')
    }
    return React.DOM.button(
      {
        className: classes.join(' '),
        onClick: this.props.onClick
      },
      this.props.btnName
    )
  }
})

module.exports = Button
