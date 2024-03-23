import React, { Component } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
// import IconButton from "@mui/material/IconButton";
// import AccountCircleIcon from "@mui/icons-material/AccountCircle";


class NavBar extends Component {
    render() {
        return (
            <AppBar position="static">
                <Toolbar className="nav-container">
                    <Button color="inherit" component={Link} to="/home">Home</Button>
                    <Button color="inherit" component={Link} to="/login">LogIn</Button>
                    <Button color="inherit" component={Link} to="/signup">SignUp</Button>
                    {/*<IconButton color="inherit" component={Link} to="/profile">*/}
                    {/*    <AccountCircleIcon />*/}
                    {/*</IconButton>*/}
                </Toolbar>
            </AppBar>
        );
    }
}

export default NavBar;