import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Redirect } from "react-router-dom";
import axios from "axios";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn({ props }) {
  const classes = useStyles();
  const user = useFormInput("");
  const password = useFormInput("");

  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);
    if (token && !loggedIn) {
      const options = {
        headers: { token: token },
      };
      axios
        .get("http://localhost:8080/login", options)
        .then((response) => {
          console.log(response);
          setLoggedIn(true);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  });

  return (
    <Container component="main" maxWidth="xs">
      {loggedIn && <Redirect to="/home" />}
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            error={error !== ""}
            value={user.value}
            onChange={user.onchange}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            error={error !== ""}
            value={password.value}
            onChange={password.onchange}
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <FormHelperText error={error !== ""}>{error}</FormHelperText>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={login}
          >
            Sign In
          </Button>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );

  function useFormInput(initalValue) {
    const [value, setValue] = useState();

    function handleChange(event) {
      setValue(event.target.value);
    }

    return {
      value,
      onchange: handleChange,
    };
  }

  function login(e) {
    e.preventDefault();
    const payload = {
      username: user.value,
      password: password.value,
    };
    const options = {
      headers: { "Access-Control-Allow-Origin": "*" },
    };
    axios
      .post("http://localhost:8080/signin", payload, options)
      .then((response) => {
        console.log(response);
        setLoggedIn(true);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", response.data.user);
      })
      .catch((error) => {
        console.log(error);
        setError("Invalid username or password");
      });
  }
}
