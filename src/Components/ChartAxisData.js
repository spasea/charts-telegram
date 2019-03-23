import Coordinates from '../DTO/Coordinates'

class ChartAxisData {
  _DrawingService = null
  maxY = 0
  minY = 0
  xOffset = 2
  yOffset = [10, 3]
  linesAmount = 5
  // Feb 29 length
  textLength = 32
  monthsNames = []

  constructor(chartData, width, height, options = {}) {
    options = {
      xOffset: 2,
      yOffset: [30, 30],
      monthsNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      ...options
    }
    this.chartData = chartData
    this.width = width
    this.height = height
    this.xOffset = options.xOffset
    this.yOffset = options.yOffset
    this.monthsNames = options.monthsNames

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
      const diff = this.workingHeight - this.scaleHeight(idx * this.linesDistance)
      const yPosition = this.getYPosition(diff)

      const start = new Coordinates(0, yPosition)
      const end = new Coordinates(this.width, yPosition)

      const xTextCoordinates = new Coordinates(
        idx * this.xTextsDistance,
        this.getYPosition(this.workingHeight) + 20
      )

      this.DrawingService.drawALine(start, end, '#fbf9fb', 2)
      this.DrawingService.writeAText(start, Math.round(this.yAxisTexts[idx]), {
        color: '#b0b2bb'
      })
      this.DrawingService.writeAText(xTextCoordinates, this.getXAxisTexts(this.chartData)[idx], {
        color: '#b0b2bb'
      })
    })
  }

  updateAxis = newData => {
    this._updateMaxY(newData)

    Array(this.linesAmount + 1).fill(null).forEach((_, idx) => {
      const diff = this.workingHeight - this.scaleHeight(idx * this.linesDistance)
      const yPosition = this.getYPosition(diff)

      const start = new Coordinates(0, yPosition)
      const end = new Coordinates(this.width, yPosition)

      const xTextCoordinates = new Coordinates(
        idx * this.xTextsDistance,
        this.getYPosition(this.workingHeight) + 20
      )

      this.DrawingService.drawALine(start, end, '#fbf9fb', 2)
      this.DrawingService.writeAText(start, Math.round(this.yAxisTexts[idx]), {
        color: '#b0b2bb'
      })
      this.DrawingService.writeAText(xTextCoordinates, this.getXAxisTexts(newData)[idx], {
        color: '#b0b2bb'
      })
    })
  }

  set DrawingService (service) {
    this._DrawingService = service
  }

  get DrawingService () {
    return this._DrawingService
  }

  get workingHeight () {
    return this.height - this.yOffset[0] - this.yOffset[1]
  }

  scaleHeight (value) {
    return value * this.workingHeight / this.maxY
  }

  getYPosition (value) {
    return value + this.yOffset[0]
  }

  get linesDistance () {
    return (this.maxY - this.minY) / this.linesAmount
  }

  get xTextsDistance () {
    return (this.width - this.xOffset - this.textLength) / this.linesAmount
  }

  getDate = value => {
    const date = new Date(value)

    return this.monthsNames[date.getMonth()] + ' ' + date.getDate()
  }

  get yAxisTexts () {
    const diff = (this.maxY - this.minY) / this.linesAmount

    return Array(this.linesAmount + 1).fill(0)
      .map((_, idx) => diff * idx)
  }

  getXAxisTexts = newData => {
    const xDiff = Math.floor(newData.xAxis.length / (this.linesAmount))

    return Array(this.linesAmount + 1).fill(null)
      .map((_, idx) =>
        this.getDate(
          idx === this.linesAmount
            ? newData.xAxis.slice(-1)[0]
            : newData.xAxis[idx * xDiff]
        )
      )
  }
}

export default ChartAxisData
