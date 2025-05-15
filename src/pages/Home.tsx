import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useHistory } from 'react-router-dom';

interface Group {
  id: string;
  name: string;
  description: string;
}

const Home: React.FC = () => {
  const [role, setRole] = useState('');
  const [groups, setGroups] = useState<Group[]>([]);
  const history = useHistory();

  useEffect(() => {
    const checkUser = async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        console.log('No user logged in, redirecting to login page...');
        history.push('/it35-lab');  // Corrected path here
        return;
      }

      const userId = user.data.user.id;
      console.log('Logged in user:', userId);

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

      if (userError || !userData) {
        console.error('Error fetching user role:', userError);
        return;
      }

      setRole(userData.role);
      console.log('Fetched role:', userData.role);

      const { data: groupsData, error: groupsError } = await supabase
        .from('groups')
        .select('*');

      if (groupsError) {
        console.error('Error fetching groups:', groupsError);
      } else {
        setGroups(groupsData || []);
      }
    };

    checkUser();
  }, [history]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Group List</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {role === 'Teacher' && (
          <IonButton expand="full" onClick={() => history.push('/it35-lab/create')}>
            Create Group
          </IonButton>
        )}

        {groups.map((group) => (
          <div key={group.id} className="ion-padding">
            <h3>{group.name}</h3>
            <IonButton expand="full" onClick={() => history.push(`/it35-lab/group/${group.id}`)}>
              View
            </IonButton>
          </div>
        ))}
      </IonContent>
    </IonPage>
  );
};

export default Home;
