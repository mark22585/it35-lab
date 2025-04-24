import { 
  IonAlert,
  IonButton,
  IonContent, 
  IonInput, 
  IonInputPasswordToggle,  
  IonPage,  
  IonToast,  
  useIonRouter
} from '@ionic/react';
import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

const AlertBox: React.FC<{ message: string; isOpen: boolean; onClose: () => void }> = ({ message, isOpen, onClose }) => {
  return (
    <IonAlert
      isOpen={isOpen}
      onDidDismiss={onClose}
      header="Notification"
      message={message}
      buttons={['OK']}
    />
  );
};

const Login: React.FC = () => {
  const navigation = useIonRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const doLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setAlertMessage(error.message);
      setShowAlert(true);
      return;
    }

    setShowToast(true); 
    setTimeout(() => {
      navigation.push('/it35-lab/app', 'forward', 'replace');
    }, 300);
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-blue-200">
          <div className="w-full max-w-md bg-white p-8 rounded-2xl border-2 border-indigo-500 shadow-xl">
            {/* Replacing Ionic logo with the provided GIF */}
            <div className="flex justify-center mb-6">
              <img 
                src="https://cdn-icons-gif.flaticon.com/14251/14251527.gif" 
                alt="Logo"
                className="w-24 h-24" // Custom width and height for the GIF
              />
            </div>

            <h2 className="text-3xl font-extrabold text-indigo-700 text-center mb-6">Login</h2>

            <IonInput
              label="Email"
              labelPlacement="floating"
              fill="outline"
              type="email"
              placeholder="Enter your email"
              value={email}
              onIonChange={e => setEmail(e.detail.value!)}
              className="mb-5"
            />
            <IonInput
              fill="outline"
              type="password"
              placeholder="Enter your password"
              value={password}
              onIonChange={e => setPassword(e.detail.value!)}
              className="mb-5"
            >
              <IonInputPasswordToggle slot="end" />
            </IonInput>

            <IonButton onClick={doLogin} expand="full" shape="round" className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium">
              Login
            </IonButton>

            <IonButton
              routerLink="/it35-lab/register"
              expand="full"
              fill="clear"
              shape="round"
              className="mt-3 text-indigo-600 hover:underline"
            >
              Don't have an account? Register
            </IonButton>
          </div>
        </div>

        <AlertBox message={alertMessage} isOpen={showAlert} onClose={() => setShowAlert(false)} />

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Login successful! Redirecting..."
          duration={1500}
          position="top"
          color="success"
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
