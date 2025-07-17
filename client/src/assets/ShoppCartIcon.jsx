import React from 'react';
import styled from 'styled-components';

const ShoppCartIcon = () => {
  return (
    <StyledWrapper>
      <button className="button">
        <svg viewBox="0 0 16 16" className="bi bi-cart-check" height={24} width={24} xmlns="http://www.w3.org/2000/svg" fill="#fff">
          <path d="M11.354 6.354a.5.5 0 0 0-.708-.708L8 8.293 6.854 7.146a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z" />
          <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
        </svg>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .button {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 12px 15px;
  
    background-color: #181717;
    border: 1px solid rgb(254, 254, 254);
    border-radius: 6px;
    cursor: pointer;
    
  }



  .button:hover {
    background-color: rgb(255, 255, 255);
  }

  .button:hover svg path {
    fill:rgb(4, 4, 4);
  }`;

export default ShoppCartIcon;