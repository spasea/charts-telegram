class Drawing {
  /**
   *
   * @param {HTMLElement} canvas
   * @param {number} width
   * @param {number} height
   */
  constructor (canvas, width, height) {
    this.canvas = canvas
    this.height = height
    this.width = width
    this.ctx = this.canvas.getContext('2d')
    this.canvas.height = height
    this.canvas.width = width
  }

  clearCanvas () {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }

  /**
   * Draw a line from the start coordinates to the end coordinates
   * @param {Coordinates} start
   * @param {Coordinates} end
   * @param {String} color?
   * @param {number} lineWidth?
   */
  drawALine (start, end, color = 'rgba(255, 153, 255, 0.8)', lineWidth = 2) {
    this.ctx.strokeStyle = color
    this.ctx.lineWidth = lineWidth

    this.ctx.beginPath()
    this.ctx.moveTo(...start.value)
    this.ctx.lineTo(...end.value)
    this.ctx.stroke()
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
    this.ctx.arc(...coordinates.value, radius, 0, 2 * Math.PI)
    this.ctx.fill()
  }
}

export default Drawing
