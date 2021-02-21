import "./App.scss";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Header from "./components/Header";
import Characters from "./containers/Characters";
import Comics from "./containers/Comics";

function App() {
    const baseUrl = "https://le-reacteur-jerome-marvel.herokuapp.com"; //Site distant
    //const baseUrl = "http://localhost:3001"; //Site local

    return (
        <Router>
            <Header />
            <Switch>
                <Route path="/comics/:id">
                    <Comics baseUrl={baseUrl} />
                </Route>
                <Route path="/comics">
                    <Comics baseUrl={baseUrl} />
                </Route>
                <Route path="/">
                    <Characters baseUrl={baseUrl} />
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
