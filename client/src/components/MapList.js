import { useContext, useState} from 'react'
import { GlobalStoreContext } from '../store'
import ListItem from '@mui/material/ListItem';
import Box from '@mui/material/Box';
import { IconButton } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';


function MapList(props) {
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const { idNamePair, selected } = props;
    const [selectedCard, setSelectedCard] = useState(null);

    const handleMapSelect = (event) => {
        handleSelectMap(event, idNamePair._id)
    };

    const handleSelectMap = (event, id) => {
        console.log("handleLoadList for " + id);
        store.currentmapName = idNamePair.name;
        store.selectMap(id); 

    }

    const handleLikes = () => {
         store.increaseMapLikes(idNamePair._id);
        }
     
    const handleDisLikes = () => {
         store.increaseMapDisLikes(idNamePair._id,);
    }

   
    let cardElement =
    <div>
    <ListItem
    id={idNamePair._id}
    key={idNamePair._id}
    sx={{ marginTop: '10px', display: 'flex', p: 1 }}
    style={{ width: '90%'}}
    className={store.currentMap != null && store.currentMap._id == idNamePair._id ? 'map-card-unhover' : 'map-card'}
    //className= 'map-card-unhover'
    onClick={(event) => {
        //handleLoadList(event, idNamePair._id)
        handleMapSelect(event)
    }}
>
    
    
    </ListItem>
    <div className = {store.currentMap != null && store.currentMap._id == idNamePair._id ? 'info-card-unhover' : 'info-card'}>
    Name: {idNamePair.name} 
    <IconButton style = {{marginLeft: '90px'}} onClick = {handleLikes}><ThumbUpIcon style={{fontSize: '1rem'}}></ThumbUpIcon></IconButton>{idNamePair.likes}
    <IconButton onClick = {handleDisLikes}><ThumbDownIcon style={{fontSize: '1rem'}}></ThumbDownIcon></IconButton>{idNamePair.disLikes}
    <div>Author: {idNamePair.authorName}</div>
    <div>Created Date: {idNamePair.createdAt}</div>
    </div>
    </div>

    
    return (
        cardElement
    );
}

export default MapList;