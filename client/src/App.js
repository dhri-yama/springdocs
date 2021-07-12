import Texteditor from "./components/Texteditor";
import  { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Home from "./components/Home"

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact>
            <Home/>
            {/* <Redirect to={`/documents/${uuidV4()}`}/> */}
          </Route>
          <Route path="/documents/:id">
            <Texteditor/>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
