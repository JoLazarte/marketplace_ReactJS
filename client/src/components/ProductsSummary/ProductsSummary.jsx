import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { fetchBooks, fetchAlbums } from '../store/slices/productsSlice';
import { selectBooks, selectAlbums } from '../store/selectors/productsSelectors';

const ProductsSummary = () => {
  const dispatch = useDispatch();
  const books = useSelector(selectBooks);
  const albums = useSelector(selectAlbums);

  useEffect(() => {
    // Cargar datos si no están disponibles
    if (books.length === 0) {
      dispatch(fetchBooks());
    }
    if (albums.length === 0) {
      dispatch(fetchAlbums());
    }
  }, [dispatch, books.length, albums.length]);

  const totalProducts = books.length + albums.length;
  const totalBooksValue = books.reduce((sum, book) => sum + (book.price || 0), 0);
  const totalAlbumsValue = albums.reduce((sum, album) => sum + (album.price || 0), 0);

  return (
    <SummaryContainer>
      <Title>Resumen de Productos</Title>
      <StatsGrid>
        <StatCard>
          <StatNumber>{books.length}</StatNumber>
          <StatLabel>Libros</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{albums.length}</StatNumber>
          <StatLabel>Álbumes</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{totalProducts}</StatNumber>
          <StatLabel>Total Productos</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>${(totalBooksValue + totalAlbumsValue).toFixed(2)}</StatNumber>
          <StatLabel>Valor Total</StatLabel>
        </StatCard>
      </StatsGrid>
    </SummaryContainer>
  );
};

const SummaryContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 2rem;
  margin: 2rem 0;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const Title = styled.h2`
  color: #fff;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const StatCard = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #01be96;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #bdbdbd;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export default ProductsSummary;