import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiUtils from '../../utils/apiUtils';

// Async thunks para obtener productos
export const fetchBooks = createAsyncThunk(
  'products/fetchBooks',
  async ({ isAdmin = false, activeOnly = true } = {}, { rejectWithValue, getState }) => {
    try {
      console.log('Fetching books with params:', { isAdmin, activeOnly });
      
      // Delay obligatorio de 1.5 segundos para mostrar animación de carga
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const data = await apiUtils.getBooks({ isAdmin, activeOnly });
      console.log('Books fetched successfully:', data?.length || 0, 'items');
      return data || [];
    } catch (error) {
      console.error('Error fetching books:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAlbums = createAsyncThunk(
  'products/fetchAlbums',
  async ({ isAdmin = false, activeOnly = true } = {}, { rejectWithValue, getState }) => {
    try {
      console.log('Fetching albums with params:', { isAdmin, activeOnly });
      
      // Delay obligatorio de 1.5 segundos para mostrar animación de carga
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const data = await apiUtils.getAlbums({ isAdmin, activeOnly });
      console.log('Albums fetched successfully:', data?.length || 0, 'items');
      return data || [];
    } catch (error) {
      console.error('Error fetching albums:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Función auxiliar para obtener géneros únicos
const getAllGenres = (products, genreKey) => {
  const genres = new Set();
  products.forEach(product => {
    const productGenres = product[genreKey] || [];
    productGenres.forEach(genre => genres.add(genre));
  });
  return Array.from(genres);
};

// Función auxiliar para filtrar productos
const filterProducts = (products, filters, genreKey) => {
  let filtered = [...products];

  if (filters.genre !== 'Todos') {
    filtered = filtered.filter(product => 
      (product[genreKey] || []).includes(filters.genre)
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
};

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    books: {
      data: [],
      filteredData: [],
      loading: false,
      error: null,
      genres: ['Todos'],
      filters: {
        genre: 'Todos',
        search: '',
        bestseller: false,
      },
      lastFetchParams: null, // Para evitar fetches innecesarios
    },
    albums: {
      data: [],
      filteredData: [],
      loading: false,
      error: null,
      genres: ['Todos'],
      filters: {
        genre: 'Todos',
        search: '',
        bestseller: false,
      },
      lastFetchParams: null, // Para evitar fetches innecesarios
    },
  },
  reducers: {
    // Filtros para libros
    setBooksFilter: (state, action) => {
      const { filterType, value } = action.payload;
      state.books.filters[filterType] = value;
      state.books.filteredData = filterProducts(
        state.books.data,
        state.books.filters,
        'genreBooks'
      );
    },
    resetBooksFilters: (state) => {
      state.books.filters = {
        genre: 'Todos',
        search: '',
        bestseller: false,
      };
      state.books.filteredData = [...state.books.data];
    },
    // Filtros para álbumes
    setAlbumsFilter: (state, action) => {
      const { filterType, value } = action.payload;
      state.albums.filters[filterType] = value;
      state.albums.filteredData = filterProducts(
        state.albums.data,
        state.albums.filters,
        'genres'
      );
    },
    resetAlbumsFilters: (state) => {
      state.albums.filters = {
        genre: 'Todos',
        search: '',
        bestseller: false,
      };
      state.albums.filteredData = [...state.albums.data];
    },
    // Invalidar caché para forzar refetch
    invalidateBooks: (state) => {
      state.books.data = [];
      state.books.filteredData = [];
      state.books.lastFetchParams = null;
    },
    invalidateAlbums: (state) => {
      state.albums.data = [];
      state.albums.filteredData = [];
      state.albums.lastFetchParams = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Casos para libros
      .addCase(fetchBooks.pending, (state) => {
        state.books.loading = true;
        state.books.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.books.loading = false;
        state.books.data = action.payload;
        state.books.filteredData = filterProducts(
          action.payload,
          state.books.filters,
          'genreBooks'
        );
        state.books.genres = ['Todos', ...getAllGenres(action.payload, 'genreBooks')];
        state.books.error = null;
        state.books.lastFetchParams = action.meta.arg;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.books.loading = false;
        state.books.error = action.payload;
        state.books.data = [];
        state.books.filteredData = [];
      })
      // Casos para álbumes
      .addCase(fetchAlbums.pending, (state) => {
        state.albums.loading = true;
        state.albums.error = null;
      })
      .addCase(fetchAlbums.fulfilled, (state, action) => {
        state.albums.loading = false;
        state.albums.data = action.payload;
        state.albums.filteredData = filterProducts(
          action.payload,
          state.albums.filters,
          'genres'
        );
        state.albums.genres = ['Todos', ...getAllGenres(action.payload, 'genres')];
        state.albums.error = null;
        state.albums.lastFetchParams = action.meta.arg;
      })
      .addCase(fetchAlbums.rejected, (state, action) => {
        state.albums.loading = false;
        state.albums.error = action.payload;
        state.albums.data = [];
        state.albums.filteredData = [];
      });
  },
});

export const {
  setBooksFilter,
  resetBooksFilters,
  setAlbumsFilter,
  resetAlbumsFilters,
  invalidateBooks,
  invalidateAlbums,
} = productsSlice.actions;

export default productsSlice.reducer;