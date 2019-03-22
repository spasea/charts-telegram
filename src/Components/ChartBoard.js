import Button from '../DTO/Button'
import ChartAxis from '../DTO/ChartAxis'
import ChartInfo from '../DTO/ChartInfo'
import RangeInfo from '../DTO/RangeInfo'
import Drawing from '../Services/Drawing'
import Buttons from './Buttons'
import Range from './Range'
import ChartDrawing from './ChartDrawing'

class ChartBoard {
  _EasingService = null
  _DrawingService = null
  _DomService = null
  _reqQuery = {}
  range = []
  selectedCharts = []

  constructor (chartData, drawingService, domService, options) {
    options = {
      mainChartInfo: ChartInfo.execute(400, 600, null),
      previewChartInfo: ChartInfo.execute(40, 600, null),
      rangeInfo: RangeInfo.execute(40, 600, null),
      rangeValues: [0, 20],
      buttonsParent: null,
      animationTime: 30,
      ...options
    }

    this.chartData = chartData
    this._DrawingService = drawingService
    this._DomService = domService
    this.time = options.animationTime
    this.mainChartInfo = options.mainChartInfo
    this.previewChartInfo = options.previewChartInfo
    this.rangeInfo = options.rangeInfo
    this.buttonsParent = options.buttonsParent
    this.range = options.rangeValues

    this.initCharts()
    this.initButtons()
    // this.initRange()
  }

  set EasingService (service) {
    this._EasingService = service
  }

  get EasingService () {
    return this._EasingService
  }

  initRange () {
    const maxValue = this.chartData.columns[0].length - 1
    // const maxValue = 10
    const range = new Range(this.rangeInfo.height, this.rangeInfo.width, maxValue, 0, {
      rangesRef: this.rangeInfo.rangesRef,
      range: [2, 12],
    })

    range.DomService = this._DomService

    range.componentUpdate = values => {
      // return

      this.range = [...values.map(Math.round)]

      this.mainChartInfo.chartDrawing.updateData(this.getChartsData(this.range), this.chartData.colors)()

      this.reqAnimate(1, () => {
        this.mainChartInfo.chartDrawing.DrawingService.clearCanvas()
      })
    }

    range.renders()
  }

  initCharts () {
    this.mainChartInfo.chartDrawing = new ChartDrawing(this.mainChartInfo.height, this.mainChartInfo.width, {
      smoothTransition: this.smoothTransition,
      chartAxis: this.getChartsData(this.range, () => true)
    })
    this.mainChartInfo.chartDrawing.DrawingService = new Drawing(this.mainChartInfo.canvasRef, this.mainChartInfo.width, this.mainChartInfo.height)
    this.mainChartInfo.chartDrawing.initialDraw(this.chartData.colors)

    this.previewChartInfo.chartDrawing = new ChartDrawing(this.previewChartInfo.height, this.previewChartInfo.width, {
      smoothTransition: this.smoothTransition,
      chartAxis: this.getChartsData([0, 1000000], () => true)
    })
    this.previewChartInfo.chartDrawing.DrawingService = new Drawing(this.previewChartInfo.canvasRef, this.previewChartInfo.width, this.previewChartInfo.height)
    this.previewChartInfo.chartDrawing.initialDraw(this.chartData.colors)
  }

  initButtons () {
    let checkedButtons = Object.keys(this.chartData.names)
    const buttonsArray = []

    for (let key in this.chartData.names) {
      const name = this.chartData.names[key]

      buttonsArray.push(
        Button.execute(name, key, this.chartData.colors[key])
      )
    }

    const btns = new Buttons(buttonsArray, this.buttonsParent, checkedButtons)
    this.selectedCharts = [...checkedButtons]
    btns.DomService = this._DomService

    const updatePlot = checkedIds => {
      this.selectedCharts = [...checkedIds]

      this.mainChartInfo.chartDrawing.updateData(this.getChartsData(this.range), this.chartData.colors)()
      this.previewChartInfo.chartDrawing.updateData(this.getChartsData(), this.chartData.colors)()

      this.reqAnimate(1, () => {
        this.mainChartInfo.chartDrawing.DrawingService.clearCanvas()
        this.previewChartInfo.chartDrawing.DrawingService.clearCanvas()
      })
    }

    btns.componentUpdate = id => {
      checkedButtons = checkedButtons.includes(id)
        ? checkedButtons.filter(buttonId => buttonId !== id)
        : [
          ...checkedButtons,
          id
        ]

      btns.buttonsSelected = checkedButtons

      updatePlot(checkedButtons)
    }

    btns.renders()
  }

  getChartsData (range = [0, 1000000], filterCb = column => this.selectedCharts.includes(column[0])) {
    return ChartAxis.execute(
      this.chartData.columns[0].slice(1).slice(...range),
      this.chartData.columns.slice(1)
        .filter(filterCb)
        .map(column => ([
          column[0],
          ...column.slice(1).slice(...range)
        ]))
    )
  }

  reqAnimate (id = 1, clearCanvas = () => {}, stopAnimation = false) {
    if (id > Object.keys(this._reqQuery).length || stopAnimation) {
      return
    }

    const currentFrameMethods = this._reqQuery[id]

    if (id !== (this.time - 1)) {
      clearCanvas()
    }
    currentFrameMethods.forEach(method => method())

    id += 1

    requestAnimationFrame(() => {
      this.reqAnimate(id, clearCanvas, stopAnimation)
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
