import ChartAxis from '../DTO/ChartAxis'
import ChartInfo from '../DTO/ChartInfo'
import Drawing from '../Services/Drawing'
import ChartDrawing from './ChartDrawing'

class ChartBoard {
  _EasingService = null
  _DrawingService = null
  _reqQuery = {}

  constructor (chartData, drawingService, options) {
    options = {
      mainChartInfo: ChartInfo.execute(400, 600, null),
      previewChartInfo: ChartInfo.execute(40, 600, null),
      animationTime: 30,
      ...options
    }

    this.chartData = chartData
    this._DrawingService = drawingService
    this.time = options.animationTime
    this.mainChartInfo = options.mainChartInfo

    const amount = 20

    this.mainChartInfo.chartDrawing = new ChartDrawing(this.mainChartInfo.height, this.mainChartInfo.width, {
      smoothTransition: this.smoothTransition,
      chartAxis: ChartAxis.execute(
        this.chartData.columns[0].slice(1, amount),
        this.chartData.columns.slice(1).map(column => column.slice(0, amount))
      )
    })
    this.mainChartInfo.chartDrawing.DrawingService = new Drawing(this.mainChartInfo.canvasRef, this.mainChartInfo.width, this.mainChartInfo.height)
    this.mainChartInfo.chartDrawing.initialDraw(this.chartData.colors)

    setTimeout(() => {
      this.mainChartInfo.chartDrawing.updateData(ChartAxis.execute(
        this.chartData.columns[0].slice(1, amount),
        [
          this.chartData.columns[1].slice(0, amount)
        ]
      ), this.chartData.colors)()

      this.reqAnimate()

      setTimeout(() => {
        this.mainChartInfo.chartDrawing.updateData(ChartAxis.execute(
          this.chartData.columns[0].slice(1, amount),
          [
            this.chartData.columns[2].slice(0, amount)
          ]
        ), this.chartData.colors)()

        this.reqAnimate()
      }, 2000)
    }, 2000)

    // this.previewChartInfo = options.previewChartInfo
    // this.previewChartInfo.chartDrawing = new this._DrawingService(this.previewChartInfo.height, this.previewChartInfo.width, {
    //   smoothTransition: this.smoothTransition
    // })
    // this.previewChartInfo.chartDrawing.DrawingService = new Drawing(this.previewChartInfo.canvasRef, this.previewChartInfo.width, this.previewChartInfo.height)
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
      this.mainChartInfo.chartDrawing.DrawingService.clearCanvas()
      // this.previewChartInfo.chartDrawing.DrawingService.DrawingService.clearCanvas()
    }
    currentFrameMethods.forEach(method => method())

    id += 1

    requestAnimationFrame(() => {
      this.reqAnimate(id)
    })
  }

  smoothTransition = (previous, next, max = 60, cb) => {
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
