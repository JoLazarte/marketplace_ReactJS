import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../hooks/useAuth';
import { getAdminStats } from '../../utils/apiUtils';

const AdminStats = () => {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!isAdmin()) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const result = await getAdminStats();
        setStats(result);
      } catch (err) {
        console.error('Error fetching admin stats:', err);
        setError('Error al cargar estadísticas');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isAdmin]);

  if (!isAdmin()) return null;

  if (loading) return (
    <StatsContainer>
      <h3>📊 Estadísticas de Administrador</h3>
      <p>Cargando estadísticas...</p>
    </StatsContainer>
  );

  if (error) return (
    <StatsContainer>
      <h3>📊 Estadísticas de Administrador</h3>
      <ErrorMessage>{error}</ErrorMessage>
    </StatsContainer>
  );

  if (!stats) return null;

  return (
    <StatsContainer>
      <h3>📊 Estadísticas de Administrador</h3>
      <StatsGrid>
        <StatCard>
          <StatNumber className="active">{stats.activeBooksCount || 0}</StatNumber>
          <StatLabel>Libros Activos</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber className="inactive">{stats.inactiveBooksCount || 0}</StatNumber>
          <StatLabel>Libros Inactivos</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber className="active">{stats.activeAlbumsCount || 0}</StatNumber>
          <StatLabel>Álbumes Activos</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber className="inactive">{stats.inactiveAlbumsCount || 0}</StatNumber>
          <StatLabel>Álbumes Inactivos</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber className="total">{(stats.activeBooksCount || 0) + (stats.activeAlbumsCount || 0)}</StatNumber>
          <StatLabel>Total Productos Activos</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber className="total">{(stats.inactiveBooksCount || 0) + (stats.inactiveAlbumsCount || 0)}</StatNumber>
          <StatLabel>Total Productos Inactivos</StatLabel>
        </StatCard>
      </StatsGrid>
    </StatsContainer>
  );
};

export default AdminStats;

const StatsContainer = styled.div`
  background: linear-gradient(135deg, rgba(26, 26, 26, 0.9) 0%, rgba(10, 10, 10, 0.9) 100%);
  border: 1px solid rgba(0, 255, 0, 0.2);
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);

  h3 {
    color: #00ff00;
    margin-bottom: 1rem;
    text-align: center;
    font-size: 1.3rem;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
`;

const StatCard = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 255, 0, 0.1);
  }
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;

  &.active {
    color: #00ff00;
  }

  &.inactive {
    color: #ff6b00;
  }

  &.total {
    color: #ffffff;
  }
`;

const StatLabel = styled.div`
  color: #bdbdbd;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ErrorMessage = styled.div`
  color: #ff3b3b;
  text-align: center;
  padding: 1rem;
  background: rgba(255, 59, 59, 0.1);
  border-radius: 5px;
  border: 1px solid rgba(255, 59, 59, 0.3);
`;