import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBuys } from '../../hooks/useBuys';
import { useDispatch } from 'react-redux';
import { setBuyId } from '../../store/slices/buySlice';
import './ProductCardDisc.css';
import { FaRegEdit, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { toggleAlbumStatus } from '../../utils/apiUtils';
import { toast } from 'react-toastify';

const ProductCardDiscs = ({ item, onStatusChange }) => {
  if (!item) return null;

  const { id, title, author, description, urlImage, price, stock = 0, active, discountPercentage = 0, discountActive = false } = item;
  const isOutOfStock = stock === 0;
  const isInactive = active === false;
  const navigate = useNavigate();
  const { canEditProducts, canAddFavourite, isAdmin, token, isAuthenticated } = useAuth();
  const [isToggling, setIsToggling] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isAdminOn = isAdmin()
  const { addToCart, cartItems } = useCart();
  const [quantity, setQuantity] = useState(1);
  const { createBuy, loading: buyLoading, error: buyError } = useBuys();
  const dispatch = useDispatch();

  // Calcular precio con descuento
  const hasDiscount = discountActive && discountPercentage > 0;
  const finalPrice = hasDiscount ? price * (1 - discountPercentage / 100) : price;

  const handleAddToCart = () => {
    
    const itemToAdd = {
        ...item,
        quantity: quantity,
        price: item.price,
        discountPercentage: item.discountPercentage || 0,
        discountActive: item.discountActive || false
    };
      addToCart(itemToAdd);
    
  };

  const handleCheckout = async () => {
        if (!isAuthenticated || !token) {
          toast.info(
            <div style={{margin: '1rem'}}>
              <p style={{fontSize: '1rem'}}>🔐 Necesitas iniciar sesión para continuar</p>
              <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', justifyContent: 'center', alignItems: 'center'  }}>
                <button 
                  onClick={() => {
                    toast.dismiss();
                    navigate('/login');
                  }}
                  style={{
                    background: '#00ffd5ff',
                    color: '#000',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    width: '8rem'
                  }}
                >
                  Iniciar Sesión
                </button>
                <button 
                  onClick={() => {
                    toast.dismiss();
                    navigate('/register');
                  }}
                  style={{
                    background: '#ff4000ff',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    width: '8rem'
                  }}
                >
                  Registrarse
                </button>
              </div>
            </div>,
            {
              position: "top-center",
              autoClose: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
            }
          );
          return;
        }
    
        setLoading(true);
        setError(null);
    
        try {
          handleAddToCart();
          // Crear la compra directamente
          const buyData = await createBuy(cartItems, token);
          console.log('Compra creada:', buyData);
    
          // Guardamos el ID de la compra en Redux (persistido)
          dispatch(setBuyId(buyData.id));
    
          navigate('/checkout'); 
        } catch (err) {
          setError(err.message || 'Error al procesar el carrito. Por favor, intenta nuevamente.');
          console.error('Error en checkout:', err);
        } finally {
          setLoading(false);
        }
  };

  const handleToggleStatus = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isToggling) return;
    
    setIsToggling(true);
    try {
      const result = await toggleAlbumStatus(id, !active);
      if (result.success) {
        toast.success(
          active ? 'Álbum deshabilitado correctamente' : 'Álbum habilitado correctamente'
        );
        if (onStatusChange) {
          onStatusChange(id, !active);
        }
        
        // Emitir evento global para actualizar carrouseles
        window.dispatchEvent(new CustomEvent('productUpdate', {
          detail: { productType: 'album', action: 'status-change', id, newStatus: !active }
        }));
      } else {
        toast.error(result.error || 'Error al cambiar el estado del álbum');
      }
    } catch (error) {
      console.error('Error toggling album status:', error);
      toast.error('Error al cambiar el estado del álbum');
    } finally {
      setIsToggling(false);
    }
  };

  const CardContent = (
    <>
      <div className={`imgDiscContainer${isOutOfStock ? ' out-of-stock' : ''}${isInactive ? ' inactive' : ''}`}>
        <img src={Array.isArray(urlImage) ? urlImage[0] : urlImage} alt={title} className='imgDisc' />
        {isOutOfStock && <div className="stock-overlay">Sin stock</div>}
        {isInactive && <div className="inactive-overlay">Deshabilitado</div>}
        {hasDiscount && <div className="discount-badge">{discountPercentage}% OFF</div>}
        {canAddFavourite && canAddFavourite() && (
        <div className="save"

        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 683 683" className="svg">
              <g clipPath="url(#clip0_993_25)">
                <mask height={683} width={683} y={0} x={0} maskUnits="userSpaceOnUse" style={{maskType: 'luminance'}} id="mask0_993_25">
                  <path fill="white" d="M0 -0.00012207H682.667V682.667H0V-0.00012207Z" />
                </mask>
                <g mask="url(#mask0_993_25)">
                  <path strokeLinejoin="round" strokeLinecap="round" strokeMiterlimit={10} strokeWidth={40} stroke="#CED8DE" d="M148.535 19.9999C137.179 19.9999 126.256 24.5092 118.223 32.5532C110.188 40.5866 105.689 51.4799 105.689 62.8439V633.382C105.689 649.556 118.757 662.667 134.931 662.667H135.039C143.715 662.667 151.961 659.218 158.067 653.09C186.451 624.728 270.212 540.966 304.809 506.434C314.449 496.741 327.623 491.289 341.335 491.289C355.045 491.289 368.22 496.741 377.859 506.434C412.563 541.074 496.752 625.242 524.816 653.348C530.813 659.314 538.845 662.667 547.308 662.667C563.697 662.667 576.979 649.395 576.979 633.019V62.8439C576.979 51.4799 572.48 40.5866 564.447 32.5532C556.412 24.5092 545.489 19.9999 534.133 19.9999H148.535Z" />
                </g>
              </g>
              <defs>
                <clipPath id="clip0_993_25">
                  <rect fill="white" height="682.667" width="682.667" />
                </clipPath>
              </defs>
            </svg>
        </div>
      )}
      </div>
      <div className="text">
        <h3 className="titulo">{title}</h3>
        <p className="autor">{author}</p>
        <p className="labelYear">{item.recordLabel} {item.year && `- ${item.year}`}</p>
        <div className="priceBuy">
          
            {hasDiscount ? (
              <div className="priceDiscountDisc">
                <span className="original-price">${price.toFixed(2)}</span>
                <span className="final-price">${finalPrice.toFixed(2)}</span>
              </div>
            ) : (
              <span className="price">${price.toFixed(2)}</span>
            )}
    
            <button type='button' onClick={handleCheckout} className={`buttonCardB${isAdminOn? 'disabled': ''}`}
              disabled={loading || buyLoading}
            >
              {loading || buyLoading ? 'Procesando...' : 'Comprar'}
            </button>
        </div>
      </div>
    </>
  );

  return (
    <div className={`containerDisc${isOutOfStock ? ' disabled' : ''}${isInactive ? ' inactive' : ''}`}>
      {canEditProducts && canEditProducts() && (
        <div className="admin-controls">
          <button
            className="edit-btn"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              navigate(`/edit/album/${id}`);
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
        <Link to={`/detail/disc/${id}`} className="link-card">
          {CardContent}
        </Link>
      )}
    </div>
  );
};

export default ProductCardDiscs;