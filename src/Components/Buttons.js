class Buttons {
  _DomService = null

  /**
   *
   * @param {{name, id, color}[]} buttons
   * @param {Element} buttonsContainer
   * @param {number[]} buttonsSelected
   */
  constructor (buttons, buttonsContainer, buttonsSelected) {
    this.buttons = buttons
    this.buttonsContainer = buttonsContainer
    this.buttonsSelected = buttonsSelected
    this.classNames = {
      checked: 'chart-button--is-checked',
      default: 'chart-button',
    }
    this.primaryColorName = '--primary-color'
    this.buttonElements = []
    this.generateButtonElements()
  }

  addButtonsHandler (handler) {
    this.handler = handler
  }

  /**
   *
   * @param {name, id, color} button
   */
  generateButton = button => {
    const buttonElement = document.createElement('button')
    buttonElement.innerText = button.name
    buttonElement.classList.add(this.classNames.default)
    buttonElement.dataset.id = button.id
    buttonElement.addEventListener('click', () => {
      this.handler(button.id)
      this.render()
    })
    buttonElement.style.setProperty(this.primaryColorName, button.color)

    return buttonElement
  }

  generateButtonElements () {
    this.buttonElements = this.buttons.map(this.generateButton)
  }

  insertButtons = () => {
    this.DomService.insert(this.buttonElements, this.buttonsContainer)
  }

  /**
   *
   * @param {Dom} service
   * @constructor
   */
  set DomService (service) {
    this._DomService = service
  }

  /**
   *
   * @returns {Dom}
   * @constructor
   */
  get DomService () {
    return this._DomService
  }

  render () {
    this.buttonsContainer.childNodes.forEach(button => {
      const buttonId = +button.dataset.id
      const isChecked = this.buttonsSelected.includes(buttonId)
      button.classList[isChecked ? 'add' : 'remove'](this.classNames.checked)
    })
  }
}

export default Buttons
