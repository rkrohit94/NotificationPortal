import React, { useState, useEffect } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Badge from "@material-ui/core/Badge";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import NotificationsIcon from "@material-ui/icons/Notifications";
import socketIOClient from "socket.io-client";
import Popover from "@material-ui/core/Popover";
import Notification from "./Notification";

import { Redirect } from "react-router-dom";
const ENDPOINT = "http://127.0.0.1:8080";

const useStyles = makeStyles((theme) => ({
  root: {
    flexFlow: 1,
  },
  inline: {
    display: "inline",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  typography: {
    padding: theme.spacing(2),
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
}));

export default function DenseAppBar() {
  const classes = useStyles();
  const [response, setResponse] = useState("");
  const [notifications, setNotifications] = useState([
    new Date().toISOString(),
  ]);
  const [loggedIn, setLoggedIn] = useState(true);
  const [count, setCount] = useState(notifications.length);

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT, {
      query: { token: localStorage.getItem("token") },
    });
    socket.on(localStorage.getItem("user"), (data) => {
      notifications.push(data);
      console.log(notifications);
      setNotifications(notifications);
      setResponse(data);
      setCount(notifications.length);
    });
  }, [notifications]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const options = {
        headers: { token: token },
      };
      axios
        .get("http://localhost:8080/login", options)
        .then((response) => {
          setLoggedIn(true);
        })
        .catch((error) => {
          console.log(error);
          setLoggedIn(false);
        });
    } else {
      setLoggedIn(false);
    }
  }, []);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setCount(0);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div className={classes.root}>
      {!loggedIn && <Redirect to="/" />}
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit">
            Notification Portal
          </Typography>

          <IconButton
            aria-label="show 17 new notifications"
            color="inherit"
            onClick={handleClick}
          >
            <Badge badgeContent={count} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        {notifications.map((value, key) => (
          <Notification key={key} data={value} />
        ))}
      </Popover>
      <p>
        It's <time dateTime={response}>{response}</time>
      </p>
    </div>
  );
}
