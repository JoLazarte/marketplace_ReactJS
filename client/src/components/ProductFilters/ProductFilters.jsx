import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProductFilters = ({ 
  filters, 
  genres, 
  onGenreChange, 
  onSearchChange, 
  onBestsellerChange, 
  addRoute,
  addButtonText 
}) => {
  const navigate = useNavigate();
  const { canEditProducts } = useAuth();

  return (
    <BarraFiltros>
      <Filtros>
        <SearchInput
          type="text"
          placeholder="Buscar por título, autor o artista..."
          value={filters.search}
          onChange={e => onSearchChange(e.target.value)}
        />
        <CheckboxLabel>
          <input
            type="checkbox"
            checked={filters.bestseller}
            onChange={e => onBestsellerChange(e.target.checked)}
          />
          Más vendidos
        </CheckboxLabel>
        <Select value={filters.genre} onChange={e => onGenreChange(e.target.value)}>
          {genres.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </Select>
      </Filtros>
      {canEditProducts && canEditProducts() && (
        <AddButton onClick={() => navigate(addRoute)}>
          {addButtonText}
        </AddButton>
      )}
    </BarraFiltros>
  );
};

// Styled Components
const BarraFiltros = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem 2rem;
  background: rgba(20, 20, 20, 0.8);
  backdrop-filter: blur(15px);
  border-radius: 16px;
  border: 1px solid rgba(0, 255, 0, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
`;

const Filtros = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }
`;

const SearchInput = styled.input`
  background: rgba(40, 40, 40, 0.7);
  backdrop-filter: blur(10px);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 0.8rem 1rem;
  font-size: 1rem;
  width: 280px;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
  
  &:focus {
    outline: none;
    border-color: rgba(0, 255, 0, 0.5);
    box-shadow: 0 0 0 2px rgba(0, 255, 0, 0.2);
    background: rgba(40, 40, 40, 0.9);
  }
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #ffffff;
  font-size: 0.95rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 255, 0, 0.1);
  }
  
  input[type="checkbox"] {
    width: 1.2rem;
    height: 1.2rem;
    accent-color: #00ff00;
    cursor: pointer;
  }
`;

const Select = styled.select`
  background: rgba(40, 40, 40, 0.7);
  backdrop-filter: blur(10px);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 0.8rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: rgba(0, 255, 0, 0.5);
    box-shadow: 0 0 0 2px rgba(0, 255, 0, 0.2);
    background: rgba(40, 40, 40, 0.9);
  }
  
  option {
    background: #2a2a2a;
    color: #ffffff;
  }
`;

const AddButton = styled.button`
  background: linear-gradient(135deg, #00ff00 0%, #00cc00 100%);
  color: #000000;
  border: none;
  border-radius: 12px;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: 700;
  box-shadow: 0 4px 16px rgba(0, 255, 0, 0.3);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover::before {
    left: 100%;
  }
  
  &:hover {
    background: linear-gradient(135deg, #00cc00 0%, #00aa00 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(0, 255, 0, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

export default ProductFilters;