import Breakdown from "./details/Breakdown"
import DetailBuySell from "./details/DetailBuySell"
import LineChart from "./details/LineChart"
import './Details.scss'
const Details = () => {
  return (
    <div className='details'>
      <LineChart />
      <Breakdown />
      <DetailBuySell />
    </div>
  )
}

export default Details

// last price                                   marketcap
// price change %                       outstanding shares
// 52week high                            avg daily volume
// 52week low                              earnings date

