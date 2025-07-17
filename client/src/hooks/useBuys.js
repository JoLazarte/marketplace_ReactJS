import { useState } from 'react';

export const useBuys = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createBuy = async (items, token) => {
    setLoading(true);
    setError(null);
    
    try {
      const formattedItems = items.map(item => {
        const baseItem = {
          finalPrice: item.price,
          totalQuantity: item.quantity
        };

        if (item.isrc) {
          return {
            ...baseItem,
            musicAlbumId: item.id
          };
        } else {
          return {
            ...baseItem,
            bookId: item.id
          };
        }
      });

      const response = await fetch('http://localhost:8080/buys/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ items: formattedItems })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al crear la compra');
      }

      return data.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const confirmBuy = async (buyId, token) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:8080/buys/${buyId}/confirm`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al confirmar la compra');
      }

      return data.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const emptyBuy = async (buyId, token) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:8080/buys/${buyId}/empty`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al vaciar la compra');
      }

      return data.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createBuy,
    confirmBuy,
    emptyBuy,
    loading,
    error
  };
}; 