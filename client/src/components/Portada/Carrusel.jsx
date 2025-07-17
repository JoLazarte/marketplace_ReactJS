import React, { useState } from 'react'
import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Carrusel.css';

const Carrusel = ({data}) =>{
  const [slide, setSlide] = useState(0);
  const navigate = useNavigate();
  
  const { user } = useAuth();

  // Filtrar slides basado en el estado de autenticación
  const filteredData = user ? data.filter(item => item.id !== 3) : data;

  if (!data || data.length === 0) {
    return <div style={{ color: 'white' }}>No hay datos para mostrar</div>;
  }

  const nextSlide = () => {
    setSlide(slide === filteredData.length - 1 ? 0 : slide + 1);
  };

  const prevSlide = () => {
    setSlide(slide === 0 ? filteredData.length - 1 : slide - 1);
  };

  const handleButtonClick = (item) => {
    switch(item.id) {
      case 1:
        navigate('/books');
        break;
      case 2:
        navigate('/albums');
        break;
      case 3:
        navigate('/register');
        break;
      default:
        break;
    }
  };

  return (
    <div className="carousel">
      
      {filteredData.map((item, idx) => {
        return (
          <div key={idx} className={slide === idx ? "slide" : "slide slide-hidden"} >
            <img className='imgCarrusel'
             src={item.src}
             alt={item.alt}
            />
            <div className='insideCard'>
              <h3 title={item.title}> {item.title} </h3>
              <p text={item.text} > {item.text} </p>
              <button 
                className="btnInsideCard" 
                onClick={() => handleButtonClick(item)}
              > 
                {item.textbutton}
              </button>
            </div>
           
          </div>
         
        );
      })}
      <BsArrowLeftCircleFill onClick={prevSlide} className="arrow arrow-left" />
      <BsArrowRightCircleFill
        onClick={nextSlide}
        className="arrow arrow-right"
      />
      <span className="indicators">
        {filteredData.map((_, idx) => {
          return (
            <button
              key={idx}
              className={
                slide === idx ? "indicator" : "indicator indicator-inactive"
              }
              onClick={() => setSlide(idx)}
            ></button>
          );
        })}
      </span>
      
    </div>
  );
};

export default Carrusel;