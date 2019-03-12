import Data from './chart_data'

import ChartBoard from './ChartBoard'
import Buttons from './Components/Buttons'
import Button from './DTO/Button'
import Dom from './Services/Dom'
import * as serviceWorker from './serviceWorker'
import './styles/index.scss'

let currentPlotId = 0

document.addEventListener('DOMContentLoaded', () => {
  const buttonsDiv = document.querySelector('.buttons')
  let checkedButtons = []
  const btns = new Buttons([
    Button.execute('Name here', 1, '#f00'),
    Button.execute('Name here 2', 2, '#ff0'),
  ], buttonsDiv, checkedButtons)

  btns.addButtonsHandler(id => {
    checkedButtons = checkedButtons.includes(id)
      ? checkedButtons.filter(buttonId => buttonId !== id)
      : [
        ...checkedButtons,
        id
      ]

    btns.buttonsSelected = checkedButtons
  })

  btns.DomService = Dom
  btns.insertButtons()

  return

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

  chart.drawALine([100, 420], [200, 400])
  // chart.drawALine([200, 230], [300, 230])
  // chart.drawALine([300, 300], [400, 300])

  setTimeout(() => {
    chart.transition(data => {
      chart.clearCanvas()
      chart.drawALine([100, data + 20], [200, data])
    }, 400, 100)
  }, 1000)

  // setTimeout(() => {
  //   chart.transition(data => {
  //     chart.clearCanvas()
  //     chart.drawALine([300, 400], [400, data])
  //   }, 100, 400)
  // }, 3000)

  // draw(currentPlotId)

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
