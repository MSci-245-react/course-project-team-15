import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App";


import * as serviceWorker from "./serviceWorker";

import {createRoot} from 'react-dom/client';
import Firebase, {FirebaseContext} from './components/Firebase';

const container = document.getElementById('root');
const root = createRoot(container); // Create a root.
root.render(
<FirebaseContext.Provider value={new Firebase()}>
<App />
</FirebaseContext.Provider>,
);

//ReactDOM.render(
    //<App />,
  //document.getElementById("root")
//);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
