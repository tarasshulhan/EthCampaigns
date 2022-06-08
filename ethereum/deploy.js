const HDWalletProvider = require("@truffle/hdwallet-provider")
const Web3 = require("web3")
const compiledFactory = require("./build/CampaignFactory.json")
console.log(process.env.MNEMONIC, process.env.PROVIDER_URL)
/* to deploy a new instance of the campaign factory contract
enter the wallet mnemonic and eth network url*/
const provider = new HDWalletProvider()
/* wallet mnemonic ,*/
/* network url e.g. infura*/
const web3 = new Web3(provider)

const deploy = async () => {
  const accounts = await web3.eth.getAccounts()

  console.log("Attempting to deploy from account", accounts[0])

  const result = await new web3.eth.Contract(
    JSON.parse(compiledFactory.interface)
  )
    .deploy({ data: compiledFactory.bytecode })
    .send({ gas: "1000000", from: accounts[0] })

  console.log("Contract deployed to", result.options.address)
  provider.engine.stop()
}
deploy()
