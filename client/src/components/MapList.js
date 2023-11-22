import { useContext, useState} from 'react'
import { GlobalStoreContext } from '../store'
import ListItem from '@mui/material/ListItem';
import Box from '@mui/material/Box';
import { IconButton } from '@mui/material';
import TextField from '@mui/material/TextField';


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
        store.selectMap(id);

    }

    

    let selectClass = "unselected-list-card";
    if (selected) {
        selectClass = "selected-list-card";
    }
   
    let cardElement =
    <ListItem
    id={idNamePair._id}
    key={idNamePair._id}
    sx={{ marginTop: '10px', display: 'flex', p: 1 }}
    style={{ width: '29%', fontSize: '32pt', borderRadius: '25px', border: '1px', backgroundColor: '#e1e4cb' }}
    className={"map-card"}
    onClick={(event) => {
        //handleLoadList(event, idNamePair._id)
        handleMapSelect(event)
    }}
>
    <Box sx={{ p: 1, flexGrow: 1 }}>{idNamePair.name}</Box>
    
    
</ListItem>

    
    return (
        cardElement
    );
}

export default MapList;