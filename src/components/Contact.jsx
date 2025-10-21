import React from 'react';

function Contact() {
  return (
    <section id="contacto" className="section-contact">
        <h2>Contáctanos</h2>
        <form id="contact-form">
            <label htmlFor="name">Nombre:</label>
            <input type="text" id="name" name="name" required />
            
            <label htmlFor="email">Correo Electrónico:</label>
            <input type="email" id="email" name="email" required />
            
            <label htmlFor="message">Mensaje:</label>
            <textarea id="message" name="message" rows="4" required></textarea>
            
            <button type="submit">Enviar</button>
        </form>
        <p id="form-message"></p>
    </section>
  );
}
export default Contact;