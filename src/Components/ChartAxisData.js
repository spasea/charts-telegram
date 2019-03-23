import Coordinates from '../DTO/Coordinates'

class ChartAxisData {
  _DrawingService = null
  maxY = 0
  minY = 0
  xOffset = 2
  yOffset = [10, 3]
  linesAmount = 5

  constructor(chartData, width, height, options = {}) {
    options = {
      xOffset: 2,
      yOffset: [30, 3],
      ...options
    }
    this.chartData = chartData
    this.width = width
    this.height = height
    this.xOffset = options.xOffset
    this.yOffset = options.yOffset

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

  initLines = () => {
    Array(this.linesAmount + 1).fill(null).forEach((_, idx) => {
      const diff = this.scaleHeight(idx * this.linesDistance)
      const yPosition = Math.round(this.getYPosition(this.height - diff))

      const start = new Coordinates(0, yPosition)
      const end = new Coordinates(this.width, yPosition)
      this.DrawingService.drawALine(start, end, '#fbf9fb', 2)
    })
  }

  updateAxis = newData => {
    this._updateMaxY(newData)

    Array(this.linesAmount + 1).fill(null).forEach((_, idx) => {
      const diff = this.scaleHeight(idx * this.linesDistance)
      const yPosition = Math.round(this.getYPosition(this.height - diff))

      const start = new Coordinates(0, yPosition)
      const end = new Coordinates(this.width, yPosition)
      this.DrawingService.drawALine(start, end, '#fbf9fb', 2)
      this.DrawingService.writeAText(start, Math.round(this.yAxisTexts[idx] || idx), {
      })
    })
  }

  set DrawingService (service) {
    this._DrawingService = service
  }

  get DrawingService () {
    return this._DrawingService
  }

  scaleHeight (value) {
    return value * (this.height - this.yOffset[0]) / this.maxY
  }

  getYPosition (value) {
    return value - this.yOffset[1]
  }

  get linesDistance () {
    return (this.maxY - this.minY - this.yOffset[1]) / this.linesAmount
  }

  get yAxisTexts () {
    const diff = (this.maxY - this.minY) / this.linesAmount

    return Array(this.linesAmount + 1).fill(0)
      .map((_, idx) => diff * idx)
  }
}

export default ChartAxisData
