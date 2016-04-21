const mathJS = require('mathjs')

document.addEventListener('DOMContentLoaded', () => {
  const inputForm = document.getElementById('input-form')
  const inputBox = document.getElementById('input')
  const display = document.getElementById('display')
  inputForm.addEventListener('submit', submitEvent => {
    submitEvent.preventDefault() // Prevent the window from refreshing
    const calculation = ((div, p1, p2) => {
      div.className = 'calculation'
      p1.className = 'display-input'
      p2.className = 'display-result'
      p1.textContent = inputBox.value
      try {
        p2.textContent = mathJS.eval(inputBox.value)
      } catch (e) {
        p2.textContent = e
        p2.classList.add('error')
      }
      div.appendChild(p1)
      div.appendChild(p2)
      return div
    })(document.createElement('div'),
       document.createElement('p'),
       document.createElement('p'))
    display.appendChild(calculation)
    calculation.scrollIntoView()
    inputBox.value = ''            // Clear the input
  })
})
