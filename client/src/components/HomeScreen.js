import React, { useContext, useEffect } from 'react'
//import { GlobalStoreContext } from '../store'
import AppBanner from './AppBanner';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import MapList from './MapList.js';

/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    //const { store } = useContext(GlobalStoreContext);
    let appBanner = <AppBanner />

    
    return (
        <div >
        <Box sx={{ flexGrow: 1,background: 'lightgray'}} id = "navigation-bar">
        </Box>
        <List sx={{ bgcolor: '#ABC8B2', mb:"20px" }}id = "list" >
            { 
            <MapList>"1111"</MapList>                
            }
            
        </List>
        <div id = "container">

        </div>
        </div>)
}

export default HomeScreen;