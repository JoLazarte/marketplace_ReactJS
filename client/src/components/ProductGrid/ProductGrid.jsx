import React from 'react';
import styled from 'styled-components';

const ProductGrid = ({ products, ProductCard, emptyMessage = "No se encontraron productos." }) => {
  return (
    <Grid>
      {products.length === 0 ? (
        <Empty>{emptyMessage}</Empty>
      ) : (
        products
          .filter(product => product && product.id)
          .map(product => (
            <ProductCard key={product.id} item={product} />
          ))
      )}
    </Grid>
  );
};

// Styled Components
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 2rem;
`;

const Empty = styled.div`
  color: #888;
  font-size: 1.2rem;
  grid-column: 1/-1;
  text-align: center;
  margin-top: 2rem;
`;

export default ProductGrid;