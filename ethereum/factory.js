import web3 from "./web3"
import CampaignFactory from "./build/CampaignFactory.json"

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  //deployed contract address
  "0xBDa369D85732Db4b42b0d04FA5c194460bE39dCC"
)

export default instance
