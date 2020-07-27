import React, { useEffect, useState } from 'react'
import { Paper, Grid, Typography, Table, TableCell, TableRow, Button, CircularProgress, Dialog, DialogContent } from "@material-ui/core"
import { connect } from 'react-redux'
import { getDaiBalance, getEtherBalance, getBrlxUsdRate, getChainlinkBalanceContract, getDaiAllowance, getBrlxBalance, consumerContractAddress } from '../../contracts/api/contracts'
import { withStyles } from '@material-ui/core/styles';
import CurrencyInput from 'react-currency-input'
import { REQUEST_ALLOW_TX, REQUEST_MINT_TOKENS_TX, REQUEST_UPDATE_ORACLE, RESET_STATE } from '../../redux/tokenPay/actions'

const styles = theme => ({
    cellActualBalance:{
        color:  'grey',
        padding:10,
        borderColor: 'grey',
        
    },
    cellEther:{
        color:  'white',
        padding:10,
        border: 'none'
    },
    buttonNetwork: {
        fontSize:12, 
        width: 180, 
        margin: 10,
        textTransform:'none', 
        borderRadius:25,
        color: 'grey',
        borderColor:'#238a23',
        '&:hover': {
          borderColor:'green',
          color:'white'
        },
    },
    buttonMint: {
        fontSize:12, 
        width: 180, 
        margin: 10,
        textTransform:'none', 
        borderRadius:25,
        color: 'grey',
        borderColor:'grey',
        '&:hover': {
          borderColor:'white',
          color:'white'
        },
    },
    buttonBuy: {
        fontSize:12, 
        width: 120, 
        marginBottom: 10,
        textTransform:'none', 
        borderRadius:25,
        color: 'white',
        borderColor:'grey',
        '&:hover': {
          borderColor:'white',
          color:'white'
        },
    },
    blockieUser:{
        width: 60, height: 60, margin: 5, borderRadius: 15
    },
    box:{
        maxWidth: 800, borderRadius: 10, padding: 10, margin: 10, marginLeft: 40, marginRight: 40, backgroundColor: 'rgb(18, 19, 24)'
    },
    userAddressText:{
        wordBreak:'break-all', color:'white'
    },
    input:{
        padding:10, backgroundColor:'grey', borderColor:'grey', borderRadius: 10
    },
  });

const Home = props => {
    const { classes, dispatch, transferReducer } = props
    const { pendingTx, loadingTx, error, completeTx } = transferReducer
    const [daiAmount, setDaiAmount] = useState(0)
    const [userAllowDai, setAllowDai] = useState(0)
    const [brlxAmount, setBrlxAmount] = useState(0)
    const [daiXbrl, setDaiXBrl] = useState(0)
    const [daiBalance, setDaiBalance] = useState(0)
    const [etherBalance, setEtherBalance] = useState(0)
    const [contractLinkBalance, setContractLinkBalance] = useState(0)
    const [loading, setLoading] = useState(true)
    const [userBrlxBalance, setBrlxBalance] = useState(0)

    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getInfo = async() => {
        const daiBalance = await getDaiBalance(props.web3Account.accountAddress)
        setDaiBalance(daiBalance)

        const ethBalance = await getEtherBalance(props.web3Account.accountAddress)
        setEtherBalance(ethBalance)

        const brlxBalance = await getBrlxBalance(props.web3Account.accountAddress)
        setBrlxBalance(brlxBalance)

        const allowDai = await getDaiAllowance(props.web3Account.accountAddress)
        setAllowDai(allowDai)

        const price = await getBrlxUsdRate()
        setDaiXBrl(price)

        const chainlinkbalance = await getChainlinkBalanceContract()
        setContractLinkBalance(chainlinkbalance)

        setLoading(false)
    }
    
    React.useEffect(() => {
        getInfo()
    },[])

    const getRate = async () => {
        try{
            const interval = setInterval(async() => {
                getInfo()
            }, 10000);
            return () => clearInterval(interval);
        }catch(err){

        }
    }
    useEffect(() => {
        getRate()
      }, []);

    const setAndCalculateAmount = (dai) => {
        const convertFullAmount = (dai*parseInt(daiXbrl)/100).toFixed(2)
        setDaiAmount(dai)
        setBrlxAmount(convertFullAmount)

        console.log('---- CONVERT DAI -> BRLX -----')
        console.log('DAI AMOUNT: ', dai)
        console.log('RATE DAI -> BRL: ', parseInt(daiXbrl)/100)
        console.log('CONVERT AMOUNT DAI -> BRLX: ', convertFullAmount )
        console.log('-----------------')

    }

    const updateOraclePrice = async() => {
        dispatch({ type: REQUEST_UPDATE_ORACLE })
    }

    const allowTransfer = async() => {
        const rawamount = formatToRaw(daiAmount)
        dispatch({ type: REQUEST_ALLOW_TX, payload: { amount: rawamount} })
    }

    const mintBrxTokens = async() => {
        if(!isAllowAmount){
            alert('Amount not authorized')
            return
        }
        console.log("Dai for Mint", daiAmount*100)
        console.log("Send Mint: ", parseInt(daiAmount*100))
        dispatch({ type: REQUEST_MINT_TOKENS_TX, payload: { amount: `${parseInt(daiAmount*100)}` }})
    }

    const reset = async() => {
        dispatch({ type: RESET_STATE })

    }

    const formatToRaw = value => {
        const fixed = value.toFixed(2)
        const raw = addDecimals(parseInt(daiAmount*100))
        console.log(fixed, raw)
        return raw
    }

    const removeDecimals = value => {
        if (value === 0 || value === '0') return 0
        const withoutDecimals = value.slice(0, -16)
      
        return parseInt(withoutDecimals)
    }

    const addDecimals = value => `${value}0000000000000000`

    const isAllowAmount = (daiAmount*100<=removeDecimals(userAllowDai))


    return(
        <Grid container direction="column" alignContent="center" justify="center">

          <Paper className={classes.box}>
            <Grid container alignItems="center" alignContent="center" justify="center">
                <Button align="center" variant="outlined" className={classes.buttonNetwork}>
                    Ethereum Ropsten Network
                </Button>
            </Grid>
            <Grid container direction="column" alignContent="center" justify="center" alignItems="center">
                <Grid item>
                  <Typography align="center" className={classes.userAddressText}>{props.web3Account.accountAddress}</Typography>
                </Grid>
            </Grid>
          </Paper>
          

            <Paper className={classes.box}>
            <Typography style={{color:'white', marginTop:5}} align="center">Balance</Typography>
            <Grid container alignItems="center" alignContent="center" justify="center">
            <Table>
                    <TableRow>
                        <TableCell className={classes.cellEther} component="th" scope="row">
                            Ethereum (ETH)
                        </TableCell>
                        <TableCell className={classes.cellEther} align="right">{etherBalance}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className={classes.cellEther} component="th" scope="row">
                            DAI (DAI)
                        </TableCell>
                        <TableCell className={classes.cellEther} align="right">{daiBalance}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className={classes.cellEther} component="th" scope="row">
                            BRLX (BRLX)
                        </TableCell>
                        <TableCell className={classes.cellEther} align="right">{userBrlxBalance}</TableCell>
                    </TableRow>
            </Table>
            </Grid>
            </Paper>

            <Paper className={classes.box}>
            <Grid container direction="column" alignItems="center" alignContent="center" justify="center">
                <Typography style={{color:'white', marginTop:5}} align="center">DAI/BRLX Oracle</Typography>
                <Grid item alignContent="center" justify="center">
                    <Typography style={{color:'white', marginTop:5, fontSize: 16}} align="center">{consumerContractAddress}</Typography>
                </Grid>
                <Grid item alignContent="center" justify="center">
                    <Typography style={{color:'white', marginTop:5}} align="center">{contractLinkBalance} LINK</Typography>
                </Grid>
                <Button onClick={() => updateOraclePrice()} align="center" variant="outlined" className={classes.buttonMint}>
                    Update DAI/BRLX Oracle
                </Button>
                <Table>
                <TableRow>
                        <TableCell className={classes.cellEther} component="th" scope="row">
                        DAI/BRLX
                        </TableCell>
                        <TableCell className={classes.cellEther} align="right">{(parseInt(daiXbrl)/100).toFixed(2)}</TableCell>
                    </TableRow>
                </Table>
          </Grid>
          </Paper>


            <Paper className={classes.box}>
            <Grid container direction="column" alignItems="center" alignContent="center" justify="center">
                <p style={{color:'grey'}} align="center">Amount of DAI you want to lock</p>
                <CurrencyInput
                    className={classes.input}
                    precision="2"
                    value={daiAmount}
                    onChange={(event, value) => setAndCalculateAmount(value)}
                />
                <p style={{color:'grey'}} align="center">Amount of BRLX that you will receive</p>
                <CurrencyInput
                    className={classes.input}
                    precision="2"
                    value={brlxAmount}
                />
            </Grid>
            <Grid container direction="column" alignItems="center" alignContent="center" justify="center">
                <p style={{color:'grey', marginTop: 5}}>Authorized Spend Amount: {(removeDecimals(userAllowDai)/100).toFixed(2)} DAI </p>
                {!isAllowAmount && (
                    <Button variant="contained" style={{margin:10}} onClick={() => allowTransfer()}>Authorize Amount</Button>
                )}
                <Button onClick={() => mintBrxTokens()} align="center" variant="outlined" className={classes.buttonMint}>
                    Mint BRLX
                </Button>
            </Grid>
          </Paper>

        <TxActions
        visible={loadingTx}
        pendingTx={pendingTx} 
        loadingTx={loadingTx} 
        errorTx={error}
        completeTx={completeTx}
        confirm={reset}
        />
        </Grid>
    )
}

const mapStateToProps = ({web3Account, transferReducer}) => ({ web3Account, transferReducer })

const TxActions = ({visible, confirm, pendingTx, loadingTx, errorTx, completeTx}) => {
    return(
        <Dialog open={visible}>
        <DialogContent>
        {pendingTx && (
            <CircularProgress style={{color: 'black'}}/>
        )}
        {errorTx && (
            <Grid container direction="column" alignItems="center" alignContent="center" justify="center">
            <p>Transaction Error</p>
            <Button onClick={() => confirm()}>OK</Button>
            </Grid>
        )}
        {completeTx && (
            <Grid container direction="column" alignItems="center" alignContent="center" justify="center">
            <p>Transaction Complete</p>
            <Button variant="contained" onClick={() => confirm()}>OK</Button>
            </Grid>
        )}
        </DialogContent>
        </Dialog>
    )
}


export default connect(mapStateToProps)(withStyles(styles)(Home))