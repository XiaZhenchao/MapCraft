import { useContext } from 'react';
import AuthContext from '../auth';
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Alert from '@mui/material/Alert'
import { AlertTitle, Button } from '@mui/material';

export default function MUIForgotPasswordErrorModal() {
    const { auth } = useContext(AuthContext);
    const message = auth.message;

    function handleCloseModal(event) {
        auth.hideModals();
    }

    const modalStyle = {
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
        <Modal open={auth.user === null} className='forgot-password-modal'>
            <Box sx={modalStyle}>
                <Alert severity="warning">
                    <AlertTitle>Warning</AlertTitle>
                    {message}
                    <Button variant="contained" onClick={handleCloseModal}>
                        CLOSE
                    </Button>
                </Alert>
            </Box>
        </Modal>
    );
}
