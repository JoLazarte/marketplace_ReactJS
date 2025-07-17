import React, { useRef, useEffect, useCallback } from 'react'
import Slider from 'react-slick'
import styled from 'styled-components'
import ProductCardDiscs from './ProductCardDiscs';
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useAlbums } from '../../hooks/useProducts';

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 1,
  initialSlide: 0,
  arrows : false,
  responsive: [
    { breakpoint: 990, settings: { slidesToShow: 3, slidesToScroll: 1, infinite: true, dots: true } },
    { breakpoint: 600, settings: { slidesToShow: 2, slidesToScroll: 1, initialSlide: 2 } },
    { breakpoint: 530, settings: { slidesToShow: 1, slidesToScroll: 1 } }
  ]
}

const Discs = () => {
  const arrowRef = useRef(null);
  const { canEditProducts } = useAuth();
  const navigate = useNavigate();
  
  // Usar el hook personalizado para obtener los álbumes desde Redux
  const { albums, loading, fetchAlbumsData, forceFetchAlbums } = useAlbums();

  // Fetch albums cuando el componente se monta
  useEffect(() => {
    fetchAlbumsData();
  }, [fetchAlbumsData]);

  // Listener para cambios globales de productos
  useEffect(() => {
    const handleProductUpdate = (event) => {
      const { productType, action } = event.detail || {};
      if (productType === 'album' || action === 'global-refresh') {
        console.log('Global album update detected in carousel, refreshing...');
        setTimeout(() => {
          forceFetchAlbums();
        }, 500);
      }
    };

    // Escuchar eventos globales de actualización
    window.addEventListener('productUpdate', handleProductUpdate);
    
    return () => {
      window.removeEventListener('productUpdate', handleProductUpdate);
    };
  }, [forceFetchAlbums]);

  // Efecto adicional para detectar cambios en la longitud de albums
  useEffect(() => {
    // Si no hay albums pero tampoco está cargando, intentar refetch
    if (!albums || albums.length === 0 && !loading) {
      const timer = setTimeout(() => {
        console.log('No albums detected, attempting refresh...');
        fetchAlbumsData();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [albums, loading, fetchAlbumsData]);

  // Handler para cambio de estado de productos
  const handleStatusChange = useCallback((id, newStatus) => {
    console.log('Status changed for album in carousel:', id, 'New status:', newStatus);
    // Refetch para actualizar la lista del carousel
    setTimeout(() => {
      forceFetchAlbums();
    }, 500);
  }, [forceFetchAlbums]);

  if (loading) {
    return <div style={{color: "#fff", textAlign: "center", padding: "2rem"}}>Cargando álbumes...</div>;
  }

  if (!albums || !albums.length) {
    return <div style={{color: "#fff", textAlign: "center", padding: "2rem"}}>No hay álbumes disponibles.</div>;
  }

  return (
    <Container id='cardContainer'>
      {canEditProducts && canEditProducts() && (
        <AddButton onClick={() => navigate('/album-form')}>
          + Agregar Álbum
        </AddButton>
      )}
      <Slider className="marginCard" ref={arrowRef} {...settings}>
        {albums.filter(item => item && item.id).map(item => (
          <ProductCardDiscs 
            item={item} 
            key={item.id} 
            onStatusChange={handleStatusChange}
          />
        ))}
      </Slider>
      <Buttons>
        <button onClick={() => arrowRef.current.slickPrev()} className='back'><SlArrowLeft/></button>
        <button onClick={() => arrowRef.current.slickNext()} className='next'><SlArrowRight/></button>
      </Buttons>
    </Container>
  )
}

export default Discs

const Container = styled.div`
    width: 80%;
    height: 100%;
    margin: 0 auto;
    position: relative;

    @media(max-width:840px){
        width: 90%;
    }
    
    .marginCard{
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

    @media(max-width:530px){
        display: none;
    }
`

const Buttons = styled.div`
    button{
        width: 2rem;
        height: 2rem;
        background-color: rgba(255, 255, 255, 0.1);
        cursor: pointer;
        color: #01be96;
        border: none;
        position: absolute;
        top: 45%;
        right: -1rem;
        transform: translateY(-50%);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 0.3s ease;
        
        &:hover{
            background-color: rgba(255, 255, 255, 0.2);
            transform: translateY(-50%) scale(1.1);
        }
    }
    
    .back{
        left: -1rem;
        right: auto;
    }
`

const AddButton = styled.button`
  background: #181818;
  color: #fff;
  border: 2px solid #00ff00;
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