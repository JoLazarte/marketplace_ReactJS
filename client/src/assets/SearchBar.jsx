import React from 'react';
import styled from 'styled-components';

const SearchBar = () => {
  return (
    <StyledWrapper>
      <div className="group">
        <svg className="icon" aria-hidden="true" viewBox="0 0 24 24">
          <g>
            <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z" />
          </g>
        </svg>
        <input placeholder="Search" type="search" className="input" />
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .group {
    display: flex;
    line-height: 28px;
    align-items: center;
    position: relative;

  }

  .input {
    height: 43px;
    line-height: 28px;
    padding: 0 1rem;
    width: 600px;
    padding-left: 2.5rem;
    border: 2px solid transparent;
    border-radius: 8px;
    outline: none;
    background-color: #f3ede8;
    color: #0d0c22;
    box-shadow: 0px 0px 10px rgb(78, 65, 65);
    transition: .3s ease;
  }

  .input::placeholder {
    color: #777;
  }

  .icon {
    position: absolute;
    left: 1rem;
    fill:rgb(26, 22, 101);
    width: 1rem;
    height: 1rem;
  }`;

export default SearchBar;