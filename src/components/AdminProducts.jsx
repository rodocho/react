import React, { useState, useEffect } from 'react';
import { Container, Button, Table, Form, Row, Col, Modal, Spinner } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrashAlt, FaCheck, FaTimes, FaImage } from 'react-icons/fa';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';

// URL CONFIRMADA (Sin /api/v1 si tu proyecto no lo usa)
const MOCKAPI_URL = 'https://68f7facef7fb897c6617997a.mockapi.io/productos/productos'; 

// --- Styled Components ---
const SectionTitle = styled.h2`
    color: #007bff;
    border-bottom: 2px solid #007bff;
    padding-bottom: 5px;
    margin-bottom: 30px;
`;

const Thumbnail = styled.img`
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 4px;
    border: 1px solid #dee2e6;
`;

// --- Validaciones ---
const validateProduct = (product) => {
    const errors = {};
    if (!product.title || product.title.trim().length === 0) errors.title = "El nombre es obligatorio.";
    // Validamos que sea un número válido
    if (product.price === '' || isNaN(Number(product.price)) || Number(product.price) <= 0) {
        errors.price = "Ingresa un precio válido mayor a 0.";
    }
    if (!product.description || product.description.length < 5) {
        errors.description = "La descripción es muy corta (mínimo 5 letras).";
    }
    return errors;
};

const initialFormState = { title: '', description: '', price: '', image: '' };

// --- Componente Principal ---
const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Estado del Formulario
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(initialFormState);
    const [formErrors, setFormErrors] = useState({});
    
    // Estado para la eliminación
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    // Cargar Productos
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await fetch(MOCKAPI_URL);
            if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
            const data = await response.json();
            setProducts(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            toast.error("Error de conexión: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    // Manejar cambios en el formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        // Guardamos el precio como string mientras se escribe para permitir decimales
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Limpiar error del campo al escribir
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    // Guardar (Crear o Editar)
    const handleSave = async (e) => {
        e.preventDefault();
        
        const errors = validateProduct(formData);
        setFormErrors(errors);

        if (Object.keys(errors).length > 0) {
            toast.warning("Por favor revisa los campos en rojo.");
            return;
        }

        setLoading(true);
        try {
            const method = isEditing ? 'PUT' : 'POST';
            const url = isEditing ? `${MOCKAPI_URL}/${formData.id}` : MOCKAPI_URL;

            // Convertimos el precio a número justo antes de enviar
            const productToSend = {
                ...formData,
                price: parseFloat(formData.price) 
            };

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productToSend),
            });

            if (!response.ok) {
                const errorData = await response.text(); // Intentar leer el error
                throw new Error(`Error ${response.status}: ${errorData || 'No se pudo guardar'}`);
            }

            toast.success(`Producto ${isEditing ? 'actualizado' : 'creado'} con éxito!`);
            setShowModal(false);
            setFormData(initialFormState);
            await fetchProducts(); // Recargar la tabla
        } catch (err) {
            console.error("Error al guardar:", err);
            toast.error(`Fallo al guardar: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Confirmar eliminación
    const handleDeleteConfirm = (product) => {
        setProductToDelete(product);
        setShowDeleteModal(true);
    };

    // Eliminar
    const handleDelete = async () => {
        if (!productToDelete) return;
        setShowDeleteModal(false);
        setLoading(true);
        try {
            const response = await fetch(`${MOCKAPI_URL}/${productToDelete.id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error(`Error ${response.status}: No se pudo eliminar.`);
            
            toast.success("Producto eliminado correctamente.");
            await fetchProducts();
        } catch (err) {
            toast.error(`Error: ${err.message}`);
        } finally {
            setLoading(false);
            setProductToDelete(null);
        }
    };
    
    // Abrir modal para AGREGAR
    const handleAdd = () => {
        setFormData(initialFormState);
        setIsEditing(false);
        setFormErrors({});
        setShowModal(true);
    };

    // Abrir modal para EDITAR
    const handleEdit = (product) => {
        setFormData({
            ...product,
            price: product.price.toString() // Convertir a string para el input
        });
        setIsEditing(true);
        setFormErrors({});
        setShowModal(true);
    };

    if (loading && products.length === 0) return (
        <Container className="text-center my-5">
            <Spinner animation="border" variant="primary" /><p className="mt-2">Cargando administrador...</p>
        </Container>
    );

    return (
        <Container className="my-5">
            <Helmet><title>Admin CRUD | Maked3co</title></Helmet>
            <SectionTitle>Administración de Productos</SectionTitle>
            
            {error && <div className="alert alert-danger">{error}</div>}

            <Button variant="primary" onClick={handleAdd} className="mb-4">
                <FaPlus className="me-2" /> Agregar Nuevo Producto
            </Button>

            <Table striped bordered hover responsive className="align-middle shadow-sm">
                <thead className="bg-light">
                    <tr>
                        <th style={{width: '80px'}}>Imagen</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th style={{ width: '35%' }}>Descripción</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td>
                                <Thumbnail 
                                    src={product.image || "https://placehold.co/50x50?text=Sin+Img"} 
                                    alt="Thumb" 
                                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/50x50?text=Error"}}
                                />
                            </td>
                            <td className="fw-bold">{product.title}</td>
                            {/* Manejo seguro del precio por si viene como string o número */}
                            <td>${Number(product.price).toFixed(2)}</td>
                            <td className="small text-muted">{product.description ? product.description.substring(0, 50) + '...' : ''}</td>
                            <td>
                                <Button variant="outline-info" size="sm" className="me-2" onClick={() => handleEdit(product)} title="Editar"><FaEdit /></Button>
                                <Button variant="outline-danger" size="sm" onClick={() => handleDeleteConfirm(product)} title="Eliminar"><FaTrashAlt /></Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal Formulario */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSave}>
                        <Row>
                            <Col md={8}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nombre del Producto <span className="text-danger">*</span></Form.Label>
                                    <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} isInvalid={!!formErrors.title} />
                                    <Form.Control.Feedback type="invalid">{formErrors.title}</Form.Control.Feedback>
                                </Form.Group>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Precio ($) <span className="text-danger">*</span></Form.Label>
                                            <Form.Control 
                                                type="number" 
                                                name="price" 
                                                step="0.01" 
                                                value={formData.price} 
                                                onChange={handleChange} 
                                                isInvalid={!!formErrors.price} 
                                            />
                                            <Form.Control.Feedback type="invalid">{formErrors.price}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>URL de Imagen</Form.Label>
                                            <Form.Control type="text" name="image" value={formData.image} onChange={handleChange} placeholder="https://..." />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group className="mb-3">
                                    <Form.Label>Descripción <span className="text-danger">*</span></Form.Label>
                                    <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} isInvalid={!!formErrors.description} placeholder="Breve descripción..." />
                                    <Form.Control.Feedback type="invalid">{formErrors.description}</Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={4} className="d-flex align-items-center justify-content-center bg-light rounded p-3">
                                {formData.image ? (
                                    <div className="text-center">
                                        <p className="small text-muted mb-2">Vista Previa:</p>
                                        <img src={formData.image} alt="Preview" className="img-fluid rounded shadow-sm" style={{ maxHeight: '150px' }} 
                                            onError={(e) => e.target.src="https://placehold.co/200?text=URL+Invalida"} />
                                    </div>
                                ) : (
                                    <div className="text-center text-muted">
                                        <FaImage size={40} className="mb-2" />
                                        <p className="small">Pega una URL para ver la imagen</p>
                                    </div>
                                )}
                            </Col>
                        </Row>
                        <div className="text-end mt-3 border-top pt-3">
                            <Button variant="secondary" onClick={() => setShowModal(false)} className="me-2">Cancelar</Button>
                            <Button variant="success" type="submit" disabled={loading}>
                                {loading ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Crear Producto')}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modal Eliminar */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton className="bg-danger text-white">
                    <Modal.Title>Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Estás seguro de que deseas eliminar permanentemente el producto <strong>{productToDelete?.title}</strong>?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}><FaTimes className="me-1" /> Cancelar</Button>
                    <Button variant="danger" onClick={handleDelete}><FaCheck className="me-1" /> Eliminar</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AdminProducts;