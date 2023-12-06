import { useContext, useState} from 'react'
import { GlobalStoreContext } from '../store'
import { IconButton } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import Button from '@mui/material/Button';


function CommentCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { idNamePair} = props;

    const handleCommentLikes = () => {
         console.log("id------"+idNamePair._id);
         store.increaseCommentLikes(idNamePair._id);
        }
     
    const handleCommentDisLikes = () => {
         store.increaseCommentDisLikes(idNamePair._id);
    }

    let cardElement =
    <div id = 'comment-list'>
        <div>@{idNamePair.userName}: </div>
        <div className='space'>{idNamePair.comment}</div>
        <IconButton onClick = {handleCommentLikes}><ThumbUpIcon style={{fontSize: '1rem'}}> </ThumbUpIcon></IconButton>{idNamePair.likes}
        <IconButton onClick = {handleCommentDisLikes}><ThumbDownIcon style={{fontSize: '1rem'}}></ThumbDownIcon></IconButton>{idNamePair.disLikes}
        <Button id = "report-box"></Button>
    </div>

    
    return (
        cardElement
    );
}

export default CommentCard;