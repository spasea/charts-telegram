import Coordinates from '../DTO/Coordinates'

class ChartDrawing {
  _DrawingService = null
  biggestX = 0
  biggestY = 0
  smallestY = 0
  time = 30

  constructor (height, width, options = {}) {
    options = {
      smoothTransition: () => {},
      chartAxis: [],
      xOffset: 4,
      yOffset: 8,
      ...options
    }

    this.height = height
    this.width = width
    this.chartAxis = options.chartAxis
    this.previousAxis = options.chartAxis
    this.xOffset = options.xOffset
    this.yOffset = options.yOffset
    this.smoothTransition = options.smoothTransition
  }

  set DrawingService (service) {
    this._DrawingService = service
  }

  get DrawingService () {
    return this._DrawingService
  }

  scaleX = x => x * (this.width - this.xOffset) / this.biggestX
  scaleY = y => {
    const diff = this.biggestY - this.smallestY

    return (y - this.smallestY + 1) * (this.height - this.yOffset) / diff + this.yOffset - 6
  }

  initialDraw (colors) {
    this.biggestX = this.chartAxis.xAxis.length
    const yArray = this.chartAxis.yAxises.reduce((acc, axis) => [
      ...acc,
      ...axis
    ], [])

    this.biggestY = Math.max(...yArray)
    this.smallestY = Math.min(...yArray)

    this.chartAxis = {
      xAxis: this.chartAxis.xAxis.map((_, idx) => this.scaleX(idx)),
      yAxises: this.chartAxis.yAxises.map(axis => axis.map(this.scaleY))
    }

    this.chartAxis.yAxises.forEach((axis, axisId) => {
      axis.forEach((point, pointIdx) => {
        const nextY = this.chartAxis.yAxises[axisId][pointIdx + 1]

        if (!nextY) {
          return
        }

        const currentX = this.chartAxis.xAxis[pointIdx]
        const nextX = this.chartAxis.xAxis[pointIdx + 1]

        const startCoordinates = new Coordinates(currentX, point)
        const endCoordinates = new Coordinates(nextX, nextY)

        this.DrawingService.drawALine(startCoordinates, endCoordinates, colors[axisId])
      })
    })
  }

  updateData (newAxis, colors) {
    // this.biggestX = Math.max(...newAxis.xAxis)

    this.biggestX = newAxis.xAxis.length
    const yArray = newAxis.yAxises.reduce((acc, axis) => [
      ...acc,
      ...axis
    ], [])

    this.biggestY = Math.max(...yArray)
    this.smallestY = Math.min(...yArray)

    this.previousAxis = {...this.chartAxis}

    this.chartAxis = {
      xAxis: newAxis.xAxis.map((_, idx) => this.scaleX(idx)),
      yAxises: newAxis.yAxises.map(axis => axis.map(this.scaleY))
    }

    const generate = (id, axisId) => {
      const offset = 0
      const start = [
        this.previousAxis.yAxises[axisId] ? this.previousAxis.yAxises[axisId][id] : offset,
        this.chartAxis.yAxises[axisId] ? this.chartAxis.yAxises[axisId][id] : offset
      ]

      const end = [
        this.previousAxis.yAxises[axisId] ? this.previousAxis.yAxises[axisId][id + 1] : offset,
        this.chartAxis.yAxises[axisId] ? this.chartAxis.yAxises[axisId][id + 1] : offset
      ]

      const startX = this.chartAxis.xAxis[id]
      const endX = this.chartAxis.xAxis[id + 1]
      let startY
      this.smoothTransition(...start, this.time, val => {
        startY = val
      })()
      this.smoothTransition(...end, this.time, endY => {
        startY = startY < 0.1 ? -1 : startY
        endY = endY < 0.1 ? -1 : endY

        this.DrawingService.drawALine(new Coordinates(startX, startY), new Coordinates(endX, endY), colors[axisId])
      })()
    }

    return () => {
      if (this.chartAxis.yAxises.length < this.previousAxis.yAxises.length) {
        const diff = this.previousAxis.yAxises.length - this.chartAxis.yAxises.length
        const length = this.chartAxis.yAxises[0].length
        this.chartAxis.yAxises.push(...Array(diff).fill(Array(length).fill(null)))
      }

      this.chartAxis.yAxises.forEach((axis, idx) =>
        axis.forEach(
          (_, dotId) => generate(dotId, idx)
        ))
    }
  }
}

export default ChartDrawing
