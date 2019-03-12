class ChartBoard {
  data = {
    columns: [],
    types: {},
    names: {},
    colors: {},
  }

  constructor(canvas, height, width) {
    this.canvas = canvas
    this.height = height
    this.width = width
    this.biggestY = 0
    this.biggestX = 0
    this.yArray = []
    this.ctx = canvas.getContext('2d')
    this.canvas.width = width
    this.canvas.height = height
  }

  set chartData (data) {
    this.data = {...data}
  }

  get xAxis () {
    const xMarker = this.data.types.x
    const xData = this.data.columns.find(column => column[0] === xMarker) || []
    return xData.slice(1)
  }

  get yAxis () {
    const yMarkers = Object.keys(this.data.types).filter(key => key !== 'x')

    return yMarkers.map(marker => {
      const column = this.data.columns.find(column => column[0] === marker) || []

      return {
        color: this.data.colors[marker],
        name: this.data.names[marker],
        columns: column.slice(1),
      }
    })
  }

  set canvasWidth (width) {
    this.width = width
    this.canvas.width = width
  }

  set canvasHeight (height) {
    this.height = height
    this.canvas.height = height
  }

  clearCanvas () {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }

  xScale = x => x * (this.width - 4) / this.biggestX + 2
  yScale = y => {
    const smallestY = Math.min(
      ...this.yArray
    )

    const diff = this.biggestY - smallestY

    return (y - smallestY + 1) * (this.height - 8) / diff + 2
  }

  setTheBiggest () {
    const yArray = this.yAxis.reduce((acc, current) => [
      ...acc,
      ...current.columns
    ], [])
    this.yArray = yArray

    this.biggestY = Math.max(
      ...yArray
    )

    this.biggestX = this.xAxis.length
  }

  drawAPlot () {
    this.xAxis.forEach((xPoint, idx) => {
      const currentX = this.xScale(idx)
      const nextX = this.xScale(idx + 1)

      if (!nextX) {
        return
      }

      this.yAxis.forEach(yPoint => {
        const currentY = this.yScale(yPoint.columns[idx])
        const nextY = this.yScale(yPoint.columns[idx + 1])

        if (!nextY) {
          return
        }

        this.drawALine([currentX, currentY], [nextX, nextY], yPoint.color)
        // this.drawADot([currentX, currentY], 2, '#000')
      })
    })
  }

  drawXAxises () {
    this.setTheBiggest()
    const linesAmount = 5

    const distanceBetween = this.biggestY / linesAmount
    const lines = Array(linesAmount).fill(null).map((_, idx) => ({
      y: (idx + 1) * distanceBetween
    }))

    lines.push({
      y: 0
    })

    lines.forEach(line => {
      const scale = y => Math.round(y * (this.height - 4) / this.biggestY + 2)

      const yScaled = scale(line.y)

      const color = 'rgb(248, 247, 250)'
      // const color = 'rgb(0, 0, 0)'

      this.drawALine([0, yScaled], [this.width, yScaled], color, 1)
    })
  }

  drawALine (start, end, color = 'rgba(255,153,255,0.8)', lineWidth = 2) {
    // this.clearCanvas()

    // this.ctx.fillStyle = 'rgba(0,0,0,0.4)'
    this.ctx.strokeStyle = color
    this.ctx.lineWidth = lineWidth

    this.ctx.beginPath()
    this.ctx.moveTo(...start)
    this.ctx.lineTo(...end)
    this.ctx.stroke()
  }

  drawADot (coordinates, radius, color) {
    this.ctx.fillStyle = color
    this.ctx.beginPath()
    this.ctx.arc(...coordinates, radius, 0, 2 * Math.PI)
    this.ctx.fill()
  }
}

export default ChartBoard
