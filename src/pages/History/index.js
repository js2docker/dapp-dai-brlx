import React, { useState, useEffect } from 'react'
import { Grid, Typography, Button, CircularProgress, Dialog, DialogContent } from "@material-ui/core"
import { connect } from 'react-redux'
import { getPaymentsHistory } from '../../contracts/api/contracts'
import { getDaiBalance, getBrlxAllowance } from '../../contracts/api/contracts'
import { REQUEST_WITHDRAWN_DAI, REQUEST_ALLOW_WITHDRAWN, RESET_STATE } from '../../redux/tokenPay/actions'

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    buttonAsset: {
      fontSize:12, 
      width: 220,
      margin:10, 
      marginLeft: 15,
      marginRight: 15,
      textTransform:'none', 
      borderRadius:25,
      color: 'grey',
      borderColor:'grey',
      '&:hover': {
        borderColor:'grey',
        color:'white'
      },
    },
})

const History = props => {
    const { classes, dispatch, transferReducer } = props
    const [history, setHistory] = React.useState([])
    const [loading, setLoading] = React.useState(true)
    const [userAllowBrlx, setAllowBrlx] = useState(0)
    const [daiBalance, setDaiBalance] = useState(0)
    const { pendingTx, loadingTx, error, completeTx } = transferReducer

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getHistory = async() => {
        let history = await getPaymentsHistory(props.web3Account.accountAddress)
        setLoading(false)
        setHistory(history)
        console.log(history)
    }

    React.useEffect(() => {
        getHistory()
    },[])



    const getInfo = async() => {
        const daiBalance = await getDaiBalance(props.web3Account.accountAddress)
        setDaiBalance(daiBalance)

        const allowBrlx = await getBrlxAllowance(props.web3Account.accountAddress)
        setAllowBrlx(allowBrlx)

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

    const removeDecimals = value => {
        if (value === 0 || value === '0') return 0
        const withoutDecimals = value.slice(0, -16)
      
        return parseInt(withoutDecimals)
    }

    useEffect(() => {
        getRate()
      }, []);


    const allowTransfer = (amount) => {
        console.log('Allow: ', amount)
        dispatch({ type: REQUEST_ALLOW_WITHDRAWN, payload: { amount }})
    }

    const withdrawnDai = (Id) => {
        dispatch({ type: REQUEST_WITHDRAWN_DAI, payload: { vaultId: Id }})
    }


    const reset = async() => {
        getHistory()
        dispatch({ type: RESET_STATE })

    }

    return(
        <Grid container direction="row" alignItems="center" style={{marginTop:5}} alignContent="center" justify="center">
              {loading ? <CircularProgress style={{color:'grey', marginTop: 30}}/> :
              history.map((x) => {
                  console.log(history)
                  const isAllowAmount = (removeDecimals(x.amountLockedDai)<=removeDecimals(userAllowBrlx))
                    console.log(x.amountLockedDai, userAllowBrlx)
                    console.log(removeDecimals(x.amountLockedDai), removeDecimals(userAllowBrlx))
                  return(
                    <Grid item style={{margin:5, padding:10, backgroundColor: 'rgb(18, 19, 24)', width: 350, heigth: 500, padding: 15}}>
                    <Grid container  direction="row"   justify="space-between">
                        <Grid item >
                        <Typography style={{color:'white', fontSize:12}}>DAI Locked: </Typography>
                        <Typography style={{color:'grey'}}>{removeDecimals(x.amountLockedDai)/100}</Typography>
                        </Grid>
                        <Grid item>                        
                        <Typography style={{color:'white', fontSize:12}}>BRLX Minted</Typography>
                        <Typography style={{color:'grey'}}>{removeDecimals(x.amountBrlxMint)/100}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container direction="row"   justify="space-between">
                        <Grid item>
                        <Typography style={{color:'white', fontSize:12}}>Exchange Rate</Typography>
                        <Typography style={{color:'grey'}}>{x.priceBrlxUsd/100}</Typography>
                        </Grid>
                        <Grid item>                        
                        <Typography style={{color:'white', fontSize:12}}>Status</Typography>
                        <Typography style={{color:'grey'}}>
                        {x.status == '1' && "Minted"}
                        {x.status == '2' && "Closed"}
                        </Typography>
                        </Grid>
                    </Grid>
                        {x.status == '1' && (
                            <>
                            <Grid container direction="column" alignItems="center" alignContent="center" justify="center">
                                <p style={{color:'grey', marginTop: 5}}>Authorized Spend Amount: {(removeDecimals(userAllowBrlx)/100).toFixed(2)} DAI </p>
                                {!isAllowAmount && (
                                    <Button variant="contained" style={{margin:10}} onClick={() => allowTransfer(x.amountBrlxMint)}>Authorize Amount</Button>
                                )}
                                <Button variant="contained" onClick={() => withdrawnDai(parseInt(x.id))} align="center" variant="outlined" className={classes.buttonAsset}>
                                    Recover DAI
                                </Button>
                            </Grid>
                            </>
                        )}
                    </Grid>
                  )
              })
              }

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


const mapStateToProps = ({web3Account, transferReducer}) => ({ web3Account, transferReducer })


export default connect(mapStateToProps)(withStyles(styles)(History))