import Data from './chart_data'

import ChartBoard from './Components/ChartBoard'
import ChartInfo from './DTO/ChartInfo'
import Dom from './Services/Dom'
import Drawing from './Services/Drawing'
import Easing from './Services/Easing'
import * as serviceWorker from './serviceWorker'
import './styles/index.scss'


const parsed = JSON.parse(Data)

console.log({
  parsed
})


document.addEventListener('DOMContentLoaded', () => {
  parsed.slice(0, 5).forEach((data, idx) => {
    const parentClassName = `.plot-${idx + 1}`
    const canvasRef = document.querySelector(`${parentClassName} .canvas1`)
    const board1 = new ChartBoard(data, Drawing, Dom, {
      mainChartInfo: ChartInfo.execute(400, 600, canvasRef),
      buttonsParent: document.querySelector(`${parentClassName} .buttons`)
    })

    board1.EasingService = Easing.easeInOut
  })
})

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
