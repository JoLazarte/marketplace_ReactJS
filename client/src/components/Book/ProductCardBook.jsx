import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ProductCardBook.css';
import { FaRegEdit, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { toggleBookStatus } from '../../utils/apiUtils';
import { toast } from 'react-toastify';

const ProductCardBook = ({ item, onStatusChange }) => {
  if (!item) return null;
  
  const { id, title, author, editorial, description, urlImage, price, stock, active, discountPercentage = 0, discountActive = false } = item;
  const isOutOfStock = stock === 0;
  const isInactive = active === false;
  const navigate = useNavigate();
  const { canEditProducts } = useAuth();
  const [isToggling, setIsToggling] = useState(false);

  // Calcular precio con descuento
  const hasDiscount = discountActive && discountPercentage > 0;
  const finalPrice = hasDiscount ? price * (1 - discountPercentage / 100) : price;

  const handleToggleStatus = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isToggling) return;
    
    setIsToggling(true);
    try {
      const result = await toggleBookStatus(id, !active);
      if (result.success) {
        toast.success(
          active ? 'Libro deshabilitado correctamente' : 'Libro habilitado correctamente'
        );
        if (onStatusChange) {
          onStatusChange(id, !active);
        }
        
        // Emitir evento global para actualizar carrouseles
        window.dispatchEvent(new CustomEvent('productUpdate', {
          detail: { productType: 'book', action: 'status-change', id, newStatus: !active }
        }));
      } else {
        toast.error(result.error || 'Error al cambiar el estado del libro');
      }
    } catch (error) {
      console.error('Error toggling book status:', error);
      toast.error('Error al cambiar el estado del libro');
    } finally {
      setIsToggling(false);
    }
  };

  const CardContent = (
    <>
      <div className={`img-container${isOutOfStock ? ' out-of-stock' : ''}${isInactive ? ' inactive' : ''}`}>
        <img src={Array.isArray(urlImage) ? urlImage[0] : urlImage} alt={title} />
        {isOutOfStock && <div className="stock-overlay">Sin stock</div>}
        {isInactive && <div className="inactive-overlay">Deshabilitado</div>}
        {hasDiscount && <div className="discount-badge">{discountPercentage}% OFF</div>}
      </div>
      <div className="details">
        <h3 className="title">{title}</h3>
        <p className="author">{author}</p>
        {editorial && <p className="editorial">{editorial}</p>}
        <p className="description">{description}</p>
        <div className="price-container">
          {hasDiscount ? (
            <>
              <p className="original-price">${price.toFixed(2)}</p>
              <p className="final-price">${finalPrice.toFixed(2)}</p>
            </>
          ) : (
            <p className="price">${price.toFixed(2)}</p>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className={`container${isOutOfStock ? ' disabled' : ''}${isInactive ? ' inactive' : ''}`}>
      {canEditProducts && canEditProducts() && (
        <div className="admin-controls">
          <button
            className="edit-btn"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              navigate(`/edit/book/${id}`);
            }}
            title="Editar"
            type="button"
          >
            <FaRegEdit className="edit-icon" />
            <span className="edit-text">Editar</span>
          </button>
          <button
            className={`toggle-btn ${active ? 'active' : 'inactive'}`}
            onClick={handleToggleStatus}
            disabled={isToggling}
            title={active ? 'Deshabilitar' : 'Habilitar'}
            type="button"
          >
            {isToggling ? '...' : (active ? <FaEyeSlash /> : <FaEye />)}
            <span className="toggle-text">
              {isToggling ? 'Cambiando...' : (active ? 'Deshabilitar' : 'Habilitar')}
            </span>
          </button>
        </div>
      )}
      {isOutOfStock ? (
        <div>{CardContent}</div>
      ) : (
        <Link to={`/detail/book/${id}`} className='link-card'>
          {CardContent}
        </Link>
      )}
    </div>
  );
};

export default ProductCardBook;