import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, } from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const CreateGroup: React.FC = () => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const history = useHistory();

  const handleCreate = async () => {
    const user = await supabase.auth.getUser();
    if (user.data.user) {
      const { error } = await supabase.from('groups').insert({
        name,
        description: desc,
        created_by: user.data.user.id
      });

      if (error) {
        alert(error.message);
        return;
      }
      history.push('/home');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Create Group</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonInput
          label="Group Name"
          labelPlacement="floating"
          placeholder="Enter group name"
          value={name}
          onIonChange={e => setName(e.detail.value!)}
          className="ion-margin-bottom"
        />
        <IonInput
          label="Description"
          labelPlacement="floating"
          placeholder="Enter group description"
          value={desc}
          onIonChange={e => setDesc(e.detail.value!)}
          className="ion-margin-bottom"
        />
        <IonButton expand="block" onClick={handleCreate}>
          Create Group
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default CreateGroup;
