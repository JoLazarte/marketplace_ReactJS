import React, { useEffect, useCallback } from 'react';
import ProductCardDiscs from '../components/Disco/ProductCardDiscs';
import ProductFilters from '../components/ProductFilters/ProductFilters';
import ProductGrid from '../components/ProductGrid/ProductGrid';
import ProductPageLayout from '../components/ProductPageLayout/ProductPageLayout';
import { useAlbums } from '../hooks/useProducts';

const AlbumsPage = () => {
  // Usar el hook personalizado
  const {
    albums,
    loading,
    error,
    genres,
    filters,
    fetchAlbumsData,
    forceFetchAlbums,
    setFilter,
    isAdmin
  } = useAlbums();

  // Fetch albums cuando el componente se monta (solo una vez)
  useEffect(() => {
    fetchAlbumsData();
  }, [fetchAlbumsData]);

  //Handlers para filtros usando useCallback para evitar re-renders
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
    forceFetchAlbums();
  }, [forceFetchAlbums]);

  // Handler para cambio de estado de productos
  const handleStatusChange = useCallback((id, newStatus) => {
    console.log('Status changed for album:', id, 'New status:', newStatus);
    // Refetch para actualizar la lista
    setTimeout(() => {
      forceFetchAlbums();
    }, 500);
  }, [forceFetchAlbums]);

  // Wrapper para ProductCardDiscs con callback
  const ProductCardDiscsWithCallback = useCallback((props) => {
    return (
      <ProductCardDiscs
        {...props}
        onStatusChange={handleStatusChange}
      />
    );
  }, [handleStatusChange]);

  return (
    <ProductPageLayout 
      title="Álbumes" 
      loading={loading} 
      error={error} 
      type="albums"
      onRetry={handleRetry}
    >
      <ProductFilters
        filters={filters}
        genres={genres}
        onGenreChange={handleGenreChange}
        onSearchChange={handleSearchChange}
        onBestsellerChange={handleBestsellerChange}
        addRoute="/album-form"
        addButtonText="+ Agregar Álbum"
      />
      <ProductGrid
        products={albums}
        ProductCard={ProductCardDiscsWithCallback}
        emptyMessage="No se encontraron álbumes."
      />
    </ProductPageLayout>
  );
};

export default AlbumsPage;