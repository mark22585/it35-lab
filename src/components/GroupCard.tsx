import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonText } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

// Define the interface for the group prop
interface Group {
  id: string;
  name: string;
  subject: string;
  description: string;
}

const GroupCard: React.FC<{ group: Group }> = ({ group }) => {  // Use the Group interface
  const history = useHistory();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const getRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase.from('users').select('role').eq('id', user.id).single();
        if (!error && data) setUserRole(data.role);
      }
    };

    getRole();
  }, []);

  const handleJoin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('group_members')
        .insert({ group_id: group.id, user_id: user.id });
      alert('Joined group successfully!');
    }
  };

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>{group.name}</IonCardTitle>
        <IonCardSubtitle>{group.subject}</IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        <IonText color="medium">
          <p>{group.description}</p>
        </IonText>

        <IonButton expand="block" onClick={() => history.push(`/group/${group.id}`)}>
          View Details
        </IonButton>

        {userRole === 'Student' && (
          <IonButton expand="block" color="success" onClick={handleJoin}>
            Join Group
          </IonButton>
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default GroupCard;
