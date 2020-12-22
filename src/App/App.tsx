import React from 'react';
import './App.scss';
import {Route, Switch} from "react-router";
import Users from "../Users/Users";
import UserAddPage from "../UserAddPage/UserAddPage";
import UserEditPage from '../UserEditPage/UserEditPage';
import UserViewPage from "../UserViewPage/UserViewPage";

const App = () => {
    return (
        <Switch>
            <Route path="/add" component={UserAddPage}/>
            <Route path="/edit/:userId" component={UserEditPage}/>
            <Route path="/view/:userId" component={UserViewPage}/>
            <Route component={Users}/>
        </Switch>
    );
}

export default App;
