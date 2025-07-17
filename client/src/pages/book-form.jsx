import React, { useState, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { invalidateBooks } from '../store/slices/productsSlice';
import apiUtils from '../utils/apiUtils';

// Enum de géneros según tu backend (ajusta si es necesario)
const GENRE_BOOKS = [
  "FANTASY", "FAIRY_TALE", "FICCION", "FABLE", "VERSE", "FOLKLORE", "HISTORICAL", "THRILLER", "HORROR",
  "ADVENTURE", "ROMANCE", "DRAMA", "LGBTQ", "ADULT", "CHILDREN", "YOUNG", "CLASSIC", "EPIC", "METAFICTION",
  "PHILOSOPHICAL", "POSTMODERN", "RELIGIOUS", "MAGICALREALISM", "SATIRE", "POLITICAL", "EROTIC", "WESTERN",
  "URBAN", "COMEDY", "PARODY", "DARK_COMEDY", "DYSTOPIA", "SCI_FI", "SURREAL", "TALE", "TRAGICOMEDY", "CRIME",
  "MANGA", "COMIC", "SUPERNATURAL", "PSYCHOLOGICAL", "ACADEMIC", "BIOGRAPHY", "BIBLIOGRAPHY", "COOKBOOK",
  "JOURNALISTIC", "ART", "ANTINOVEL"
];

const API_URL = 'http://localhost:8080/books';

const BookForm = () => {
  const [form, setForm] = useState({
    title: '',
    author: '',
    editorial: '',
    description: '',
    isbn: '',
    genreBooks: [],
    price: '',
    stock: '',
    urlImage: '',
    active: true,
    discountPercentage: 0,
    discountActive: false
  });
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Refs para scroll automático a errores
  const refs = {
    title: useRef(null),
    author: useRef(null),
    editorial: useRef(null),
    description: useRef(null),
    isbn: useRef(null),
    genreBooks: useRef(null),
    price: useRef(null),
    stock: useRef(null),
    urlImage: useRef(null),
    discountPercentage: useRef(null)
  };

  // Validación de campos
  const validate = (fields = form) => {
    const newErrors = {};
    if (!fields.title.trim()) newErrors.title = 'El título es obligatorio';
    if (!fields.author.trim()) newErrors.author = 'El autor es obligatorio';
    if (!fields.editorial.trim()) newErrors.editorial = 'La editorial es obligatoria';
    if (!fields.description.trim()) newErrors.description = 'La descripción es obligatoria';
    if (!fields.isbn.trim()) newErrors.isbn = 'El ISBN es obligatorio';
    if (!fields.genreBooks.length) newErrors.genreBooks = 'Selecciona al menos un género';
    if (!fields.price || isNaN(fields.price) || Number(fields.price) <= 0) newErrors.price = 'Precio inválido';
    if (!fields.stock || isNaN(fields.stock) || Number(fields.stock) < 0) newErrors.stock = 'Stock inválido';
    if (!fields.urlImage.trim() || !/^https?:\/\/.+\..+/.test(fields.urlImage)) newErrors.urlImage = 'URL de imagen inválida';
    
    // Validaciones de descuento
    if (fields.discountPercentage && (isNaN(fields.discountPercentage) || Number(fields.discountPercentage) < 0 || Number(fields.discountPercentage) > 90)) {
      newErrors.discountPercentage = 'El descuento debe estar entre 0% y 90%';
    }
    
    return newErrors;
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setForm(prev => ({ ...prev, [name]: newValue }));
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(validate({ ...form, [name]: newValue }));
    
    // Alert para descuentos altos
    if (name === 'discountPercentage' && Number(value) > 50) {
      toast.warning('⚠️ Descuento alto: ¿Estás seguro de aplicar más del 50%?', {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Manejo especial para géneros múltiples con checkboxes
  const handleGenreCheckbox = (e) => {
    const { value, checked } = e.target;
    let newGenres;
    if (checked) {
      newGenres = [...form.genreBooks, value];
    } else {
      newGenres = form.genreBooks.filter(g => g !== value);
    }
    setForm(prev => ({ ...prev, genreBooks: newGenres }));
    setTouched(prev => ({ ...prev, genreBooks: true }));
    setErrors(validate({ ...form, genreBooks: newGenres }));
  };

  const handleBlur = e => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
    setErrors(validate(form));
  };

  // POST: Enviar libro al backend
  const handleSubmit = async e => {
    e.preventDefault();
    
    const validationErrors = apiUtils.validateBookData(form);
    setErrors(validationErrors);
    setTouched({
      title: true, author: true, editorial: true, description: true,
      isbn: true, genreBooks: true, price: true, stock: true, urlImage: true
    });

    if (Object.keys(validationErrors).length === 0) {
      try {
        const bookData = apiUtils.formatBookData(form);
        console.log('Creating book with data:', bookData);
        
        const result = await apiUtils.createBook(bookData);
        console.log('Create result:', result);

        toast.success('¡Libro agregado correctamente! 📚', {
          position: "top-right",
          autoClose: 3000,
        });
        
        // Invalidar caché para forzar recarga
        dispatch(invalidateBooks());
        
        // Emitir evento global para actualizar carrouseles
        window.dispatchEvent(new CustomEvent('productUpdate', {
          detail: { productType: 'book', action: 'create' }
        }));
        
        navigate('/books');
      } catch (err) {
        console.error('Error creating book:', err);
        toast.error(`Error al agregar el libro: ${err.message}`, {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } else {
      setShake(true);
      const firstErrorField = [
        'title', 'author', 'editorial', 'description', 'isbn', 'genreBooks', 'price', 'stock', 'urlImage'
      ].find(field => validationErrors[field]);
      
      if (firstErrorField && refs[firstErrorField].current) {
        refs[firstErrorField].current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        refs[firstErrorField].current.focus?.();
      }
      setTimeout(() => setShake(false), 600);
    }
  };

  return (
    <Bg>
      <Wrapper>
        <Title>Agregar Libro</Title>
        <Form onSubmit={handleSubmit} noValidate $shake={shake}>
          <InputGroup ref={refs.title}>
            <Label>Título</Label>
            <Input
              name="title"
              value={form.title}
              onChange={handleChange}
              onBlur={handleBlur}
              $active={touched.title && form.title}
              $error={errors.title}
              required
              placeholder="Título del libro"
            />
            {touched.title && errors.title && <ErrorMsg>{errors.title}</ErrorMsg>}
          </InputGroup>
          <InputGroup ref={refs.author}>
            <Label>Autor</Label>
            <Input
              name="author"
              value={form.author}
              onChange={handleChange}
              onBlur={handleBlur}
              $active={touched.author && form.author}
              $error={errors.author}
              required
              placeholder="Nombre del autor"
            />
            {touched.author && errors.author && <ErrorMsg>{errors.author}</ErrorMsg>}
          </InputGroup>
          <InputGroup ref={refs.editorial}>
            <Label>Editorial</Label>
            <Input
              name="editorial"
              value={form.editorial}
              onChange={handleChange}
              onBlur={handleBlur}
              $active={touched.editorial && form.editorial}
              $error={errors.editorial}
              required
              placeholder="Editorial"
            />
            {touched.editorial && errors.editorial && <ErrorMsg>{errors.editorial}</ErrorMsg>}
          </InputGroup>
          <InputGroup ref={refs.description}>
            <Label>Descripción</Label>
            <TextArea
              name="description"
              value={form.description}
              onChange={handleChange}
              onBlur={handleBlur}
              $active={touched.description && form.description}
              $error={errors.description}
              required
              placeholder="Descripción del libro"
              rows={3}
            />
            {touched.description && errors.description && <ErrorMsg>{errors.description}</ErrorMsg>}
          </InputGroup>
          <InputGroup ref={refs.isbn}>
            <Label>ISBN</Label>
            <Input
              name="isbn"
              value={form.isbn}
              onChange={handleChange}
              onBlur={handleBlur}
              $active={touched.isbn && form.isbn}
              $error={errors.isbn}
              required
              placeholder="Código ISBN"
            />
            {touched.isbn && errors.isbn && <ErrorMsg>{errors.isbn}</ErrorMsg>}
          </InputGroup>
          <InputGroup ref={refs.genreBooks}>
            <Label>Géneros</Label>
            <GenresBox $error={errors.genreBooks}>
              {GENRE_BOOKS.map(g => (
                <GenreCheckbox key={g}>
                  <input
                    type="checkbox"
                    value={g}
                    checked={form.genreBooks.includes(g)}
                    onChange={handleGenreCheckbox}
                  />
                  <span>{g}</span>
                </GenreCheckbox>
              ))}
            </GenresBox>
            {touched.genreBooks && errors.genreBooks && <ErrorMsg>{errors.genreBooks}</ErrorMsg>}
            <Hint>Puedes seleccionar más de un género</Hint>
          </InputGroup>
          <InputGroup ref={refs.price}>
            <Label>Precio</Label>
            <Input
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              onBlur={handleBlur}
              $active={touched.price && form.price}
              $error={errors.price}
              required
              placeholder="Precio"
            />
            {touched.price && errors.price && <ErrorMsg>{errors.price}</ErrorMsg>}
          </InputGroup>
          <InputGroup ref={refs.stock}>
            <Label>Stock</Label>
            <Input
              name="stock"
              type="number"
              min="0"
              value={form.stock}
              onChange={handleChange}
              onBlur={handleBlur}
              $active={touched.stock && form.stock}
              $error={errors.stock}
              required
              placeholder="Cantidad en stock"
            />
            {touched.stock && errors.stock && <ErrorMsg>{errors.stock}</ErrorMsg>}
          </InputGroup>
          <InputGroup ref={refs.urlImage}>
            <Label>URL de imagen</Label>
            <Input
              name="urlImage"
              value={form.urlImage}
              onChange={handleChange}
              onBlur={handleBlur}
              $active={touched.urlImage && form.urlImage}
              $error={errors.urlImage}
              required
              placeholder="https://..."
            />
            {touched.urlImage && errors.urlImage && <ErrorMsg>{errors.urlImage}</ErrorMsg>}
          </InputGroup>

          {/* Sección de Descuentos */}
          <DiscountSection>
            <DiscountTitle>🏷️ Configuración de Descuentos</DiscountTitle>
            
            <InputGroup ref={refs.discountPercentage}>
              <Label>Descuento (%)</Label>
              <Input
                name="discountPercentage"
                type="number"
                min="0"
                max="90"
                step="1"
                value={form.discountPercentage}
                onChange={handleChange}
                onBlur={handleBlur}
                $active={touched.discountPercentage && form.discountPercentage > 0}
                $error={errors.discountPercentage}
                placeholder="Ej: 25"
              />
              {touched.discountPercentage && errors.discountPercentage && <ErrorMsg>{errors.discountPercentage}</ErrorMsg>}
              <Hint>Máximo 90% de descuento</Hint>
            </InputGroup>

            <CheckboxContainer>
              <input
                type="checkbox"
                name="discountActive"
                checked={form.discountActive}
                onChange={handleChange}
              />
              <CheckboxLabel>Activar descuento</CheckboxLabel>
            </CheckboxContainer>

            {/* Preview del precio con descuento */}
            {form.price && form.discountPercentage > 0 && (
              <PricePreview>
                <PreviewTitle>Vista previa del precio:</PreviewTitle>
                <PriceComparison>
                  <OriginalPrice>${Number(form.price).toFixed(2)}</OriginalPrice>
                  <FinalPrice>
                    ${(Number(form.price) * (1 - Number(form.discountPercentage) / 100)).toFixed(2)}
                  </FinalPrice>
                </PriceComparison>
                <Savings>
                  Ahorro: ${(Number(form.price) * (Number(form.discountPercentage) / 100)).toFixed(2)} ({form.discountPercentage}% OFF)
                </Savings>
              </PricePreview>
            )}
          </DiscountSection>

          <Button type="submit">Agregar Libro</Button>
        </Form>
      </Wrapper>
    </Bg>
  );
};

export default BookForm;

// --- Estilos ---
const shake = keyframes`
  0% { transform: translateX(0); }
  15% { transform: translateX(-8px); }
  30% { transform: translateX(8px); }
  45% { transform: translateX(-8px); }
  60% { transform: translateX(8px); }
  75% { transform: translateX(-8px); }
  90% { transform: translateX(8px); }
  100% { transform: translateX(0); }
`;

const Bg = styled.div`
  min-height: 100vh;
  background: #181818;
  color: #fff;
  padding-bottom: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  background: #222;
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.35);
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 500px;
`;

const Title = styled.h1`
  color: #fff;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  ${({ $shake }) =>
    $shake &&
    css`
      animation: ${shake} 0.6s;
    `}
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #bdbdbd;
  font-size: 1rem;
`;

const ErrorMsg = styled.span`
  color: #ff3b3b;
  font-size: 0.95rem;
  margin-top: 0.2rem;
`;

const Hint = styled.span`
  color: #bdbdbd;
  font-size: 0.85rem;
  margin-top: 0.2rem;
`;

const Input = styled.input`
  padding: 0.8rem;
  border-radius: 8px;
  border: 2px solid
    ${({ $error, $active }) =>
      $error ? '#ff3b3b' : $active ? '#00ff00' : '#404040'};
  background-color: #333;
  color: #fff;
  font-size: 1rem;
  transition: border-color 0.2s;
  &:focus {
    outline: none;
    border-color: #00ff00;
    box-shadow: 0 0 0 2px rgba(0,255,0,0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 0.8rem;
  border-radius: 8px;
  border: 2px solid
    ${({ $error, $active }) =>
      $error ? '#ff3b3b' : $active ? '#00ff00' : '#404040'};
  background-color: #333;
  color: #fff;
  font-size: 1rem;
  transition: border-color 0.2s;
  resize: vertical;
  &:focus {
    outline: none;
    border-color: #00ff00;
    box-shadow: 0 0 0 2px rgba(0,255,0,0.1);
  }
`;

const GenresBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem 1.2rem;
  background: #292929;
  border-radius: 10px;
  padding: 1rem;
  border: 2px solid ${({ $error }) => $error ? '#ff3b3b' : '#404040'};
  margin-bottom: 0.2rem;
`;

const GenreCheckbox = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #363636;
  border-radius: 6px;
  padding: 0.3rem 0.8rem;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  input[type="checkbox"] {
    accent-color: #00ff00;
    width: 1.1rem;
    height: 1.1rem;
    margin-right: 0.3rem;
  }
`;

const Button = styled.button`
  background: #181818;
  color: #fff;
  border: 2px solid #00ff00;
  border-radius: 2rem;
  padding: 0.7rem 1.5rem;
  font-size: 1.1rem;
  font-weight: 700;
  box-shadow: 0 4px 16px rgba(0,255,0,0.08);
  transition: all 0.2s;
  cursor: pointer;
  margin-top: 1rem;
  &:hover {
    background: #00ff00;
    color: #181818;
    box-shadow: 0 6px 24px rgba(0,255,0,0.18);
    border-color: #00ff00;
  }
`;

// Nuevos estilos para descuentos
const DiscountSection = styled.div`
  background: #2a2a2a;
  border-radius: 12px;
  padding: 1.5rem;
  border: 2px solid #404040;
  margin-top: 1rem;
`;

const DiscountTitle = styled.h3`
  color: #fff;
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-top: 1rem;
  
  input[type="checkbox"] {
    accent-color: #00ff00;
    width: 1.2rem;
    height: 1.2rem;
  }
`;

const CheckboxLabel = styled.label`
  color: #bdbdbd;
  font-size: 1rem;
  cursor: pointer;
`;

const PricePreview = styled.div`
  background: #333;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  border-left: 4px solid #00ff00;
`;

const PreviewTitle = styled.h4`
  color: #fff;
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
`;

const PriceComparison = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
`;

const OriginalPrice = styled.span`
  color: #ff4444;
  text-decoration: line-through;
  font-size: 1.1rem;
`;

const FinalPrice = styled.span`
  color: #00ff00;
  font-weight: bold;
  font-size: 1.3rem;
`;

const Savings = styled.div`
  color: #00ff00;
  font-size: 0.9rem;
  font-weight: 500;
`;