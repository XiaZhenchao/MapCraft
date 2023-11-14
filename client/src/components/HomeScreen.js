import React, { useContext, useEffect } from 'react'
//import { GlobalStoreContext } from '../store'
import AppBanner from './AppBanner';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import MapList from './MapList.js';
import { IconButton } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import LockIcon from '@mui/icons-material/Lock';
import SortIcon from '@mui/icons-material/Sort';
import Button from '@mui/material/Button';
import { useHistory } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import CloseIcon from '@mui/icons-material/Close';

/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    //const { store } = useContext(GlobalStoreContext);
    const history = useHistory();
    let appBanner = <AppBanner />

    const handleEditButton = () => {
        history.push("/edit/");
    }

    
    return (
        <div >
        <Box sx={{ flexGrow: 1,background: 'lightgray', alignItems: 'center', paddingLeft: '30px'}} id = "navigation-bar" >
            <IconButton> <AddCircleIcon></AddCircleIcon></IconButton>
            <IconButton> <PublishedWithChangesIcon></PublishedWithChangesIcon></IconButton>
            <IconButton> <LockIcon></LockIcon></IconButton>
            <IconButton> <SortIcon></SortIcon></IconButton>
        </Box>
        <List sx={{ bgcolor: '#ABC8B2', mb:"20px" }}id = "list" >
            { 
            <MapList>"1111"</MapList>                
            }
            
        </List>
        <div id = "map-name">Map1 <IconButton><EditIcon></EditIcon></IconButton>
        </div>
        <Box  id = "export-close"><ExitToAppIcon></ExitToAppIcon><CloseIcon></CloseIcon></Box>
        <div id = "container">

        </div>
        <div id = "function-bar">
            <Button className='button' 
                    sx={{ color: 'black', backgroundColor: '#ABC8B2', margin: '0.4rem',  fontSize: '0.5rem'}}>select File</Button>
            <Button className='button' 
                    sx={{ color: 'black', backgroundColor: '#ABC8B2', margin: '0.4rem',  fontSize: '0.5rem'}}>Fork</Button>
            <Button className='button' 
                    sx={{ color: 'black', backgroundColor: '#ABC8B2', margin: '0.4rem',  fontSize: '0.5rem'}}
                    onClick={handleEditButton}>Edit</Button>
            <Button className='button' 
                    sx={{ color: 'black', backgroundColor: '#ABC8B2', margin: '0.4rem',  fontSize: '0.5rem'}}>Render</Button>
            <Button className='button' 
                    sx={{ color: 'black', backgroundColor: '#ABC8B2', margin: '0.4rem',  fontSize: '0.5rem'}}>Publish</Button>
            <Button className='button'  
                    sx={{ color: 'black', backgroundColor: '#ABC8B2', margin: '0.4rem',  fontSize: '0.5rem'}}>Delete</Button>
        </div>
        </div>)
}

export default HomeScreen;