class ChartBoard {
  _EasingService = null
  _reqQuery = {}

  constructor (chartData, height, width, options) {
    options = {
      canvasRef: null,
      animationTime: 30,
      ...options
    }

    this.chartData = chartData
    this.time = options.animationTime
  }

  set EasingService (service) {
    this._EasingService = service
  }

  get EasingService () {
    return this._EasingService
  }

  reqAnimate (id = 1) {
    if (id > Object.keys(this._reqQuery).length) {
      return
    }

    const currentFrameMethods = this._reqQuery[id]

    if (id !== (this.time - 1)) {
      this.DrawingService.clearCanvas()
    }
    currentFrameMethods.forEach(dat => dat())

    id += 1

    requestAnimationFrame(() => {
      this.reqAnimate(id)
    })
  }

  smoothTransition (previous, next, max = 60, cb) {
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

      this._reqQuery[current].push(method)
    }

    return method
  }
}

export default ChartBoard
