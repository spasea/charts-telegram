import Data from './chart_data'

import ChartBoard from './Components/ChartBoard'
import ChartInfo from './DTO/ChartInfo'
import RangeInfo from './DTO/RangeInfo'
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
  parsed.slice(0, 1).forEach((data, idx) => {
    const parentClassName = `.plot-${idx + 1}`
    const canvasRef1 = document.querySelector(`${parentClassName} .canvas1`)
    const canvasRef2 = document.querySelector(`${parentClassName} .canvas2`)
    const rangesRef = document.querySelector(`${parentClassName} .range`)

    const width = 1000

    const board1 = new ChartBoard(data, Drawing, Dom, {
      mainChartInfo: ChartInfo.execute(310, width, canvasRef1),
      previewChartInfo: ChartInfo.execute(40, width, canvasRef2),
      rangeInfo: RangeInfo.execute(40, width, rangesRef),
      buttonsParent: document.querySelector(`${parentClassName} .buttons`)
    })

    board1.EasingService = Easing.easeInOut
    board1.initRange()
  })
})

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
