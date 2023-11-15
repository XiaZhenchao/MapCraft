import { useContext, useState} from 'react'
import { GlobalStoreContext } from '../store'
import ListItem from '@mui/material/ListItem';

function MapList() {
    const { store } = useContext(GlobalStoreContext);

    
    let mapCard =
    <div>
       <ListItem
            sx={{p: "10px", marginTop: '15px', display: 'flex', p: 2}}
            className = {"map-card"}
                  
        ></ListItem>
        </div>


    return (
        mapCard
    );
}

export default MapList;