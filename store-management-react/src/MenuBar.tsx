import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import AddLocationTwoToneIcon from '@mui/icons-material/AddLocationTwoTone';
import AssignmentTwoToneIcon from '@mui/icons-material/AssignmentTwoTone';
import LocalGroceryStoreTwoToneIcon from '@mui/icons-material/LocalGroceryStoreTwoTone';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import {Link} from "react-router-dom";
import LoginDialog from "./components/dialogs/LoginDialog";

function MenuBar(props: { currentUser: string, setCurrentUser: any, username: string, setUsername: any }) {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const [loginOpen, setLoginOpen] = React.useState(false);
    const handleLoginClickOpen = () => {
        setLoginOpen(true);
    };
    const handleLoginClose = () => {
        setLoginOpen(false);
    };

    return (
        <AppBar position="static">
            <LoginDialog open={loginOpen} handleClose={handleLoginClose} setCurrentUser={props.setCurrentUser}
                         setUsername={props.setUsername}/>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <LocalGroceryStoreTwoToneIcon sx={{display: {xs: 'none', md: 'flex'}, mr: 1}}/>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="#/"
                        sx={{
                            mr: 2,
                            display: {xs: 'none', md: 'flex'},
                            fontFamily: 'Arial',
                            fontWeight: 700,
                            letterSpacing: '0',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Defensibilities
                    </Typography>

                    <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: {xs: 'block', md: 'none'},
                            }}
                        >
                            <Button href="#/stores">
                                <MenuItem key={0} onClick={handleCloseNavMenu}>
                                    <AddLocationTwoToneIcon color="primary" style={{marginRight: 10}}/>
                                    <Typography color="primary" textAlign="center">Stores Near Me</Typography>
                                </MenuItem>
                            </Button><br/>
                            <Button href="#/search">
                                <MenuItem key={1} onClick={handleCloseNavMenu}>
                                    <SearchTwoToneIcon color="primary" style={{marginRight: 10}}/>
                                    <Typography color="primary" textAlign="center">Search Items</Typography>
                                </MenuItem>
                            </Button><br/>
                            {!props.currentUser ? <></> :
                                <Button href={props.currentUser == "manager" ? "#/manageStore" : "#/manageCorporate"}>
                                    <MenuItem key={2} onClick={handleCloseNavMenu}>
                                        <AssignmentTwoToneIcon color="primary" style={{marginRight: 10}}/>
                                        <Typography color="primary"
                                                    textAlign="center">Manage {props.currentUser == "manager" ? "Store" : "Corporate"}</Typography>
                                    </MenuItem>
                                </Button>
                            }
                        </Menu>
                    </Box>
                    <LocalGroceryStoreTwoToneIcon sx={{display: {xs: 'flex', md: 'none'}, mr: 1}}/>
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href={"#/"}
                        sx={{
                            mr: 2,
                            display: {xs: 'flex', md: 'none'},
                            flexGrow: 1,
                            fontFamily: 'Arial',
                            fontWeight: 700,
                            letterSpacing: '0',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Defensibilities
                    </Typography>
                    <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                        <Button
                            href={"#/stores"}
                            startIcon={<AddLocationTwoToneIcon/>}
                            key={0}
                            onClick={handleCloseNavMenu}
                            className={"menuButton"}
                            sx={{my: 2, color: 'white', display: 'block'}}
                        >
                            Stores Near Me
                        </Button>
                        <Button
                            href={"#/search"}
                            startIcon={<SearchTwoToneIcon/>}
                            key={1}
                            onClick={handleCloseNavMenu}
                            className={"menuButton"}
                            sx={{my: 2, color: 'white', display: 'block'}}
                        >
                            Search Items
                        </Button>
                        {!props.currentUser ? <></> :
                            <Button
                                href={props.currentUser == "manager" ? "#/manageStore" : "#/manageCorporate"}
                                startIcon={<AssignmentTwoToneIcon/>}
                                key={2}
                                onClick={handleCloseNavMenu}
                                className={"menuButton"}
                                sx={{my: 2, color: 'white', display: 'block'}}
                            >
                                Manage {props.currentUser == "manager" ? "Store" : "Corporate"}
                            </Button>
                        }
                    </Box>

                    {!props.currentUser ?
                        <Button style={{color: "white"}} onClick={handleLoginClickOpen}>Login</Button> :
                        <Box sx={{flexGrow: 0}}>
                            <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                <Avatar alt={props.username} sx={{ bgcolor: "#8241C3" }} src="/static/images/avatar/1.jpg"/>
                            </IconButton>
                            <Menu
                                sx={{mt: '45px'}}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                <MenuItem key={"logout"} onClick={() => {
                                    props.setCurrentUser({});
                                    window.localStorage.clear();
                                    handleCloseUserMenu();
                                }}>
                                    <Typography textAlign="center">Logout</Typography>
                                </MenuItem>
                            </Menu>
                        </Box>
                    }
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default MenuBar;