import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonTextarea } from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

const CreateGroup: React.FC = () => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleCreate = async () => {
    if (!name.trim() || !desc.trim()) {
      alert('Please fill in both group name and description.');
      return;
    }

    setLoading(true);

    const user = await supabase.auth.getUser();

    if (!user.data.user) {
      alert('You must be logged in to create a group.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('groups').insert({
      name: name.trim(),
      description: desc.trim(),
      created_by: user.data.user.id,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    history.push('/it35-lab/home');
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
          clearInput
        />
        <IonTextarea
          label="Description"
          labelPlacement="floating"
          placeholder="Enter group description"
          value={desc}
          onIonChange={e => setDesc(e.detail.value!)}
          className="ion-margin-bottom"
          rows={4}
        />
        <IonButton expand="block" onClick={handleCreate} disabled={loading}>
          {loading ? 'Creating...' : 'Create Group'}
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default CreateGroup;
