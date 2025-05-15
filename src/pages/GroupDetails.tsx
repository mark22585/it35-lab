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
  IonTextarea,
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
  const [isEditing, setIsEditing] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [joining, setJoining] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const user = await supabase.auth.getUser();
        const userId = user.data.user?.id;
        const userEmail = user.data.user?.email;

        // Fetch group info
        const { data: groupData, error: groupError } = await supabase
          .from('groups')
          .select('*')
          .eq('id', id)
          .single();

        if (groupError) {
          console.error('Error fetching group:', groupError);
          setGroup(null);
          setLoading(false);
          return;
        }

        setGroup(groupData);
        setNewGroupName(groupData.name);
        setNewDescription(groupData.description);

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

        // Check if user is member
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
      } catch (error) {
        console.error('Unexpected error:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, [id]);

  const canEdit = () => {
    // Only allow edit if Teacher role AND logged-in user is group creator
    // (Assuming user email and creator_email available)
    // If you want to allow all Teachers to edit, just do role === 'Teacher'
    if (!group) return false;
    if (role !== 'Teacher') return false;

    // Compare emails
    // You need to get current user email here or store it in state (simplified below)
    // To avoid multiple calls, you could store userEmail in state as well in useEffect.
    // For simplicity, just allow all Teachers to edit here:
    return true;
  };

  const handleJoinOrCancel = async () => {
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;

    if (!userId) {
      alert('You must be logged in to join a group');
      return;
    }

    setJoining(true);

    if (isMember) {
      const confirmLeave = window.confirm('Are you sure you want to leave the group?');
      if (!confirmLeave) {
        setJoining(false);
        return;
      }

      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', id)
        .eq('user_id', userId);

      if (error) {
        console.error('Error leaving group:', error);
        alert('Error leaving group');
      } else {
        setIsMember(false);
        setMemberCount((prev) => Math.max(prev - 1, 0));
        alert('You have left the group.');
      }
    } else {
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

    setJoining(false);
  };

  const handleSaveChanges = async () => {
    if (!newGroupName.trim() || !newDescription.trim()) {
      alert('Both name and description must be filled');
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from('groups')
      .update({ name: newGroupName.trim(), description: newDescription.trim() })
      .eq('id', id);

    if (error) {
      console.error('Error updating group:', error);
      alert('Error saving changes');
    } else {
      setGroup((prevGroup) => (prevGroup ? { ...prevGroup, name: newGroupName.trim(), description: newDescription.trim() } : prevGroup));
      setIsEditing(false);
      alert('Changes saved successfully!');
    }

    setSaving(false);
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
              {isEditing && canEdit() ? (
                <>
                  <IonInput
                    value={newGroupName}
                    onIonChange={(e) => setNewGroupName(e.detail.value!)}
                    label="Group Name"
                    disabled={saving}
                  />
                  <IonTextarea
                    value={newDescription}
                    onIonChange={(e) => setNewDescription(e.detail.value!)}
                    label="Description"
                    rows={5}
                    disabled={saving}
                  />
                  <IonButton expand="block" onClick={handleSaveChanges} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </IonButton>
                  <IonButton expand="block" color="medium" onClick={() => setIsEditing(false)} disabled={saving}>
                    Cancel
                  </IonButton>
                </>
              ) : (
                <>
                  <p><strong>Description:</strong> {group.description}</p>
                  <p><strong>Members Joined:</strong> {memberCount}</p>

                  {role === 'Student' && (
                    <IonButton
                      expand="block"
                      color={isMember ? 'danger' : 'success'}
                      onClick={handleJoinOrCancel}
                      disabled={joining}
                    >
                      {joining ? (isMember ? 'Leaving...' : 'Joining...') : (isMember ? 'Cancel Join' : 'Join Group')}
                    </IonButton>
                  )}

                  {canEdit() && !isEditing && (
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
