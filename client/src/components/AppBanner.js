import { useContext, useState } from 'react';
import { Link } from 'react-router-dom'
import AuthContext from '../auth';
import { GlobalStoreContext } from '../store'
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
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
export default function AppBanner() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
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

    function handleKeyPressSearch(event) {
        if (event.code === "Enter") {
            let text = event.target.value;
            store.storeSearchValue(text);
        }
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
                {logIn ? (
                <TextField
                  className="text"
                  label="Search"
                  variant="outlined"
                  placeholder="Search..."
                  size="small"
                  sx={{ width: '500px' }}
                  onKeyPress = {handleKeyPressSearch}
                />
              ) : null}
              <Box sx={{ flexGrow: 1 }}></Box>
              <Typography
                    variant="h4"
                    noWrap
                    component="div"
                    sx={{ 
                        display: { xs: 'none', sm: 'block' },
                        marginRight: '20px',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'left' }}>
                    <Tooltip title="Home" arrow>
                        <Link style={{ textDecoration: 'none', color: 'white', marginRight: '10px' }} to='/'>⌂</Link>
                    </Tooltip>
                        <Box>
                            {logIn ? (
                                <Tooltip title="Community" arrow>
                                    <IconButton onClick={handleCommunityButton}>
                                    <GroupsOutlinedIcon />
                                    </IconButton>
                              </Tooltip>
                            ) : null}
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