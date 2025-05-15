import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import CreateGroup from './pages/CreateGroup';
import GroupDetails from './pages/GroupDetails';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/palettes/dark.system.css';
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/it35-lab" component={Login} />
        <Route exact path="/it35-lab/signup" component={Signup} />
        <Route exact path="/it35-lab/home" component={Home} />
        <Route exact path="/it35-lab/create" component={CreateGroup} />
        <Route exact path="/it35-lab/group/:id" component={GroupDetails} />

        {/* Redirect root to /it35-lab */}
        <Route exact path="/">
          <Redirect to="/it35-lab" />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
