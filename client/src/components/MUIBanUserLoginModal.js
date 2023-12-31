import { useContext } from 'react';
import AuthContext from '../auth';
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Alert from '@mui/material/Alert'
import { AlertTitle, Button } from '@mui/material';

export default function MUIBanUserLoginModal( { open, handleClose } ) {
    const { auth } = useContext(AuthContext);
    const message = "Your account has been suspended due to a violation of our community guidelines. Please review our terms of service and contact support for further assistance.";

    function handleCloseModal(event) {
        auth.hideModals();
    }

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

    return (
        <Modal open={open} onClose={handleClose}
        >
            <Box sx={style}>
            <Alert severity="warning">
            <AlertTitle>Warning</AlertTitle>
                 {message}
            <button
                onClick={handleCloseModal}
            >CLOSE</button>
                        
            </Alert>
            </Box>
        </Modal>
    );
}