import getWeb3 from "../utils/getWeb3"
import ERC20_ABI from "../abi/IERC20ABI.json"
import CONSUMER_ABI from "../abi/CONSUMERABI.json"
import currency from 'currency.js'

const daiInfo =     {
  symbol: 'DAI',
  name: 'Dai(multi colateral) Stablecoin',
  address: '0xc2118d4d90b274016cb7a54c03ef52e6c537d957',
  decimals: '18',
  divider: 1000000000000000000
}



export const consumerContractAddress = "0x58C912DBd72041bBC6035d7bb294F6f2E33e348e"

export const brlxaddress = '0x07E8d7526429d0776f5B20791B2b4Da9F6149FeB'

export const linkaddress = '0x20fe562d797a42dcb3399062ae9546cd06f63280'

export const getBrlxUsdRate = () => new Promise(async (resolve, reject) => {
  try {
    const web3 = await getWeb3()
    const contract = new web3.eth.Contract(CONSUMER_ABI, consumerContractAddress)
    const balance = await contract.methods.currentPrice().call()
    resolve(balance)
  } catch (err) {
    console.log(err)
    reject(err)
  }
})

export const generateBrlxUsdContract = () => new Promise(async (resolve, reject) => {
  try {
    const web3 = await getWeb3()
    const contract = new web3.eth.Contract(CONSUMER_ABI, consumerContractAddress)
    resolve(contract)
  } catch (err) {
    console.log(err)
    reject(err)
  }
})

export const generateTokenBrlx = () => new Promise(async (resolve, reject) => {
  try {
    const web3 = await getWeb3()
    const contract = new web3.eth.Contract(ERC20_ABI, brlxaddress)
    resolve(contract)
  } catch (err) {
    console.log(err)
    reject(err)
  }
})


export const getPaymentsHistory = (address) => new Promise(async(resolve, reject) => {
  try{
      const contract = await generateBrlxUsdContract()
      const history = await contract.methods.getVaultsId(address).call()
      resolve(history)
  }catch(err){
      console.log(err)
      reject(err)
  }
})

export const generateDaiContract = () => new Promise(async (resolve, reject) => {
  try {
    const web3 = await getWeb3()
    const contract = new web3.eth.Contract(ERC20_ABI, daiInfo.address)
    resolve(contract)
  } catch (err) {
    console.log(err)
    reject(err)
  }
})

export const getErc20Balance = (tokenAddress, balanceAddress) => new Promise(async (resolve, reject) => {
    try {
      const web3 = await getWeb3()
      const contract = new web3.eth.Contract(ERC20_ABI, tokenAddress)
      const balance = await contract.methods.balanceOf(balanceAddress).call()
      resolve(balance)
    } catch (err) {
      console.log(err)
      reject(err)
    }
})


export const getDaiAllowance = (owner) => new Promise(async (resolve, reject) => {
  try {
    const web3 = await getWeb3()
    const contract = new web3.eth.Contract(ERC20_ABI, daiInfo.address)
    const balance = await contract.methods.allowance(owner, consumerContractAddress).call()
    resolve(balance)
  } catch (err) {
    console.log(err)
    reject(err)
  }
})

export const getBrlxAllowance = (owner) => new Promise(async (resolve, reject) => {
  try {
    const web3 = await getWeb3()
    const contract = new web3.eth.Contract(ERC20_ABI, brlxaddress)
    const balance = await contract.methods.allowance(owner, consumerContractAddress).call()
    resolve(balance)
  } catch (err) {
    console.log(err)
    reject(err)
  }
})



export const getChainlinkBalanceContract = () =>  new Promise(async (resolve, reject) => {
  try{
    const balance = await getErc20Balance(linkaddress, consumerContractAddress)
    const formatBalance =  currency(balance).divide(daiInfo.divider).format()
    resolve(formatBalance)
  }catch(err){
    reject(err)
  }
})

export const getBrlxBalance = (balanceAddress) =>  new Promise(async (resolve, reject) => {
  try{
    const balance = await getErc20Balance(brlxaddress, balanceAddress)
    const formatBalance =  currency(balance).divide(daiInfo.divider).format()
    resolve(formatBalance)
  }catch(err){
    reject(err)
  }
})


export const getDaiBalance = (balanceAddress) =>  new Promise(async (resolve, reject) => {
  try{
    const balance = await getErc20Balance(daiInfo.address, balanceAddress)
    const formatBalance =  currency(balance).divide(daiInfo.divider).format()
    resolve(formatBalance)
  }catch(err){
    reject(err)
  }
})


export const getEtherBalance = (balanceAddress) => new Promise(async(resolve, reject) => {
  try{
    const web3 = await getWeb3()
    const weiBalance = await web3.eth.getBalance(balanceAddress)
    const balance = await web3.utils.fromWei(weiBalance, 'ether')
    resolve(balance)
  }catch(err){
    console.log(err)
    reject(err)
  }
}) 



