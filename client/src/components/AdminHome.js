import AuthContext from '../auth'

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
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import AdminBanner from './AdminBanner.js';


const AdminHome = () => {
    //const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const history = useHistory();
    let appBanner = <AdminBanner />
    
    

    
    return (
        <div >
        <Box sx={{ flexGrow: 1,background: 'lightgray', alignItems: 'center', paddingLeft: '20px'}} id = "navigation-bar" >
        <Typography variant="h5"> Message List </Typography>
        </Box>
        <List sx={{ bgcolor: '#ABC8B2', mb:"20px" }}id = "list" >
        <Paper elevation={3} style={{ padding: '20px', maxWidth: '300px', background: 'lightgray' }}>
        <Typography variant="h6">Report:
        <br /> 
        <span style={{ marginLeft: '20px' }}></span>User @Jack violated the user rule. 
        <u>Jump to location</u>
         <br />
From @Mary</Typography>

      </Paper>
        </List>
        
        <Box  id = "export-close"><CloseIcon></CloseIcon></Box>
        <div id = "container" style={{padding: '50px', background: 'lightgray',fontSize: '40px', maxWidth: '700px', marginLeft: 'auto' }}>
        Report:
        <br /> 
        <br /> 
       
        <span style={{ marginLeft: '40px' }}></span>User @Jack violated the user rule. 
        <u>Jump to location</u>
         <br />
         <br /> 
         <br /> 
From @Mary
        </div>
      
        </div>)
}

export default AdminHome;