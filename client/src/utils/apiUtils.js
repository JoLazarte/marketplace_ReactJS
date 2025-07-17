// Funciones utilitarias para manejo de errores y comunicación con la API

// Función para obtener el token desde Redux
let getTokenFromRedux = null;

// Función para configurar el getter del token
export const configureTokenGetter = (tokenGetter) => {
  getTokenFromRedux = tokenGetter;
};

// Función para obtener el token (desde Redux si está disponible, sino desde localStorage como fallback)
const getToken = () => {
  if (getTokenFromRedux) {
    return getTokenFromRedux();
  }
  // Si no existe en Redux, retornamos null o una cadena vacía
  return null;
};

const apiUtils = {
  // Función fetch mejorada con manejo robusto de errores
  async fetchWithErrorHandling(url, options = {}) {
    try {
      const response = await fetch(url, options);
      
      // Clonamos la respuesta para poder leerla múltiples veces
      const responseClone = response.clone();
      
      // Primero intentamos leer como texto
      const responseText = await responseClone.text();
      
      // Si no hay contenido, manejamos según el caso
      if (!responseText) {
        if (response.ok) {
          return { ok: true, data: null, status: response.status };
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }
      
      // Intentamos parsear como JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        // Si no es JSON pero la respuesta es exitosa, devolvemos el texto
        if (response.ok) {
          return { ok: true, data: responseText, status: response.status };
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}\nResponse: ${responseText}`);
        }
      }
      
      // Verificamos si la respuesta indica éxito
      if (!response.ok) {
        const errorMessage = data?.message || data?.error || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }
      
      return { ok: true, data, status: response.status };
      
    } catch (error) {
      throw error;
    }
  },

  // Obtener todos los libros con filtros opcionales
  async getBooks(options = {}) {
    const { 
      isAdmin = false, 
      activeOnly = true, 
      author = null, 
      page = 0, 
      size = 10 
    } = options;
    
    let url = `http://localhost:8080/books?activeOnly=${activeOnly}`;
    if (author) url += `&author=${encodeURIComponent(author)}`;
    url += `&page=${page}&size=${size}`;
    
    const token = getToken();
    const result = await this.fetchWithErrorHandling(url, {
      headers: {
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });
    
    // Manejamos respuesta paginada del backend
    if (result.data && result.data.content && Array.isArray(result.data.content)) {
      return result.data.content;
    }
    
    return result.data;
  },

  // Obtener todos los álbumes con filtros opcionales
  async getAlbums(options = {}) {
    const { 
      isAdmin = false, 
      activeOnly = true, 
      author = null, 
      page = 0, 
      size = 10 
    } = options;
    
    let url = `http://localhost:8080/musicAlbums?activeOnly=${activeOnly}`;
    if (author) url += `&author=${encodeURIComponent(author)}`;
    url += `&page=${page}&size=${size}`;
    
    const token = getToken();
    const result = await this.fetchWithErrorHandling(url, {
      headers: {
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });
    
    // Manejamos respuesta paginada del backend
    if (result.data && result.data.content && Array.isArray(result.data.content)) {
      return result.data.content;
    }
    
    return result.data;
  },

  // Crear un nuevo libro
  async createBook(bookData) {
    const token = getToken();
    
    const result = await this.fetchWithErrorHandling('http://localhost:8080/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(bookData)
    });
    
    return result.data;
  },

  // Actualizar un libro existente
  async updateBook(bookData) {
    const token = getToken();
    
    const result = await this.fetchWithErrorHandling('http://localhost:8080/books', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(bookData)
    });
    
    // Manejamos respuesta envuelta (update devuelve {ok: true, data: book})
    if (result.data && typeof result.data === 'object' && 'data' in result.data) {
      return result.data.data;
    }
    
    return result.data;
  },

  // Cambiar estado activo/inactivo de un libro
  async toggleBookStatus(bookId, newStatus) {
    const token = getToken();
    
    try {
      const result = await this.fetchWithErrorHandling(`http://localhost:8080/admin/books/${bookId}/toggle-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ active: newStatus })
      });
      
      return { success: true, data: result.data };
    } catch (error) {
      console.error('Error toggling book status:', error);
      return { success: false, error: error.message };
    }
  },

  // Obtener un libro por ID
  async getBook(bookId, isAdmin = false) {
    let url;
    if (isAdmin) {
      url = `http://localhost:8080/books/${bookId}?activeOnly=false`;
    } else {
      url = `http://localhost:8080/books/${bookId}?activeOnly=true`;
    }
    
    const token = getToken();
    const result = await this.fetchWithErrorHandling(url, {
      headers: {
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });
    
    // Manejamos tanto respuestas directas como envueltas
    if (result.data && typeof result.data === 'object') {
      // Si la respuesta tiene estructura anidada como {ok: true, data: book}
      if ('data' in result.data) {
        return result.data.data;
      }
      // Si la respuesta son datos directos del libro
      return result.data;
    }
    
    return result.data;
  },

  // Crear un nuevo álbum
  async createAlbum(albumData) {
    const token = getToken();
    
    const result = await this.fetchWithErrorHandling('http://localhost:8080/musicAlbums', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(albumData)
    });
    
    return result.data;
  },

  // Actualizar un álbum existente
  async updateAlbum(albumData) {
    const token = getToken();
    
    const result = await this.fetchWithErrorHandling('http://localhost:8080/musicAlbums', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(albumData)
    });
    
    // Manejamos respuesta envuelta (update devuelve {ok: true, data: album})
    if (result.data && typeof result.data === 'object' && 'data' in result.data) {
      return result.data.data;
    }
    
    return result.data;
  },

  // Cambiar estado activo/inactivo de un álbum
  async toggleAlbumStatus(albumId, newStatus) {
    const token = getToken();
    
    try {
      const result = await this.fetchWithErrorHandling(`http://localhost:8080/admin/musicAlbums/${albumId}/toggle-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ active: newStatus })
      });
      
      return { success: true, data: result.data };
    } catch (error) {
      console.error('Error toggling album status:', error);
      return { success: false, error: error.message };
    }
  },

  // Obtener un álbum por ID
  async getAlbum(albumId, isAdmin = false) {
    let url;
    if (isAdmin) {
      url = `http://localhost:8080/musicAlbums/${albumId}?activeOnly=false`;
    } else {
      url = `http://localhost:8080/musicAlbums/${albumId}?activeOnly=true`;
    }
    
    const token = getToken();
    const result = await this.fetchWithErrorHandling(url, {
      headers: {
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });
    
    // Manejamos tanto respuestas directas como envueltas
    if (result.data && typeof result.data === 'object') {
      // Si la respuesta tiene estructura anidada como {ok: true, data: album}
      if ('data' in result.data) {
        return result.data.data;
      }
      // Si la respuesta son datos directos del álbum
      return result.data;
    }
    
    return result.data;
  },

  // Obtener estadísticas de administrador
  async getAdminStats() {
    const token = getToken();
    
    const result = await this.fetchWithErrorHandling('http://localhost:8080/admin/stats', {
      headers: {
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });
    
    return result.data;
  },

  // Validar datos de libro antes del envío
  validateBookData(bookData) {
    const errors = {};
    
    if (!bookData.title?.trim()) errors.title = 'El título es obligatorio';
    if (!bookData.author?.trim()) errors.author = 'El autor es obligatorio';
    if (!bookData.editorial?.trim()) errors.editorial = 'La editorial es obligatoria';
    if (!bookData.description?.trim()) errors.description = 'La descripción es obligatoria';
    if (!bookData.isbn?.trim()) errors.isbn = 'El ISBN es obligatorio';
    if (!bookData.genreBooks?.length) errors.genreBooks = 'Selecciona al menos un género';
    if (!bookData.price || isNaN(bookData.price) || Number(bookData.price) <= 0) errors.price = 'Precio inválido';
    if (bookData.stock === undefined || bookData.stock === null || isNaN(bookData.stock) || Number(bookData.stock) < 0) errors.stock = 'Stock inválido';
    if (!bookData.urlImage?.trim() || !/^https?:\/\/.+\..+/.test(bookData.urlImage)) errors.urlImage = 'URL de imagen inválida';
    
    // Validaciones de descuento
    if (bookData.discountPercentage && (isNaN(bookData.discountPercentage) || Number(bookData.discountPercentage) < 0 || Number(bookData.discountPercentage) > 90)) {
      errors.discountPercentage = 'El descuento debe estar entre 0% y 90%';
    }
    
    return errors;
  },

  // Validar datos de álbum antes del envío
  validateAlbumData(albumData) {
    const errors = {};
    
    if (!albumData.title?.trim()) errors.title = 'El título es obligatorio';
    if (!albumData.author?.trim()) errors.author = 'El artista es obligatorio';
    if (!albumData.recordLabel?.trim()) errors.recordLabel = 'La discográfica es obligatoria';
    if (!albumData.description?.trim()) errors.description = 'La descripción es obligatoria';
    if (!albumData.isrc?.trim()) errors.isrc = 'El ISRC es obligatorio';
    if (!albumData.genres?.length) errors.genres = 'Selecciona al menos un género';
    if (!albumData.price || isNaN(albumData.price) || Number(albumData.price) <= 0) errors.price = 'Precio inválido';
    if (albumData.stock === undefined || albumData.stock === null || isNaN(albumData.stock) || Number(albumData.stock) < 0) errors.stock = 'Stock inválido';
    if (!albumData.urlImage?.trim() || !/^https?:\/\/.+\..+/.test(albumData.urlImage)) errors.urlImage = 'URL de imagen inválida';
    if (!albumData.year || isNaN(albumData.year) || Number(albumData.year) < 1000 || Number(albumData.year) > new Date().getFullYear() + 1) errors.year = 'Año inválido';
    
    // Validaciones de descuento
    if (albumData.discountPercentage && (isNaN(albumData.discountPercentage) || Number(albumData.discountPercentage) < 0 || Number(albumData.discountPercentage) > 90)) {
      errors.discountPercentage = 'El descuento debe estar entre 0% y 90%';
    }
    
    return errors;
  },

  // Formatear datos de libro para la API
  formatBookData(formData) {
    return {
      ...(formData.id && { id: formData.id }),
      title: formData.title.trim(),
      author: formData.author.trim(),
      editorial: formData.editorial.trim(),
      description: formData.description.trim(),
      isbn: formData.isbn.trim(),
      genreBooks: formData.genreBooks,
      price: Number(formData.price),
      stock: Number(formData.stock),
      urlImage: formData.urlImage.trim(),
      ...(formData.active !== undefined && { active: formData.active }),
      discountPercentage: Number(formData.discountPercentage) || 0,
      discountActive: Boolean(formData.discountActive)
    };
  },

  // Formatear datos de álbum para la API
  formatAlbumData(formData) {
    return {
      ...(formData.id && { id: formData.id }),
      title: formData.title.trim(),
      author: formData.author.trim(),
      recordLabel: formData.recordLabel.trim(),
      year: Number(formData.year),
      description: formData.description.trim(),
      isrc: formData.isrc.trim(),
      genres: formData.genres,
      price: Number(formData.price),
      stock: Number(formData.stock),
      urlImage: formData.urlImage.trim(),
      ...(formData.active !== undefined && { active: formData.active }),
      discountPercentage: Number(formData.discountPercentage) || 0,
      discountActive: Boolean(formData.discountActive)
    };
  },
};

export default apiUtils;

// Exportar funciones específicas para importación más fácil
export const fetchWithErrorHandling = apiUtils.fetchWithErrorHandling.bind(apiUtils);
export const getBooks = apiUtils.getBooks.bind(apiUtils);
export const getAlbums = apiUtils.getAlbums.bind(apiUtils);
export const getBook = apiUtils.getBook.bind(apiUtils);
export const getAlbum = apiUtils.getAlbum.bind(apiUtils);
export const createBook = apiUtils.createBook.bind(apiUtils);
export const updateBook = apiUtils.updateBook.bind(apiUtils);
export const createAlbum = apiUtils.createAlbum.bind(apiUtils);
export const updateAlbum = apiUtils.updateAlbum.bind(apiUtils);
export const toggleBookStatus = apiUtils.toggleBookStatus.bind(apiUtils);
export const toggleAlbumStatus = apiUtils.toggleAlbumStatus.bind(apiUtils);
export const getAdminStats = apiUtils.getAdminStats.bind(apiUtils);
export const validateBookData = apiUtils.validateBookData.bind(apiUtils);
export const validateAlbumData = apiUtils.validateAlbumData.bind(apiUtils);
export const formatBookData = apiUtils.formatBookData.bind(apiUtils);
export const formatAlbumData = apiUtils.formatAlbumData.bind(apiUtils);