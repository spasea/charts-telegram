import Data from './chart_data'

import ChartBoard from './ChartBoard'
import Buttons from './Components/Buttons'
import Button from './DTO/Button'
import ChartAxis from './DTO/ChartAxis'
import Dom from './Services/Dom'
import ChartDrawing from './Components/ChartDrawing'
import Drawing from './Services/Drawing'
import Easing from './Services/Easing'
import * as serviceWorker from './serviceWorker'
import './styles/index.scss'

let currentPlotId = 0

const initPlot = (height = 600, width = 1000, canvasRef) => {
  const drawingServ = new Drawing(canvasRef, width, height)

  const parsed = JSON.parse(Data)

  const amount = 100

  const chartb = new ChartDrawing(height, width, ChartAxis.execute(
    parsed[0].columns[0].slice(1, amount + 1),
    [
      parsed[0].columns[1].slice(1, amount + 1),
      parsed[0].columns[2].slice(1, amount + 1),
    ]
  ))

  chartb.EasingService = Easing.easeInOut
  chartb.DrawingService = drawingServ

  drawingServ.clearCanvas()

  chartb.initialDraw(parsed[0].colors.y0)

  console.log({
    parsed,
    chartb
  })

  let cur = 0

  const anim = () => {
    cur = cur >= 4 ? 0 : cur + 1

    chartb.updateData(ChartAxis.execute(
      parsed[cur].columns[0].slice(1, amount + 1),
      [
        parsed[cur].columns[1].slice(1, amount + 1),
        parsed[cur].columns[2].slice(1, amount + 1),
      ]
    ), parsed[cur].colors.y0)()
  }

  // setTimeout(anim, 1500)

  setInterval(anim, 2000)
}

document.addEventListener('DOMContentLoaded', () => {
  const buttonsDiv = document.querySelector('.buttons')
  let checkedButtons = []
  const btns = new Buttons([
    Button.execute('Name here', 1, '#f00'),
    Button.execute('Name here 2', 2, '#ff0'),
  ], buttonsDiv, checkedButtons)

  btns.componentUpdate = id => {
    checkedButtons = checkedButtons.includes(id)
      ? checkedButtons.filter(buttonId => buttonId !== id)
      : [
        ...checkedButtons,
        id
      ]

    btns.buttonsSelected = checkedButtons
  }

  btns.DomService = Dom
  btns.renders()

  initPlot(600, 1000, document.getElementById('canvas1'))
  initPlot(70, 1000, document.getElementById('canvas2'))


  // const canvasRef = document.getElementById('canvas')
  // const plotsContainer = document.getElementsByClassName('plots')[0]
  // const plotName = document.getElementsByClassName('plot-name')[0]
  // const chart = new ChartBoard(canvasRef, 600, 1300)
  //
  //
  // // chart.chartData = parsed[0]
  // // chart.drawAPlot()
  //
  // const draw = id => {
  //   chart.chartData = parsed[id]
  //   chart.clearCanvas()
  //   chart.drawXAxises()
  //   chart.drawAPlot()
  //
  //   console.log({
  //     chart,
  //     id,
  //     pars: parsed[id]
  //   })
  //
  //   plotName.innerText = currentPlotId + 1
  // }
  //
  // chart.drawALine([100, 420], [200, 400])
  // // chart.drawALine([200, 230], [300, 230])
  // // chart.drawALine([300, 300], [400, 300])
  //
  // setTimeout(() => {
  //   chart.transition(data => {
  //     chart.clearCanvas()
  //     chart.drawALine([100, data + 20], [200, data])
  //   }, 400, 100)
  // }, 1000)
  //
  // // setTimeout(() => {
  // //   chart.transition(data => {
  // //     chart.clearCanvas()
  // //     chart.drawALine([300, 400], [400, data])
  // //   }, 100, 400)
  // // }, 3000)
  //
  // // draw(currentPlotId)
  //
  // addButtons(parsed, draw).forEach(button => plotsContainer.appendChild(button))
})

const changePlotId = (id, callback) => {
  currentPlotId = id
  callback(id)
}

const addButtons = (data, callback) => data.map((plot, idx) => {
  const button = document.createElement('button')
  button.addEventListener('click', () => changePlotId(idx, callback))
  button.innerText = `Plot ${idx + 1}`
  return button
})

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
