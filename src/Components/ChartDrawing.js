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
      xOffset: 0,
      yOffset: 8,
      time: 30,
      ...options
    }

    this.height = height
    this.width = width
    this.chartAxis = options.chartAxis
    this.previousAxis = options.chartAxis
    this.xOffset = options.xOffset
    this.yOffset = options.yOffset
    this.time = options.time
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
    // const diff = this.biggestY - this.smallestY
    // return (y - this.smallestY - 2) * (this.height - this.yOffset) / diff + this.yOffset

    return (y - this.smallestY - 2) * (this.height - this.yOffset) / this.biggestY + this.yOffset
  }

  processYAxis (axis) {
    const object = {}
    axis.forEach(item => {
      object[item[0]] = item.slice(1)
    })

    return object
  }

  initialDraw (colors) {
    this.biggestX = this.chartAxis.xAxis.length - 1
    const yAxis = this.processYAxis(this.chartAxis.yAxis)
    const yArray = Object.values(yAxis).reduce((acc, axis) => [
      ...acc,
      ...axis
    ], [])

    this.biggestY = Math.max(...yArray)
    this.smallestY = Math.min(...yArray)

    this.chartAxis = {
      xAxis: this.chartAxis.xAxis.map((_, idx) => this.scaleX(idx)),
      yAxis: {}
    }

    for (let axisId in yAxis) {
      const axis = yAxis[axisId]

      this.chartAxis.yAxis[axisId] = axis.map(this.scaleY)
    }

    for (let axisId in this.chartAxis.yAxis) {
      const axis = this.chartAxis.yAxis[axisId]

      axis.forEach((point, pointIdx) => {
        const nextY = this.chartAxis.yAxis[axisId][pointIdx + 1]

        if (!nextY) {
          return
        }

        const currentX = this.chartAxis.xAxis[pointIdx]
        const nextX = this.chartAxis.xAxis[pointIdx + 1]

        const startCoordinates = new Coordinates(currentX, point)
        const endCoordinates = new Coordinates(nextX, nextY)

        this.DrawingService.drawALine(startCoordinates, endCoordinates, colors[axisId])
      })
    }
  }

  updateData (newAxis, colors) {
    // this.biggestX = Math.max(...newAxis.xAxis)

    this.biggestX = newAxis.xAxis.length - 1
    const yAxis = this.processYAxis(newAxis.yAxis)
    const yArray = Object.values(yAxis).reduce((acc, axis) => [
      ...acc,
      ...axis
    ], [])

    this.biggestY = Math.max(...yArray)
    this.smallestY = Math.min(...yArray)

    this.previousAxis = {...this.chartAxis}

    this.chartAxis = {
      xAxis: newAxis.xAxis.map((_, idx) => this.scaleX(idx)),
      yAxis: {}
    }

    for (let axisId in yAxis) {
      const axis = yAxis[axisId]

      this.chartAxis.yAxis[axisId] = axis.map(this.scaleY)
    }

    const generate = (id, axisId) => {
      const offset = 0
      const start = [
        this.previousAxis.yAxis[axisId] ? this.previousAxis.yAxis[axisId][id] : offset,
        this.chartAxis.yAxis[axisId] ? this.chartAxis.yAxis[axisId][id] : offset
      ]

      const end = [
        this.previousAxis.yAxis[axisId] ? this.previousAxis.yAxis[axisId][id + 1] : offset,
        this.chartAxis.yAxis[axisId] ? this.chartAxis.yAxis[axisId][id + 1] : offset
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
      const currentKeys = Object.keys(this.chartAxis.yAxis)
      const previousKeys = Object.keys(this.previousAxis.yAxis)
      if (currentKeys.length < previousKeys.length) {
        const missingKeys = previousKeys.filter(prevKey => !currentKeys.includes(prevKey))
        const length = Object.values(this.previousAxis.yAxis)[0].length

        missingKeys.forEach(key => {
          this.chartAxis.yAxis[key] = Array(length).fill(null)
        })
      }

      for (let axisId in this.chartAxis.yAxis) {
        const axis = this.chartAxis.yAxis[axisId]

        axis.forEach(
          (_, dotId) => generate(dotId, axisId)
        )
      }
    }
  }
}

export default ChartDrawing
