import Coordinates from '../DTO/Coordinates'

class ChartDrawing {
  _DrawingService = null
  _EasingService = null
  _reqQuery = {}

  constructor (height, width, chartAxis, xOffset = 4, yOffset = 8) {
    this.height = height
    this.width = width
    this.chartAxis = chartAxis
    this.previousAxis = chartAxis
    this.biggestX = 0
    this.biggestY = 0
    this.smallestY = 0
    this.xOffset = xOffset
    this.yOffset = yOffset
  }

  /**
   *
   * @param {Drawing} service
   * @constructor
   */
  set DrawingService (service) {
    this._DrawingService = service
  }

  /**
   *
   * @returns {Drawing}
   * @constructor
   */
  get DrawingService () {
    return this._DrawingService
  }

  set EasingService (service) {
    this._EasingService = service
  }

  get EasingService () {
    return this._EasingService
  }

  scaleX = x => x * (this.width - this.xOffset) / this.biggestX
  scaleY = y => {
    const diff = this.biggestY - this.smallestY

    return (y - this.smallestY + 1) * (this.height - this.yOffset) / diff + this.yOffset - 6
  }

  initialDraw (color) {
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

    this.chartAxis.yAxises.forEach((axis, idx) => axis.forEach((point, pointIdx) => {
      const nextY = axis[pointIdx + 1]

      if (!nextY) {
        return
      }

      const currentX = this.chartAxis.xAxis[pointIdx]
      const nextX = this.chartAxis.xAxis[pointIdx + 1]

      // const startCoordinates = new Coordinates(currentX, point)
      // const endCoordinates = new Coordinates(nextX, nextY)

      // this.DrawingService.drawALine(startCoordinates, endCoordinates)
    }))

    const generate = id => {
      const x = this.chartAxis.xAxis[id]
      this.DrawingService.drawADot(new Coordinates(x, this.chartAxis.yAxises[0][id]), 2, color)
    }

    this.chartAxis.xAxis.forEach((_, idx) => generate(idx))
  }

  updateData (newAxis, color) {
    // this.biggestX = Math.max(...newAxis.xAxis)
    this.biggestX = newAxis.xAxis.length
    const yArray = newAxis.yAxises.reduce((acc, axis) => [
      ...acc,
      ...axis
    ], [])

    this.biggestY = Math.max(...yArray)
    this.smallestY = Math.min(...yArray)

    const previousAxis = {...this.previousAxis}
    this.previousAxis = {...this.chartAxis}

    this.chartAxis = {
      xAxis: newAxis.xAxis.map((_, idx) => this.scaleX(idx)),
      yAxises: newAxis.yAxises.map(axis => axis.map(this.scaleY))
    }

    const generate = id => {
      const prev = this.previousAxis.yAxises[0][id]
      const current = this.chartAxis.yAxises[0][id]
      const x = this.chartAxis.xAxis[id]
      this.calculateADynamic(prev, current, 60, value => {
        this.DrawingService.drawADot(new Coordinates(x, value), 2, color)
      })()
    }

    return () => {
      this.DrawingService.clearCanvas()

      this.chartAxis.xAxis.forEach((_, idx) => generate(idx))

      this.reqAnimate()
    }
  }

  reqAnimate (id = 1) {

    if (id > Object.keys(this._reqQuery).length) {
      return
    }

    const currentFrameMethods = this._reqQuery[id]

    if (id !== 59) {
      this.DrawingService.clearCanvas()
    }
    currentFrameMethods.forEach(dat => dat.meth())

    id += 1

    requestAnimationFrame(() => {
      this.reqAnimate(id)
    })
  }

  calculateADynamic (previous, next, max = 60, cb) {
    const diff = next - previous
    let delta = 1
    let current = 0

    const findCurrentPosition = time => previous + diff * time

    const method = () => {
      current += delta
      const time = current / max

      if (time >= 1) {
        return
      }

      cb(findCurrentPosition(this.EasingService(time)))

      if (!this._reqQuery.hasOwnProperty(current)) {
        this._reqQuery[current] = []
      }

      this._reqQuery[current].push({
        meth: method,
        data: findCurrentPosition(this.EasingService(time))
      })
    }

    return method
  }
}

export default ChartDrawing
