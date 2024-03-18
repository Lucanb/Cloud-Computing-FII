import React, { Component } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

class NavBar extends Component {
    render() {
        return (
            <AppBar position="static">
                <Toolbar className="nav-container">
                    <Button color="inherit" component={Link} to="/">Home</Button>
                    <Button color="inherit" component={Link} to="/login">LogIn</Button>
                    <Button color="inherit" component={Link} to="/signup">SignUp</Button>
                </Toolbar>
            </AppBar>
        );
    }
}

export default NavBar;
