import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonText } from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      if (data.user) {
        // Redirect based on successful login
        history.push('/home');
      }
    } catch (error) {
      alert('An error occurred during login');
      console.error(error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonInput
          label="Email"
          labelPlacement="floating"
          placeholder="Enter email"
          type="email"
          value={email}
          onIonChange={e => setEmail(e.detail.value!)}
          className="ion-margin-bottom"
        />
        <IonInput
          label="Password"
          labelPlacement="floating"
          placeholder="Enter password"
          type="password"
          value={password}
          onIonChange={e => setPassword(e.detail.value!)}
          className="ion-margin-bottom"
        />
        <IonButton expand="block" onClick={handleLogin}>
          Login
        </IonButton>
        <IonText>
          <p className="ion-padding-top">
            Don’t have an account?{' '}
            <span
              style={{ color: 'blue', cursor: 'pointer' }}
              onClick={() => history.push('/signup')}
            >
              Sign up here
            </span>
          </p>
        </IonText>
      </IonContent>
    </IonPage>
  );
};

export default Login;
