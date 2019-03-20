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
      thumbScale: '--thumb-scale',
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
    smallerInput.step = 0.25
    smallerInput.addEventListener('input', e => {
      const val = e.target.value
      this.range[0] = +val
      this._componentWillUpdate()
    })

    const middleInput = this.createInput('range__input--is-middle')
    middleInput.step = 0.125
    middleInput.addEventListener('input', e => {
      const val = +e.target.value
      const previousValue = (this.range[1] + this.range[0]) / 2
      const diff = val - previousValue

      this.range[0] += diff
      this.range[1] += diff

      this._componentWillUpdate()
    })

    const biggerInput = this.createInput('range__input--is-bigger')
    biggerInput.step = 0.25
    biggerInput.addEventListener('input', e => {
      const val = e.target.value
      this.range[1] = +val
      this._componentWillUpdate()
    })

    const leftOverlay = this.createOverlay('range__cover--is-left')
    const rightOverlay = this.createOverlay('range__cover--is-right')

    this._elements.middleInput = middleInput
    this._elements.smallerInput = smallerInput
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
    // 6 is the width of the one of the delimiters and 4 is the offset
    return value * (this.width - 6 - 4) / (this.maxValue - this.minValue)
  }

  _componentWillUpdate () {
    this._elements.smallerInput.value = this.range[0]
    this._elements.biggerInput.value = this.range[1]

    const diff = this.range[1] - this.range[0]
    const width = this.getScale(diff)
    this._elements.middleInput.style.setProperty(this.customProps.thumbScale, width / 4)
    this._elements.middleInput.value = (this.range[1] + this.range[0]) / 2

    this.componentUpdate(this.range)
  }

  renders () {
    this.generateRanges()
    this.DomService.insert(Object.values(this._elements), this.rangesRef, false)
  }
}

export default Range
