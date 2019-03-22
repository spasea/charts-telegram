class Drawing {
  scale = window.devicePixelRatio

  /**
   *
   * @param {HTMLElement} canvas
   * @param {number} width
   * @param {number} height
   */
  constructor (canvas, width, height) {
    this.canvas = canvas
    this.canvas.style.setProperty('--height', `${height}px`)
    this.canvas.style.setProperty('--width', `${width}px`)

    this.height = height
    this.width = width

    this.ctx = this.canvas.getContext('2d')
    this.ctx.scale(this.scale, this.scale)

    this.canvas.height = this.getScale(height)
    this.canvas.width = this.getScale(width)
  }

  clearCanvas () {
    this.ctx.clearRect(0, 0, this.getScale(this.width), this.getScale(this.height))
  }

  getScale = value => value * this.scale

  /**
   * Draw a line from the start coordinates to the end coordinates
   * @param {Coordinates} start
   * @param {Coordinates} end
   * @param {String} color?
   * @param {number} lineWidth?
   */
  drawALine (start, end, color = 'rgba(0, 0, 0, 0.8)', lineWidth = 2) {
    this.ctx.strokeStyle = color
    this.ctx.lineWidth = this.getScale(lineWidth)

    this.ctx.beginPath()
    this.ctx.moveTo(...start.value.map(this.getScale))
    this.ctx.lineTo(...end.value.map(this.getScale))
    this.ctx.stroke()
    // this.ctx.fillText(start.value[1], ...start.value)
  }

  /**
   * Draw a point in the given coordinates
   * @param {Coordinates} coordinates
   * @param {number} radius
   * @param {String} color
   */
  drawADot (coordinates, radius, color = 'rgba(255, 153, 255, 0.8)') {
    this.ctx.fillStyle = color
    this.ctx.beginPath()
    this.ctx.arc(...coordinates.value.map(this.getScale), radius, 0, 2 * Math.PI)
    this.ctx.fill()
  }
}

export default Drawing
