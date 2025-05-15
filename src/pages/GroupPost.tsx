import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonTextarea, IonButton } from '@ionic/react';
import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

interface Params {
  groupId: string;
}

const GroupPost: React.FC = () => {
  const { groupId } = useParams<Params>();
  const [content, setContent] = useState('');
  const history = useHistory();

  const handlePost = async () => {
    const user = await supabase.auth.getUser();
    if (user.data.user) {
      const { error } = await supabase.from('posts').insert({
        group_id: groupId,
        user_id: user.data.user.id,
        content,
      });

      if (error) {
        alert(error.message);
        return;
      }

      history.push(`/it35-lab/group/${groupId}`); // Updated path here
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Create Post</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonTextarea
          label="Post Content"
          labelPlacement="floating"
          placeholder="Write your post here..."
          value={content}
          onIonChange={e => setContent(e.detail.value!)}
          className="ion-margin-bottom"
        />
        <IonButton expand="block" onClick={handlePost}>
          Post
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default GroupPost;
