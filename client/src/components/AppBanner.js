import { useContext, useState } from 'react';
import { Link } from 'react-router-dom'
import AuthContext from '../auth';
//import { GlobalStoreContext } from '../store'

import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { useHistory } from 'react-router-dom';

export default function AppBanner() {
    const { auth } = useContext(AuthContext);
    
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const history = useHistory();

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        auth.logoutUser();
    }

    const handleCommunityButton = () => {
        history.push("/community/");
    }

    const handleSetting = () => {
        history.push("/setting/");
    }
    const menuId = 'primary-search-account-menu';
    const loggedOutMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}><Link to='/login/'>Login</Link></MenuItem>
            <MenuItem onClick={handleMenuClose}><Link to='/register/'>Create New Account</Link></MenuItem>
            <MenuItem onClick={handleMenuClose}><Link to='/community/'>Continue As Guest</Link></MenuItem>
            <MenuItem onClick={handleSetting}><Link>Setting</Link></MenuItem>
        </Menu>
    );
    const loggedInMenu = 
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
            <MenuItem onClick={handleSetting}>Setting</MenuItem>
        </Menu>        


    let logIn = false;
    let menu = loggedOutMenu;
    if (auth.loggedIn) {
        menu = loggedInMenu;
        logIn = true;
    }

    function getAccountMenu(loggedIn) {
        let userInitials = auth.getUserInitials();
        console.log("userInitials: " + userInitials);
        if (loggedIn) 
            return <div>{userInitials}</div>;
        else
            return <AccountCircle />;
    }

    return (
        <Box sx={{ flexGrow: 1}}>
            <AppBar position="static" className="ToolBar" >
                <Toolbar className="ToolBar">
                <Box className="custom-box"></Box>
                <span className="custom-text">Mapcraft</span>
                <Box sx={{ flexGrow: 1 }}></Box>
                    <Typography                        
                        variant="h4"
                        noWrap
                        component="div"
                        sx={{ display: { xs: 'none', sm: 'block'} }}                        
                    >
                        <div style={{ display: 'flex', alignItems: 'left' }}>
                            <Link style={{ textDecoration: 'none', color: 'white' }} to='/'>⌂</Link>
                            <Box>
                                {logIn?<IconButton onClick={handleCommunityButton}><GroupsOutlinedIcon></GroupsOutlinedIcon>
                                </IconButton> : null}
                                
                            </Box>
                        </div>
                        
                    </Typography>
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                           
                        >
                            { getAccountMenu(auth.loggedIn) }
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {
             menu
            }
        </Box>
    );
}