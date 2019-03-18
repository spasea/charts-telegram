import Coordinates from '../DTO/Coordinates'

class ChartDrawing {
  _DrawingService = null
  _EasingService = null
  _reqQuery = {}
  currentColors = []
  previousColors = []

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

  initialDraw (colors) {
    this.currentColors = [...colors]
    this.previousColors = [...colors]
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

        this.DrawingService.drawALine(startCoordinates, endCoordinates, this.currentColors[axisId])
      })
    })

    // const generate = id => {
    //   const x = this.chartAxis.xAxis[id]
    //   this.DrawingService.drawADot(new Coordinates(x, this.chartAxis.yAxises[0][id]), 2, color)
    // }

    // this.chartAxis.xAxis.forEach((_, idx) => generate(idx))
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
    this.previousColors = [...this.currentColors]
    this.currentColors = [...colors]

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

      // console.log({
      //   start,
      //   end,
      //   pr: this.previousAxis.yAxises[0],
      //   cur: this.chartAxis.yAxises[0]
      // })

      const startX = this.chartAxis.xAxis[id]
      const endX = this.chartAxis.xAxis[id + 1]
      let startY
      this.calculateADynamic(...start, 60, val => {
        startY = val
      })()
      this.calculateADynamic(...end, 60, endY => {
        startY = startY < 0.01 ? -1 : startY
        endY = endY < 0.01 ? -1 : endY

        this.DrawingService.drawALine(new Coordinates(startX, startY), new Coordinates(endX, endY), colors[axisId])
      })()
    }

    return () => {
      this.DrawingService.clearCanvas()

      if (this.chartAxis.yAxises.length < this.previousAxis.yAxises.length) {
        const diff = this.previousAxis.yAxises.length - this.chartAxis.yAxises.length
        const length = this.chartAxis.yAxises[0].length
        this.chartAxis.yAxises.push(...Array(diff).fill(Array(length).fill(null)))
      }

      // console.log({
      //   pr: this.previousAxis.yAxises,
      //   ch: this.chartAxis.yAxises
      // })

      this.chartAxis.yAxises.forEach((axis, idx) =>
        axis.forEach(
          (_, dotId) => generate(dotId, idx)
        ))

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
