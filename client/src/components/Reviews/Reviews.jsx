import './Reviews.css'

const Reviews = ()=>{
    return(
        <div className="reviews-container">
            <div className="reviews-grid">
                <div className="review-card">
                    <div className="review-content">
                        <div className="quote-icon">❝</div>
                        <p className="review-text">Una experiencia maravillosa. La variedad de libros es impresionante y el servicio al cliente excelente.</p>
                        <div className="reviewer-info">
                            <h5 className="reviewer-name">Lucía Fernández</h5>
                            <div className="stars">⭐⭐⭐⭐⭐</div>
                        </div>
                    </div>
                </div>
                <div className="review-card">
                    <div className="review-content">
                        <div className="quote-icon">❝</div>
                        <p className="review-text">Compré un álbum de colección y llegó en perfectas condiciones. ¡Volveré a comprar sin dudas!</p>
                        <div className="reviewer-info">
                            <h5 className="reviewer-name">Diego Martínez</h5>
                            <div className="stars">⭐⭐⭐⭐⭐</div>
                        </div>
                    </div>
                </div>
                <div className="review-card">
                    <div className="review-content">
                        <div className="quote-icon">❝</div>
                        <p className="review-text">Gran selección y excelente atención. Me encantó el diseño de la página y lo fácil que es comprar.</p>
                        <div className="reviewer-info">
                            <h5 className="reviewer-name">Valentina Ríos</h5>
                            <div className="stars">⭐⭐⭐⭐⭐</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Reviews