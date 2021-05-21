import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Chat from './Chat';
import Login from './Login';
import Sidebar from './Sidebar';
import { useStateValue } from './StateProvider';

function App() {
  const [{ user }] = useStateValue();

  return !user ? (
    <Login />
  ) : (
    <div className="app">
      <div className="app__body">
        <Router>
          <Sidebar />
          <Switch>
            <Route path="/rooms/:roomId">
              <Chat />
            </Route>

            <Route path="/">
              <Chat />
            </Route>
          </Switch>
        </Router>
      </div>
    </div>
  );
}

export default App;
