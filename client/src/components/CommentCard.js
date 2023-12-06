import { useContext, useState} from 'react'
import { GlobalStoreContext } from '../store'
import { IconButton } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import AuthContext from '../auth';


function CommentCard(props) {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const { idNamePair} = props;

    const handleCommentLikes = () => {
         console.log("id------"+idNamePair._id);
         store.increaseCommentLikes(idNamePair._id);
        }
     
    const handleCommentDisLikes = () => {
         store.increaseCommentDisLikes(idNamePair._id);
    }

    const handleDeleteComment = () => {
        store.deleteComment(idNamePair._id);
    }

    let cardElement =
    <div id = 'comment-list'>
        <div>@{idNamePair.userName}: </div>
        <div className='space'>{idNamePair.comment}</div>
        <IconButton onClick = {handleCommentLikes}><ThumbUpIcon style={{fontSize: '1rem'}}> </ThumbUpIcon></IconButton>{idNamePair.likes}
        <IconButton onClick = {handleCommentDisLikes}><ThumbDownIcon style={{fontSize: '1rem'}}></ThumbDownIcon></IconButton>{idNamePair.disLikes}
        <Button id = "report-box"></Button>
        <IconButton onClick = {handleDeleteComment}>{idNamePair.userName === auth.user.firstName + " " + auth.user.lastName?<DeleteIcon></DeleteIcon>: ""}</IconButton>
    </div>

    
    return (
        cardElement
    );
}

export default CommentCard;