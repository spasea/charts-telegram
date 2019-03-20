class Range {
  _DomService = null
  _elements = {}
  componentUpdate = id => id

  constructor (height, width, maxValue, minValue, options = {}) {
    options = {
      rangesRef: null,
      range: [0, 2],
      ...options
    }

    this.height = height
    this.width = width
    this.maxValue = maxValue
    this.minValue = minValue
    this.range = options.range
    this.rangesRef = options.rangesRef
    this.customProps = {
      distance: '--distance',
      thumbWidth: '--thumb-width',
    }
    this.updateDimensions(width, height)
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

  createInput (className) {
    const input = document.createElement('input')
    input.type = 'range'
    input.min = this.minValue
    input.max = this.maxValue
    input.classList.add('range__input')
    input.classList.add(className)

    return input
  }

  createOverlay (className) {
    const overlay = document.createElement('div')
    overlay.classList.add('range__cover')
    overlay.classList.add(className)

    return overlay
  }

  generateRanges () {
    const smallerInput = this.createInput('range__input--is-smaller')
    const middleInput = this.createInput('range__input--is-middle')
    const biggerInput = this.createInput('range__input--is-bigger')
    const leftOverlay = this.createOverlay('range__cover--is-left')
    const rightOverlay = this.createOverlay('range__cover--is-right')

    this._elements.smallerInput = smallerInput
    this._elements.middleInput = middleInput
    this._elements.biggerInput = biggerInput
    this._elements.leftOverlay = leftOverlay
    this._elements.rightOverlay = rightOverlay

    this._componentWillUpdate()
  }

  updateDimensions (width, height) {
    this.rangesRef.style.setProperty('--width', width)
    this.rangesRef.style.setProperty('--height', height)
  }

  getScale (value) {
    return value * this.width / (this.maxValue - this.minValue)
  }

  _componentWillUpdate () {
    this._elements.smallerInput.value = this.range[0]
    this._elements.biggerInput.value = this.range[1]
    this._elements.middleInput.value = Math.round((this.range[1] - this.range[0]) / 2)
    this._elements.middleInput.style.setProperty(this.customProps.thumbWidth, `${this.getScale(this.range[1] - this.range[0])}px`)
  }

  renders () {
    this.generateRanges()
    this.DomService.insert(Object.values(this._elements), this.rangesRef)
  }
}

export default Range
