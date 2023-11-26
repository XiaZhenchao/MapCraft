import { useContext } from 'react';
import AuthContext from '../auth'
import Copyright from './Copyright'

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MUIRegisterErrorModal from './MUIRegisterErrorModal';

export default function RegisterScreen() {
    const { auth } = useContext(AuthContext);

    let modalJSX = "";
    if (auth.isRegisterModalOpen()) {
        modalJSX = <MUIRegisterErrorModal />;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const role = "user"
        auth.registerUser(
            formData.get('firstName'),
            formData.get('lastName'),
            formData.get('email'),
            formData.get('password'),
            formData.get('passwordVerify'),
            role
        );
    };

    return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 15,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Box id = "register-box"></Box>
                    
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField style={{
                                backgroundColor: '#e1e4cb',
                                borderRadius: '10px'
                                }}
                                    autoComplete="fname"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                   
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField  style={{
                                backgroundColor: '#e1e4cb',
                                borderRadius: '10px'
                                }}
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="lname"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField  style={{
                                backgroundColor: '#e1e4cb',
                                borderRadius: '10px'
                                }}
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField  style={{
                                backgroundColor: '#e1e4cb',
                                borderRadius: '10px'
                                }}
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField  style={{
                                backgroundColor: '#e1e4cb',
                                borderRadius: '10px'
                                }}
                                    required
                                    fullWidth
                                    name="passwordVerify"
                                    label="Password Verify"
                                    type="password"
                                    id="passwordVerify"
                                    autoComplete="new-password"
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2,  color: 'black', backgroundColor: '#e1e4cb' }}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="center" alignItems="center" >
                            <Grid item justifyContent="center" alignItems="center">
                                <Link href="/login/" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 5 }} />
                { modalJSX }
            </Container>
    );
}