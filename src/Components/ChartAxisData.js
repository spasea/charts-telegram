import Coordinates from '../DTO/Coordinates'

class ChartAxisData {
  _DrawingService = null
  maxY = 0
  minY = 0
  xOffset = 2
  linesAmount = 5

  constructor(chartData, width, height, options = {}) {
    options = {
      xOffset: 2,
      ...options
    }
    this.chartData = chartData
    this.width = width
    this.height = height
    this.xOffset = options.xOffset

    this._updateMaxY(chartData)
  }

  _updateMaxY (data) {
    const allY = data.yAxis
      .map(column => column.slice(1))
      .reduce((acc, column) => [
        ...acc,
        ...column
      ], [])

    this.maxY = Math.max(...allY)
  }

  initLines () {
    Array(this.linesAmount + 1).fill(null).forEach((_, idx) => {
      const diff = this.scaleHeight(idx * this.linesDistance)
      const yPosition = Math.round(this.getXPosition(this.height - diff))

      const start = new Coordinates(0, yPosition)
      const end = new Coordinates(this.width, yPosition)
      this.DrawingService.drawALine(start, end, '#fbf9fb', 2)
    })
  }

  set DrawingService (service) {
    this._DrawingService = service
  }

  get DrawingService () {
    return this._DrawingService
  }

  scaleHeight (value) {
    return value * (this.height - this.xOffset) / this.maxY
  }

  getXPosition (value) {
    return value - this.xOffset / 2
  }

  get linesDistance () {
    return (this.maxY - this.minY) / this.linesAmount
  }
}

export default ChartAxisData
