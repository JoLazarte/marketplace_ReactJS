import { createSelector } from '@reduxjs/toolkit';

// Selectores básicos para libros
export const selectBooksState = (state) => state.products.books;
export const selectBooks = (state) => state.products.books.data;
export const selectBooksLoading = (state) => state.products.books.loading;
export const selectBooksError = (state) => state.products.books.error;
export const selectBooksGenres = (state) => state.products.books.genres;
export const selectBooksFilters = (state) => state.products.books.filters;

// Selectores básicos para álbumes
export const selectAlbumsState = (state) => state.products.albums;
export const selectAlbums = (state) => state.products.albums.data;
export const selectAlbumsLoading = (state) => state.products.albums.loading;
export const selectAlbumsError = (state) => state.products.albums.error;
export const selectAlbumsGenres = (state) => state.products.albums.genres;
export const selectAlbumsFilters = (state) => state.products.albums.filters;

// Selectores para productos filtrados
export const selectFilteredBooks = createSelector(
  [selectBooks, selectBooksFilters],
  (books, filters) => {
    let filtered = [...books];

    if (filters.genre !== 'Todos') {
      filtered = filtered.filter(product => 
        (product.genreBooks || []).includes(filters.genre)
      );
    }

    if (filters.search.trim() !== '') {
      filtered = filtered.filter(product => {
        const titleMatch = product.title?.toLowerCase().includes(filters.search.toLowerCase());
        const authorMatch = product.author?.toLowerCase().includes(filters.search.toLowerCase());
        return titleMatch || authorMatch;
      });
    }

    if (filters.bestseller) {
      filtered = filtered.sort((a, b) => a.id - b.id).slice(0, 3);
    }

    return filtered;
  }
);

export const selectFilteredAlbums = createSelector(
  [selectAlbums, selectAlbumsFilters],
  (albums, filters) => {
    let filtered = [...albums];

    if (filters.genre !== 'Todos') {
      filtered = filtered.filter(product => 
        (product.genres || []).includes(filters.genre)
      );
    }

    if (filters.search.trim() !== '') {
      filtered = filtered.filter(product => {
        const titleMatch = product.title?.toLowerCase().includes(filters.search.toLowerCase());
        const authorMatch = product.author?.toLowerCase().includes(filters.search.toLowerCase());
        const artistMatch = product.artist?.toLowerCase().includes(filters.search.toLowerCase());
        return titleMatch || authorMatch || artistMatch;
      });
    }

    if (filters.bestseller) {
      filtered = filtered.sort((a, b) => a.id - b.id).slice(0, 3);
    }

    return filtered;
  }
);