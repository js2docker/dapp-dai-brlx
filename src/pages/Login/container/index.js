import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import {
  Grid,
  Button,
  Typography,
  Divider,
  CircularProgress
} from '@material-ui/core'
import logo from '../../../assets/img/batch-logo.png'
import styles from './styles'
import boxPayImg from '../../../assets/img/connection.png'
import boxBuyImg from '../../../assets/img/digital-wallet.png'


const LoginContainer = props => {
    const { classes, web3Account, requestFetchWeb3 } = props
    const { error, loading } = web3Account
    return (
      <>
        <Grid container className={classes.mainDiv}>
          <Grid
            container
            className={classes.box}
            justify="center"
            alignContent="center"
            direction="column"
          >
            <Grid container justify="center" direction="column" alignContent="center">
              <p style={{fontSize: 34}} align="center">>BRLX - REAL STABLE COIN</p>
              <Typography variant="h6" align="center">Mint BRLX Tokens using DAI and Chainlink oracle USD/BRL</Typography>
            </Grid>
            <Divider variant="middle" />
            {(error === 'noWeb3') && (
              <Grid container justify="center" alignContent="center" alignItems="center" style={{ padding: 10 }}>
                <Grid item className={classes.boxError}>
                  <Typography align="center" style={{ fontSize: 12, color: '#b22f2f' }}>Not Detected any Ethereum Provider</Typography>
                </Grid>
              </Grid>
            )}
            {(error === 'notAuthorize') && (
              <Grid container justify="center" alignContent="center" alignItems="center" style={{ padding: 10 }}>
                <Grid item className={classes.boxError}>
                  <Typography align="center" style={{ fontSize: 12, color: '#b22f2f' }}>You not authorize to connect with your Ethereum Wallet.<span onClick={this.loadWallet} style={{ color: 'blue' }}>Try Again</span></Typography>
                </Grid>
              </Grid>
            )}
     
            <Grid style={{ paddingTop: 10 }} item>
              <Grid container justify="center" alignContent="center">
              <Button
                  onClick={() => requestFetchWeb3()}
                  className={classes.buttonConfirm}
                  align="center"
                  variant="contained"
                >{loading ?
                  <CircularProgress size={22} style={{color:'grey'}} />
                :
                  "Login with a Ethereum Wallet"
                }
                </Button>
              </Grid>
            </Grid>
  
          </Grid>
        </Grid>

        <Grid container direction="column" style={{backgroundColor:'black', padding: 20}} justify="center" alignContent="center" alignItems="center">
        <a  style={{textDecoration: 'none'}} href="https://github.com/senarma/batch-20" target="_blank" rel="noopener noreferrer">
        <Typography style={{color:'grey', textDecoration: 'none'}}>Github</Typography>
        </a>
        </Grid>
        </>
      )
}

export default withStyles(styles, { withTheme: true })(LoginContainer)
