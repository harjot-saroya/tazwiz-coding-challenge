import React, { useState } from "react";
//import { Route, Router, history } from "react-router";
import { useHistory, withRouter } from "react-router-dom";
import Home from "./routes/pages/home.js";
import logo from "./user.png";
import "./App.css";
import axios from "axios";

function App() {
  let history = useHistory();
  // Stay logged in even if page closes
  const check = () => {
    axios.get("http://localhost:3001/check").then(
      response => {
        if (response.data == "Found") {
          history.push("/home");
        } else {
          history.push("/");
        }
      },
      error => {
        console.log(error);
      }
    );
  };
  check();

  // Make functions here
  // Hook
  const [show, setShow] = useState(false);
  const [username, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [cusername, setcUser] = useState("");
  const [cpass, setcPass] = useState("");

  const eHandler = event => {
    setEmail(event.target.value);
  };

  const pass2Handler = event => {
    setPass2(event.target.value);
  };

  const unHandler = event => {
    setUser(event.target.value);
  };
  const passHandler = event => {
    setPass(event.target.value);
  };
  const cunHandler = event => {
    setcUser(event.target.value);
  };
  const cpassHandler = event => {
    setcPass(event.target.value);
  };

  const displayCreate = e => {
    setShow(!show);
  };

  const login = () => {
    const frmdetails = {
      Username: { username },
      Password: { pass }
    };

    axios.post("http://localhost:3001/login", { username, pass }).then(
      response => {
        //setAuth(response);
        console.log(response);
        // if (response.data == "OK") {
        history.push("/home");
        // }
      },
      error => {
        console.log(error);
      }
    );
    //console.log(User);
  };

  const submitAcct = () => {
    if (cpass == pass2) {
      axios
        .post("http://localhost:3001/createAccount", {
          cusername,
          cpass,
          email
        })
        .then(
          response => {
            console.log(response.status);
            console.log("here");
          },
          error => {
            console.log(error);
          }
        );
    } else {
      alert("Passwords dont match");
    }
  };

  // Make <CreateAccount> Component

  const createAccount = show ? (
    <div id="createacct">
      <form>
        <div>
          <img id="user" src={logo} alt="user"></img>
        </div>
        <label id="form">
          <div>
            Username:
            <input
              type="text"
              id="un"
              name="Username"
              placeholder="Username"
              onChange={cunHandler}
            />
          </div>
          <div>
            Email:
            <input
              type="text"
              id="em"
              name="email"
              placeholder="email"
              onChange={eHandler}
            />
          </div>
          <div>
            Password:
            <input
              type="password"
              id="pw"
              name="Password"
              placeholder="Password"
              onChange={cpassHandler}
            />
          </div>
          <div>
            Retype Password:
            <input
              type="password"
              id="pw2"
              name="Password2"
              placeholder="Retype Password"
              onChange={pass2Handler}
            />
            <div>
              <input
                type="submit"
                id="submit"
                value="Submit"
                onClick={submitAcct}
              />
            </div>
          </div>
        </label>
      </form>
    </div>
  ) : (
    <div></div>
  );

  //console.log(check());

  return (
    <div className="App">
      <div class="header">
        <header id="welcome">WELCOME</header>
      </div>
      <div class="background">
        <div class="login">
          <form>
            <div>
              <img id="user" src={logo} alt="user"></img>
            </div>
            <label id="form">
              <div>
                Username:
                <input
                  type="text"
                  id="un"
                  name="Username"
                  placeholder="Username"
                  value={username}
                  onChange={unHandler}
                />
              </div>
              <div>
                Password:
                <input
                  type="password"
                  id="pw"
                  name="Password"
                  placeholder="Password"
                  value={pass}
                  onChange={passHandler}
                />
              </div>
            </label>
            <button onClick={login}>Submit</button>
            <div class="create">
              No account? Create one here!
              <div>
                <button type="button" onClick={() => displayCreate()}>
                  Create account
                </button>
                {createAccount}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default withRouter(App);
