import React from 'react'
import { AppBar, Tabs, Tab, Grid, Button } from "@material-ui/core"
import logo from '../../assets/img/batch-logo.png'
import Payment from '../Payment'
import Home from '../Home'
import History from '../History'


const Main = props => {
    const [pageId, setPageId] = React.useState(0)

    const handleChange = (event, newValue) => setPageId(newValue)

    const backToHome = () => setPageId(0)
 
    return(
        <>
        <AppBar position="static">
            <Grid container direction="column" style={{backgroundColor:'black'}} align="center" alignContent="center" justify="center" alignItems="center"> 
            <p style={{marginTop: 10, fontSize: 36}}>BRLX - Stable</p>
            <Tabs TabIndicatorProps={{style: {background:'grey'}}} value={pageId} onChange={handleChange}>
                <Tab label="Home" value={0}/>
                <Tab label="History" value={1} />
            </Tabs>
            </Grid>
        </AppBar>
        {pageId === 0 && <Home/> }
        {pageId === 1 && <History/> }
        </>
    )
}

export default Main