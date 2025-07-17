import './Layout.css'
import Carrusel from '../Portada/Carrusel'
import { slides } from '../../assets/carouselData.json'
import Books from '../Book/Books'
import Discs from '../Disco/Discs'
import SubPortada from '../Portada/SubPortada'
import Reviews from '../Reviews/Reviews'
import { Outlet, useLocation } from 'react-router-dom'
import NavAside from '../NavAside/NavAside'

const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <>
      {isHomePage ? (
        <>
        <NavAside/>
          <main>
            <section id='portada'>
              <Carrusel data={slides}> </Carrusel>
            </section>
            <section id="subPortada">
              <SubPortada/>
            </section>
            <br className='separation'/>
            <section className='carrusel' id='nuevosLibros'>
              <h3 className='h3layout'>Nuevos ingresos en libros</h3>
              <Books></Books>
            </section>
            <section className='carrusel' id='librosMasVendidos'>
              <h3 className='h3layout'>Los libros mas vendidos</h3>
              <Books></Books>
            </section>  
            <section className='carrusel' id='nuevosDiscos'>
              <h3 className='h3layout'>Nuevos ingresos en música</h3>
              <Discs></Discs>
            </section>
            <section className='carrusel' id='discosMasVendidos'>
              <h3 className='h3layout'>Artistas mas populares</h3> 
              <Discs></Discs>
            </section>
            <section className='grid'>
              <h3 className='h3layout'>Lo que dicen nuestros clientes</h3>
              <Reviews/>
            </section>
          </main>
        </>
      ) : (
        <Outlet />
      )}
    </>
  )
}

export default Layout