import React, { useEffect, useCallback } from 'react';
import ProductCardBook from '../components/Book/ProductCardBook';
import ProductFilters from '../components/ProductFilters/ProductFilters';
import ProductGrid from '../components/ProductGrid/ProductGrid';
import ProductPageLayout from '../components/ProductPageLayout/ProductPageLayout';
import { useBooks } from '../hooks/useProducts';

const BooksPage = () => {
  // Usar el hook personalizado
  const {
    books,
    loading,
    error,
    genres,
    filters,
    fetchBooksData,
    forceFetchBooks,
    setFilter,
    isAdmin
  } = useBooks();

  // Fetch books cuando el componente se monta (solo una vez)
  useEffect(() => {
    fetchBooksData();
  }, [fetchBooksData]);

  // Handlers para filtros usando useCallback para evitar re-renders
  const handleGenreChange = useCallback((genre) => {
    setFilter('genre', genre);
  }, [setFilter]);

  const handleSearchChange = useCallback((search) => {
    setFilter('search', search);
  }, [setFilter]);

  const handleBestsellerChange = useCallback((bestseller) => {
    setFilter('bestseller', bestseller);
  }, [setFilter]);

  const handleRetry = useCallback(() => {
    forceFetchBooks();
  }, [forceFetchBooks]);

  // Handler para cambio de estado de productos
  const handleStatusChange = useCallback((id, newStatus) => {
    console.log('Status changed for book:', id, 'New status:', newStatus);
    // Refetch para actualizar la lista
    setTimeout(() => {
      forceFetchBooks();
    }, 500);
  }, [forceFetchBooks]);

  // Wrapper para ProductCardBook con callback
  const ProductCardBookWithCallback = useCallback((props) => {
    return (
      <ProductCardBook
        {...props}
        onStatusChange={handleStatusChange}
      />
    );
  }, [handleStatusChange]);

  return (
    <ProductPageLayout 
      title="Libros" 
      loading={loading} 
      error={error} 
      type="books"
      onRetry={handleRetry}
    >
      <ProductFilters
        filters={filters}
        genres={genres}
        onGenreChange={handleGenreChange}
        onSearchChange={handleSearchChange}
        onBestsellerChange={handleBestsellerChange}
        addRoute="/book-form"
        addButtonText="+ Agregar Libro"
      />
      <ProductGrid
        products={books}
        ProductCard={ProductCardBookWithCallback}
        emptyMessage="No se encontraron libros."
      />
    </ProductPageLayout>
  );
};

export default BooksPage;