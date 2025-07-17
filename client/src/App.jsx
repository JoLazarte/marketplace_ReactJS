import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Layout from './components/Layout/Layout'
import DetailPage from './pages/DetailPage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Cart from './components/Cart/Cart'
import { useCart } from './hooks/useCart'
import BooksPage from './pages/BooksPage'
import AlbumsPage from './pages/AlbumsPage'
import AlbumForm from './pages/album-form';
import BookForm from './pages/book-form';
import EditBookForm from './pages/EditBookForm';
import EditAlbumForm from './pages/EditAlbumForm';
import CheckoutPage from './pages/CheckoutPage';
import Contact from './pages/Contact';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './store/store';
import { ToastContainer } from 'react-toastify';
import { configureTokenGetter } from './utils/apiUtils';
import 'react-toastify/dist/ReactToastify.css';

// Componente para configurar el token getter
const TokenConfigurator = () => {
  const token = useSelector(state => state.auth.token);
  
  useEffect(() => {
    configureTokenGetter(() => token);
  }, [token]);
  
  return null;
};

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <TokenConfigurator />
        <Header />
        <Cart />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="detail/:type/:id" element={<DetailPage />} />
          </Route>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/albums" element={<AlbumsPage />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/album-form" element={<AlbumForm />} />
          <Route path="/book-form" element={<BookForm />} />
          <Route path="/edit/book/:id" element={<EditBookForm />} />
          <Route path="/edit/album/:id" element={<EditAlbumForm />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          style={{
            fontSize: '14px',
            top: '150px'
          }}
        />
      </PersistGate>
    </Provider>
  )
}

export default App;