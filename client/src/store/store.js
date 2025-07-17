import { configureStore, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

// Importa todos tus slices
import productsReducer from './slices/productsSlice';
import authReducer from './slices/authSlice';
import pagoReducer from './slices/pagoSlice';
import cartReducer from './slices/cartSlice'; 
import buyReducer from './slices/buySlice'; // El slice nuevo para reemplazar localStorage


// Combina todos los reducers
const rootReducer = combineReducers({
  products: productsReducer,
  auth: authReducer,
  pago: pagoReducer,
  buy: buyReducer,
  cart: cartReducer,

});

// Configuración de persistencia
const persistConfig = {
  key: 'root',
  storage,
  whitelist: [
    'auth',    // persiste usuario autenticado
    'pago',    // persiste método de pago seleccionado
    'buy',     // persiste el buyId para el flujo de compra
    'cart',  
  
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
});

export const persistor = persistStore(store);

export default store;