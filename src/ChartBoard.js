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

  drawAPlot () {
    this.clearCanvas()

    const yArray = this.yAxis.reduce((acc, current) => [
      ...acc,
      ...current.columns
    ], [])

    const biggestY = Math.max(
      ...yArray
    )

    const smallestY = Math.min(
      ...yArray
    )

    const diff = biggestY - smallestY

    // this.canvasHeight = diff > 600 ? 600 : diff

    console.log({
      biggestY,
      smallsetY: smallestY,
      diff,
    })

    const biggestX = this.xAxis.length

    const xScale = x => x * this.width / biggestX
    const yScale = y => (y - smallestY + 1) * (this.height - 1) / diff

    this.xAxis.forEach((xPoint, idx) => {
      const currentX = xScale(idx)
      const nextX = xScale(idx + 1)

      if (!nextX) {
        return
      }

      this.yAxis.forEach(yPoint => {
        const currentY = yScale(yPoint.columns[idx])
        const nextY = yScale(yPoint.columns[idx + 1])

        if (!nextY) {
          return
        }

        this.drawALine([currentX, currentY], [nextX, nextY], yPoint.color)
      })
    })
  }

  drawALine (start, end, color = 'rgba(255,153,255,0.8)') {
    // this.clearCanvas()

    // this.ctx.fillStyle = 'rgba(0,0,0,0.4)'
    this.ctx.strokeStyle = color
    this.ctx.lineWidth = 2

    this.ctx.beginPath()
    this.ctx.moveTo(...start)
    this.ctx.lineTo(...end)
    this.ctx.stroke()
  }
}

export default ChartBoard
