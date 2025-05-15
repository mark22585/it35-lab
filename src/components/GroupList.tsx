import { useEffect, useState } from 'react';
import { IonContent, IonPage, IonLoading, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonText } from '@ionic/react';
import { supabase } from '../utils/supabaseClient';

// Define the Group interface to type the group data
interface Group {
  id: string;
  name: string;
  subject: string;
  description: string;
}

const GroupList: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);  // Use the Group type here
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('groups').select('*');
      if (error) {
        console.error('Error fetching groups:', error);
      } else {
        setGroups(data);  // TypeScript will know that 'data' is an array of 'Group'
      }
      setLoading(false);
    };

    fetchGroups();
  }, []);

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <h2>Available Groups</h2>

        <IonLoading isOpen={loading} message={'Loading Groups...'} />

        {groups.length > 0 ? (
          groups.map((group) => (
            <IonCard key={group.id} className="ion-margin-bottom">
              <IonCardHeader>
                <IonCardTitle>{group.name}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonText color="medium">
                  <p>{group.description}</p>
                  <p><strong>Subject:</strong> {group.subject}</p>
                </IonText>
                <IonButton expand="block" color="primary" routerLink={`/group/${group.id}`}>
                  View Details
                </IonButton>
              </IonCardContent>
            </IonCard>
          ))
        ) : (
          <IonText color="danger">
            <p>No groups available.</p>
          </IonText>
        )}
      </IonContent>
    </IonPage>
  );
};

export default GroupList;
