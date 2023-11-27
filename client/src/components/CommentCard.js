import { Box } from '@mui/system';

function CommentCard(props) {
    const { username, commentObject } = props;
    console.log("comments test1: " + commentObject);
    console.log("comments test2: " + username);
    return (
        <Box style={{ background: "lightyellow", border: '2px solid #999999' }}>
            <Box style={{ fontSize: '15px', marginTop: '3%', marginLeft: '2%' }}>{"By: " + 123}</Box>
            <Box style={{ fontSize: '20px', marginTop: '3%', marginLeft: '2%', width: '60%' }}>{123}</Box>
        </Box>
    );
}

export default CommentCard;