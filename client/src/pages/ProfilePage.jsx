import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const ProfilePage = () => {
  const { isAuthenticated, user, token } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [changedFields, setChangedFields] = useState([]);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || ''
      });
    }
  }, [user]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!user) {
    return <div>Cargando...</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Registrar campos modificados
    if (value !== user[name] && !changedFields.includes(name)) {
      setChangedFields([...changedFields, name]);
    } else if (value === user[name] && changedFields.includes(name)) {
      setChangedFields(changedFields.filter(field => field !== name));
    }
  };

  const updateProfile = async () => {
    setError('');
    setSuccess('');

    // Excluimos el username de los datos a actualizar
    const { username, ...dataToUpdate } = formData;

    try {
      const response = await fetch('http://localhost:8080/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...dataToUpdate,
          password: "null"
        })
      });

      const data = await response.json();
      
      if (data.ok) {
        setSuccess('¡Perfil actualizado correctamente!');
        setIsEditing(false);
        setChangedFields([]);
      } else {
        setError(data.error || 'Error al actualizar el perfil');
      }
    } catch (error) {
      setError('Error de conexión. Por favor, intenta más tarde.');
    }
  };

  const startEditing = () => {
    setIsEditing(true);
    setFormData({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    });
    setChangedFields([]);
    setError('');
    setSuccess('');
  };

  return (
    <Container>
      <Card>
        <HeaderSection>
          <Title>Mi Perfil</Title>
          <EditButton onClick={isEditing ? () => setIsEditing(false) : startEditing}>
            {isEditing ? 'Cancelar' : 'Editar Perfil'}
          </EditButton>
        </HeaderSection>
        <Content>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}

          {isEditing && changedFields.length > 0 && (
            <ChangeSummary>
              <h3>Campos que se modificarán:</h3>
              <ul>
                {changedFields.map(field => (
                  <li key={field}>
                    {field === 'firstName' && 'Nombre'}
                    {field === 'lastName' && 'Apellido'}
                    {field === 'email' && 'Email'}
                    {field === 'username' && 'Nombre de usuario'}
                  </li>
                ))}
              </ul>
            </ChangeSummary>
          )}

          {isEditing ? (
            <Form>
              <InfoGroup>
                <Label>Nombre de usuario</Label>
                <Input
                  name="username"
                  value={formData.username}
                  disabled
                  style={{
                    backgroundColor: '#2a2a2a',
                    cursor: 'not-allowed',
                    opacity: 0.7
                  }}
                  placeholder="Nombre de usuario"
                />
                <small style={{ color: '#666', marginTop: '0.5rem', fontSize: '0.8rem' }}>
                  El nombre de usuario no se puede modificar
                </small>
              </InfoGroup>
              
              <InfoGroup>
                <Label>Nombre</Label>
                <Input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Nombre"
                />
              </InfoGroup>

              <InfoGroup>
                <Label>Apellido</Label>
                <Input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Apellido"
                />
              </InfoGroup>

              <InfoGroup>
                <Label>Email</Label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                />
              </InfoGroup>

              <SaveButton onClick={updateProfile}>
                Guardar Cambios
              </SaveButton>
            </Form>
          ) : (
            <>
              <InfoGroup>
                <Label>Nombre de usuario</Label>
                <Value>{user.username}</Value>
              </InfoGroup>
              
              <InfoGroup>
                <Label>Nombre</Label>
                <Value>{user.firstName}</Value>
              </InfoGroup>

              <InfoGroup>
                <Label>Apellido</Label>
                <Value>{user.lastName}</Value>
              </InfoGroup>

              <InfoGroup>
                <Label>Email</Label>
                <Value>{user.email}</Value>
              </InfoGroup>
            </>
          )}
        </Content>
      </Card>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #1a1a1a;
  padding: 2rem;
  padding-top: 7rem;
`;

const Card = styled.div`
  background: #242424;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 500px;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #ffffff;
  font-size: 2rem;
  margin: 0;
`;

const ChangeSummary = styled.div`
  background: rgba(0, 255, 200, 0.1);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  color: #00ffeaff;

  h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
  }

  ul {
    margin: 0;
    padding-left: 1.5rem;
  }

  li {
    margin: 0.2rem 0;
  }
`;

const EditButton = styled.button`
  background: linear-gradient(135deg, #1a1a1a 0%, #333333 100%);
  color: #00ffeaff;
  border: 1px solid #404040;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 255, 191, 0.2);
    border-color: #00ffeaff;
  }

  &:active {
    transform: translateY(0);
  }
`;

const SaveButton = styled(EditButton)`
  width: 100%;
  margin-top: 1rem;
  padding: 0.75rem;
`;

const Content = styled.div`
  color: #ffffff;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InfoGroup = styled.div`
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #333;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const Label = styled.p`
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const Value = styled.p`
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid #404040;
  background-color: #333333;
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #00ffeaff;
    box-shadow: 0 0 0 2px rgba(0, 255, 191, 0.1);
  }

  &::placeholder {
    color: #666666;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  text-align: center;
  padding: 0.75rem;
  margin-bottom: 1rem;
  background-color: rgba(255, 68, 68, 0.1);
  border-radius: 8px;
`;

const SuccessMessage = styled.div`
  color: #00ffeaff;
  text-align: center;
  padding: 0.75rem;
  margin-bottom: 1rem;
  background-color: rgba(0, 255, 170, 0.1);
  border-radius: 8px;
`;

export default ProfilePage; 