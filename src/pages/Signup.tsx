// Signup.tsx
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonText
} from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'Teacher' | 'Student'>('Student');
  const history = useHistory();

  const handleSignup = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) return alert(error.message);

    const user = data?.user;
    if (user) {
      const { error: insertError } = await supabase.from('users').insert({
        id: user.id,
        email,
        role
      });

      if (insertError) return alert(insertError.message);

      history.push('/it35-lab/home'); // ✅ Corrected path
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Signup</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonInput
          label="Email"
          labelPlacement="floating"
          placeholder="Enter email"
          type="email"
          value={email}
          onIonChange={(e) => setEmail(e.detail.value!)}
          className="ion-margin-bottom"
        />
        <IonInput
          label="Password"
          labelPlacement="floating"
          placeholder="Enter password"
          type="password"
          value={password}
          onIonChange={(e) => setPassword(e.detail.value!)}
          className="ion-margin-bottom"
        />
        <IonSelect
          label="Role"
          labelPlacement="floating"
          value={role}
          onIonChange={(e) => setRole(e.detail.value)}
          className="ion-margin-bottom"
        >
          <IonSelectOption value="Student">Student</IonSelectOption>
          <IonSelectOption value="Teacher">Teacher</IonSelectOption>
        </IonSelect>

        <IonButton expand="block" onClick={handleSignup}>
          Signup
        </IonButton>

        <IonText>
          <p className="ion-padding-top">
            Already have an account?{' '}
            <span
              style={{ color: 'blue', cursor: 'pointer' }}
              onClick={() => history.push('/it35-lab')} // ✅ Corrected
            >
              Login here
            </span>
          </p>
        </IonText>
      </IonContent>
    </IonPage>
  );
};

export default Signup;
