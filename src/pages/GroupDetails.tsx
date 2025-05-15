import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonText,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonInput,
  IonTextarea,  // <-- Change to IonTextarea
  IonSpinner,
} from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

interface Group {
  id: string;
  name: string;
  subject: string;
  description: string;
  creator_email: string;
}

interface Params {
  id: string;
}

const GroupDetails: React.FC = () => {
  const { id } = useParams<Params>();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('');
  const [isMember, setIsMember] = useState(false);
  const [memberCount, setMemberCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false); // For toggling edit mode
  const [newGroupName, setNewGroupName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const user = await supabase.auth.getUser();
      const userId = user.data.user?.id;

      // Fetch group info
      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .select('*')
        .eq('id', id)
        .single();

      if (groupError) {
        console.error('Error fetching group:', groupError);
      } else {
        setGroup(groupData);
        setNewGroupName(groupData.name); // Set the initial name
        setNewDescription(groupData.description); // Set the initial description
      }

      // Fetch user role
      if (userId) {
        const { data: userData, error: roleError } = await supabase
          .from('users')
          .select('role')
          .eq('id', userId)
          .single();

        if (!roleError && userData) {
          setRole(userData.role);
        }
      }

      // Check if user is already a member
      if (userId) {
        const { data: membershipData, error: memberError } = await supabase
          .from('group_members')
          .select('*')
          .eq('group_id', id)
          .eq('user_id', userId)
          .single();

        if (!memberError && membershipData) {
          setIsMember(true);
        }
      }

      // Count total members
      const { count, error: countError } = await supabase
        .from('group_members')
        .select('*', { count: 'exact', head: true })
        .eq('group_id', id);

      if (!countError && count !== null) {
        setMemberCount(count);
      }

      setLoading(false);
    };

    fetchData();
  }, [id]);

  const handleJoinOrCancel = async () => {
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;

    if (!userId) {
      alert('You must be logged in to join a group');
      return;
    }

    if (isMember) {
      // Cancel membership
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', id)
        .eq('user_id', userId);

      if (error) {
        console.error('Error canceling join:', error);
        alert('Error leaving group');
      } else {
        setIsMember(false);
        setMemberCount((prev) => prev - 1);
        alert('You have left the group.');
      }
    } else {
      // Join group
      const { error } = await supabase.from('group_members').insert({
        group_id: id,
        user_id: userId,
      });

      if (error) {
        console.error('Error joining group:', error);
        alert('Error joining group');
      } else {
        setIsMember(true);
        setMemberCount((prev) => prev + 1);
        alert('Successfully joined the group!');
      }
    }
  };

  const handleSaveChanges = async () => {
    if (newGroupName && newDescription) {
      const { error } = await supabase
        .from('groups')
        .update({ name: newGroupName, description: newDescription })
        .eq('id', id);

      if (error) {
        console.error('Error updating group:', error);
        alert('Error saving changes');
      } else {
        setGroup((prevGroup) => ({
          ...prevGroup!,
          name: newGroupName,
          description: newDescription,
        }));
        setIsEditing(false);
        alert('Changes saved successfully!');
      }
    } else {
      alert('Both name and description must be filled');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Group Details</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {loading ? (
          <IonSpinner name="crescent" />
        ) : group ? (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>{group.name}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              {role === 'Teacher' && isEditing ? (
                <>
                  <IonInput
                    value={newGroupName}
                    onIonChange={(e) => setNewGroupName(e.detail.value!)}
                    label="Group Name"
                  />
                  <IonTextarea
                    value={newDescription}
                    onIonChange={(e) => setNewDescription(e.detail.value!)}
                    label="Description"
                    rows={5}
                  />
                  <IonButton expand="block" onClick={handleSaveChanges}>
                    Save Changes
                  </IonButton>
                  <IonButton expand="block" color="medium" onClick={() => setIsEditing(false)}>
                    Cancel
                  </IonButton>
                </>
              ) : (
                <>
                  <p><strong>Description:</strong> {group.description}</p>
                  <p><strong>Members Joined:</strong> {memberCount}</p>

                  {role === 'Student' && (
                    <IonButton expand="block" color={isMember ? 'danger' : 'success'} onClick={handleJoinOrCancel}>
                      {isMember ? 'Cancel Join' : 'Join Group'}
                    </IonButton>
                  )}

                  {role === 'Teacher' && !isEditing && (
                    <IonButton expand="block" color="warning" onClick={() => setIsEditing(true)}>
                      Edit Group
                    </IonButton>
                  )}
                </>
              )}
            </IonCardContent>
          </IonCard>
        ) : (
          <IonText color="danger">Group not found.</IonText>
        )}

        <IonButton expand="block" onClick={() => history.goBack()}>
          Back
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default GroupDetails;
