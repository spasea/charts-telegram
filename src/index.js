import Data from './chart_data'

import ChartBoard from './ChartBoard'
import * as serviceWorker from './serviceWorker'
import './styles/index.scss'

let currentPlotId = 0

document.addEventListener('DOMContentLoaded', () => {
  const canvasRef = document.getElementById('canvas')
  const plotsContainer = document.getElementsByClassName('plots')[0]
  const plotName = document.getElementsByClassName('plot-name')[0]
  const chart = new ChartBoard(canvasRef, 600, 1300)

  const parsed = JSON.parse(Data)
  // chart.chartData = parsed[0]
  // chart.drawAPlot()

  const draw = id => {
    chart.chartData = parsed[id]
    chart.clearCanvas()
    chart.drawXAxises()
    chart.drawAPlot()

    console.log({
      chart,
      id,
      pars: parsed[id]
    })

    plotName.innerText = currentPlotId + 1
  }

  draw(currentPlotId)

  addButtons(parsed, draw).forEach(button => plotsContainer.appendChild(button))
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
