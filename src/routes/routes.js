import React from "react";
import Home from "./pages/home";
//import { About } from "./views/About";
//import { NavBar } from './components/NavBar';
import { Route, Switch, Redirect } from "react-router-dom";

const Routes = () => {
  return (
    <div>
      <Switch>
        <Route path="/Home" component={Home} />
        <Route exact path="/" component={Home} />
        <Redirect path="*" to="/" />
        {/* <Route exact path="/About" component={About} /> */}
      </Switch>
    </div>
  );
};
export default Routes;
