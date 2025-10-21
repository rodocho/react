import React from 'react';

function Reviews() {
  return (
    <section id="reseñas" className="section-reviews">
        <h2>Lo que dicen nuestros clientes</h2>
        <div className="reviews-grid">
            <div className="review-card">
                <p>"Las mejores y me las enviaron super rapido, totalmente recomendado."</p>
                <span>- Cliente Satisfecho</span>
            </div>
            <div className="review-card">
                <p>"El nivel de detalle en las lamparas es asombroso. RECOMIENDO."</p>
                <span>- Otro cliente Feliz</span>
            </div>
            <div className="review-card">
                <p>"Atencion al cliente excelente y productos que superaron mis expectativas."</p>
                <span>- Comprador Recurrente</span>
            </div>
        </div>
    </section>
  );
}
export default Reviews;