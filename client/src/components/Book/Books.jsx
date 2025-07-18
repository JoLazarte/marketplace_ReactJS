import React, { useRef, useEffect, useCallback } from 'react';
import Slider from 'react-slick';
import styled from 'styled-components';
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import ProductCardBook from './ProductCardBook';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useBooks } from '../../hooks/useProducts';

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 1,
  initialSlide: 0,
  arrows: false,
  responsive: [
    { breakpoint: 990, settings: { slidesToShow: 3, slidesToScroll: 1, infinite: true, dots: true } },
    { breakpoint: 600, settings: { slidesToShow: 2, slidesToScroll: 1, initialSlide: 2 } },
    { breakpoint: 530, settings: { slidesToShow: 1, slidesToScroll: 1 } }
  ]
};

const Books = () => {
  const arrowRef = useRef(null);
  const { canEditProducts } = useAuth();
  const navigate = useNavigate();
  
  // Usar el hook personalizado para obtener los libros desde Redux
  const { books, loading, fetchBooksData, forceFetchBooks } = useBooks();

  // Fetch books cuando el componente se monta
  useEffect(() => {
    fetchBooksData();
  }, [fetchBooksData]);

  // Listener para cambios globales de productos
  useEffect(() => {
    const handleProductUpdate = (event) => {
      const { productType, action } = event.detail || {};
      if (productType === 'book' || action === 'global-refresh') {
        console.log('Global book update detected in carousel, refreshing...');
        setTimeout(() => {
          forceFetchBooks();
        }, 500);
      }
    };

    // Escuchar eventos globales de actualización
    window.addEventListener('productUpdate', handleProductUpdate);
    
    return () => {
      window.removeEventListener('productUpdate', handleProductUpdate);
    };
  }, [forceFetchBooks]);

  // Efecto adicional para detectar cambios en la longitud de books
  useEffect(() => {
    // Si no hay books pero tampoco está cargando, intentar refetch
    if (!books || books.length === 0 && !loading) {
      const timer = setTimeout(() => {
        console.log('No books detected, attempting refresh...');
        fetchBooksData();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [books, loading, fetchBooksData]);

  // Handler para cambio de estado de productos
  const handleStatusChange = useCallback((id, newStatus) => {
    console.log('Status changed for book in carousel:', id, 'New status:', newStatus);
    // Refetch para actualizar la lista del carousel
    setTimeout(() => {
      forceFetchBooks();
    }, 500);
  }, [forceFetchBooks]);

  if (loading) {
    return <div style={{color: "#fff", textAlign: "center", padding: "2rem"}}>Cargando libros...</div>;
  }

  if (!books.length) {
    return <div style={{color: "#fff", textAlign: "center", padding: "2rem"}}>No hay libros disponibles.</div>;
  }

  return (
    <Container>
      {canEditProducts && canEditProducts() && (
        <AddButton onClick={() => navigate('/book-form')}>
          + Agregar Libro
        </AddButton>
      )}
      <Slider className="marginCardBook" ref={arrowRef} {...settings}>
        {books.filter(item => item && item.id).map(item => (
          <ProductCardBook 
            item={item} 
            key={item.id} 
            onStatusChange={handleStatusChange}
          />
        ))}
      </Slider>
        <SlArrowLeft onClick={() => arrowRef.current.slickPrev()} className='arr backArr'/>
        <SlArrowRight onClick={() => arrowRef.current.slickNext()} className='arr forwardArr'/> 
    </Container>
  );
};

export default Books;


const Container = styled.div`
    width: 75%;
    height: 100%;
    margin: 0 auto;
    position: relative;

    @media(max-width:840px){
        width: 90%;
    }
    
    .marginCardBook{
        margin: inherit;
    }
  
    .slick-list, .slick-slider, .slick-track{
        padding: 0;
    }

    .slick-dots{
        text-align: left;
        margin-left: 1rem;
    }

    .slick-dots li button:before{
        content: "";
    }

    .slick-dots li button{
        width: 9px;
        height: 4px;
        background: linear-gradient(159deg, rgb(198, 183, 183) 0%, rgb(168, 147, 122) 100%);
        padding: 0.1rem;
        margin-top: 1rem;
        transition: all 400ms ease-in-out;
        border-radius: 50px;
    }
    
    .slick-dots li.slick-active button{
        background: rgb(248, 244, 244);
        width: 15px;
    }

    .slick-dots li{
        margin: 0;
    }

    .arr{
      
      position:absolute;
      cursor: pointer;
      color: rgba(5, 251, 218, 1); 
      
      margin-top:-12rem;
      font-size: 1.4rem;
     
    }
   
  
    .arr.backArr{
        margin-left:-2rem;
    }
    .arr.forwardArr{
        margin-left:73rem;
    }
    
    @media(max-width:530px){
        display: none;
    }
`


const AddButton = styled.button`
  background: #181818;
  color: #fff;
  border: 2px solid #00ffeaff;
  border-radius: 2rem;
  padding: 0.7rem 1.5rem;
  font-size: 1rem;
  font-weight: 700;
  box-shadow: 0 4px 16px rgba(0,255,0,0.08);
  transition: all 0.2s;
  cursor: pointer;
  margin-bottom: 1rem;
  margin-left: auto;
  display: block;
  &:hover {
    background: #00ff00;
    color: #181818;
    box-shadow: 0 6px 24px rgba(0,255,0,0.18);
    border-color: #00ff00;
  }
`;