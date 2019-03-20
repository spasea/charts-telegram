class Buttons {
  _DomService = null
  componentUpdate = () => ''

  /**
   *
   * @param {{name, id, color}[]} buttons
   * @param {Element} buttonsContainer
   * @param {string[]} buttonsSelected
   */
  constructor (buttons, buttonsContainer, buttonsSelected) {
    this.buttons = buttons
    this.buttonsContainer = buttonsContainer
    this.buttonsSelected = buttonsSelected
    this.classNames = {
      checked: 'chart-button--is-checked',
      default: 'chart-button',
      checkbox: 'chart-button__checkbox'
    }
    this.primaryColorName = '--primary-color'
    this.buttonElements = []
    this.generateButtonElements()
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

  componentWillUpdate () {
    this.buttonsContainer.childNodes.forEach(button => {
      const buttonId = button.dataset.id
      const isChecked = this.buttonsSelected.includes(buttonId)
      button.classList[isChecked ? 'add' : 'remove'](this.classNames.checked)
    })
  }

  /**
   *
   * @param {name, id, color} button
   */
  generateButton = button => {
    const buttonElement = document.createElement('button')
    const checkElement = document.createElement('div')
    checkElement.classList.add(this.classNames.checkbox)

    buttonElement.innerHTML += checkElement.outerHTML
    buttonElement.innerHTML += button.name

    buttonElement.classList.add(this.classNames.default)

    if (this.buttonsSelected.includes(button.id)) {
      buttonElement.classList.add(this.classNames.checked)
    }

    buttonElement.dataset.id = button.id
    buttonElement.addEventListener('click', () => {
      this.componentUpdate(button.id)
      this.componentWillUpdate()
    })
    buttonElement.style.setProperty(this.primaryColorName, button.color)

    return buttonElement
  }

  generateButtonElements () {
    this.buttonElements = this.buttons.map(this.generateButton)
  }

  renders () {
    this.generateButtonElements()
    this.DomService.insert(this.buttonElements, this.buttonsContainer)
  }
}

export default Buttons
