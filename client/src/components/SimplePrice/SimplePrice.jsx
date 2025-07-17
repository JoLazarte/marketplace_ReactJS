import React, { useState, useEffect } from 'react';
import { checkProductDiscount } from '../../utils/apiUtils';
import './SimplePrice.css';

const SimplePrice = ({ productId, productType, originalPrice, className = '' }) => {
  const [discount, setDiscount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiscount = async () => {
      try {
        setLoading(true);
        // Convertir el tipo de producto al formato esperado por el backend
        const backendType = productType === 'book' ? 'LIBRO' : 'ALBUM';
        const response = await checkProductDiscount(backendType, productId);
        
        if (response && response.success && response.data && response.data.hasDiscount) {
          const discountPercentage = response.data.percentage;
          const discountedPrice = originalPrice - (originalPrice * discountPercentage / 100);
          
          setDiscount({
            percentage: discountPercentage,
            discountedPrice: discountedPrice.toFixed(2)
          });
        } else {
          setDiscount(null);
        }
      } catch (error) {
        console.error('Error fetching discount:', error);
        setDiscount(null);
      } finally {
        setLoading(false);
      }
    };

    if (productId && productType && originalPrice) {
      fetchDiscount();
    }
  }, [productId, productType, originalPrice]);

  if (loading) {
    return <div className={`simple-price ${className}`}>Cargando...</div>;
  }

  if (discount) {
    return (
      <div className={`simple-price with-discount ${className}`}>
        <div className="discount-badge">-{discount.percentage}%</div>
        <div className="original-price">${originalPrice.toFixed(2)}</div>
        <div className="discounted-price">${discount.discountedPrice}</div>
      </div>
    );
  }

  return (
    <div className={`simple-price ${className}`}>
      <div className="regular-price">${originalPrice.toFixed(2)}</div>
    </div>
  );
};

export default SimplePrice;
