import React, { useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { AuthContext } from "../middleware";

const NavBar = ({ onLogout }) => {
  const isAuthenticated = useContext(AuthContext);
  console.log(isAuthenticated);

  return (
    <AppBar position="static">
      <Toolbar className="nav-container">
        <Button color="inherit" component={Link} to="/home">Home</Button>
        {isAuthenticated ? (
          <>
            <Button color="inherit" onClick={onLogout}>LogOut</Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">LogIn</Button>
            <Button color="inherit" component={Link} to="/signup">SignUp</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
