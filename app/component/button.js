const React = require('react')
const h = require('react-hyperscript')

const Button = (props) => {
  const classes = ['btn']
  if (props.btnType === 'blue') {
    classes.push('btn-blue')
  } else if (props.btnType === 'regular') {
    classes.push('btn-default')
  }
  if (props.active) {
    classes.push('btn-active')
  }
  return (
    h('button', {
      className: classes.join(' '),
      onClick: props.onClick
    }, props.btnName)
  )
}

module.exports = Button
