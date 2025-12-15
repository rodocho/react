import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, useNavigate, useParams, Link } from 'react-router-dom';
import { Container, Nav, Navbar, Button, Badge, Form, Spinner, Card, Row, Col, Pagination, ListGroup } from 'react-bootstrap';
import styled from 'styled-components';
// AGREGADO: FaWhatsapp y FaArrowLeft para la nueva funcionalidad
import { FaShoppingCart, FaSignOutAlt, FaSignInAlt, FaUserShield, FaSearch, FaWhatsapp, FaArrowLeft } from 'react-icons/fa';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';

// Importación de Contextos y Estilos
import { useAuth } from './context/AuthContext.jsx';
import { useCart } from './context/CartContext.jsx';
import { MainContainer, FooterContainer } from './styles/GlobalStyles.js';

// Importación del componente de Administración
import AdminProducts from './components/AdminProducts.jsx'; 

// --- CONFIGURACIÓN ---
const MOCKAPI_URL = 'https://68f7facef7fb897c6617997a.mockapi.io/productos/productos'; 

// NÚMERO DE WHATSAPP CONFIGURADO (Argentina: 54 + 9 + 11 + numero)
const WHATSAPP_NUMBER = '5491132442987'; 

// --- Styled Components ---
const StyledNavbar = styled(Navbar)`
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const StyledLink = styled(Link)`
  color: rgba(0, 0, 0, 0.7);
  margin-right: 15px;
  text-decoration: none;
  font-weight: 500;
  &:hover {
    color: #007bff;
  }
`;

const SearchBarContainer = styled.div`
    width: 250px;
    margin-right: 15px;
    position: relative;
    .form-control { border-radius: 50px; padding-left: 35px; }
    .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #adb5bd; z-index: 5; }
    @media (max-width: 992px) { width: 100%; margin-right: 0; margin-bottom: 10px; margin-top: 10px; }
`;

// --- Componentes ---

const Header = () => {
    const { isLoggedIn, logout } = useAuth();
    const { totalItems } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => { logout(); navigate('/'); };

    return (
        <StyledNavbar bg="white" expand="lg" fixed="top">
            <Container>
                <Navbar.Brand as={Link} to="/" className="fw-bold text-primary" style={{ fontSize: '1.5rem' }}>Maked3co</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto align-items-center">
                        <StyledLink to="/">Inicio</StyledLink>
                        <StyledLink to="/reseñas">Reseñas</StyledLink>
                        <StyledLink to="/contacto">Contacto</StyledLink>
                        {isLoggedIn && <StyledLink to="/admin" className="text-success fw-bold"><FaUserShield className="me-1" />Admin</StyledLink>}
                    </Nav>
                    <Nav className="align-items-center">
                        <Button variant="outline-primary" className="me-3 position-relative d-flex align-items-center" as={Link} to="/cart">
                            <FaShoppingCart className="me-1" /> Carrito
                            {totalItems > 0 && <Badge bg="danger" className="ms-2 rounded-pill">{totalItems}</Badge>}
                        </Button>
                        {isLoggedIn ? (
                            <Button variant="outline-danger" onClick={handleLogout} className="d-flex align-items-center"><FaSignOutAlt className="me-2" />Salir</Button>
                        ) : (
                            <Button variant="primary" as={Link} to="/login" className="d-flex align-items-center"><FaSignInAlt className="me-2" />Ingresar</Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </StyledNavbar>
    );
};

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { isLoggedIn, login } = useAuth(); 
    const navigate = useNavigate();

    useEffect(() => { if (isLoggedIn) navigate('/admin'); }, [isLoggedIn, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username === 'admin' && password === '1234') {
            const success = login(username, password); 
            if (success) navigate('/admin');
        } else {
            toast.error("Credenciales incorrectas. Usa: admin / 1234");
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <Helmet><title>Login | Maked3co</title></Helmet>
            <Card className="shadow-lg p-4 border-0" style={{ width: '100%', maxWidth: '400px' }}>
                <Card.Body>
                    <Card.Title className="text-center mb-4 fw-bold text-primary">Acceso Administrador</Card.Title>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Usuario</Form.Label>
                            <Form.Control type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" required />
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="1234" required />
                        </Form.Group>
                        <div className="d-grid">
                            <Button variant="primary" type="submit" size="lg">Iniciar Sesión</Button>
                        </div>
                    </Form>
                    <div className="mt-3 text-center text-muted" style={{ fontSize: '0.8rem' }}>Credenciales Demo: admin / 1234</div>
                </Card.Body>
            </Card>
        </Container>
    );
};

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const navigate = useNavigate();

    return (
        <Card className="h-100 shadow-sm border-0 hover-scale" style={{ transition: 'transform 0.2s' }}>
            <div style={{ overflow: 'hidden', borderTopLeftRadius: '0.375rem', borderTopRightRadius: '0.375rem' }}>
                <Card.Img variant="top" src={product.image || "https://placehold.co/400x300/e0e7ff/4338ca?text=Sin+Imagen"} alt={product.title} style={{ height: '220px', objectFit: 'cover' }} />
            </div>
            <Card.Body className="d-flex flex-column">
                <Card.Title className="fw-bold text-dark" style={{ fontSize: '1.1rem' }}>{product.title}</Card.Title>
                <Card.Text className="text-muted flex-grow-1" style={{ fontSize: '0.9rem' }}>
                    {product.description ? product.description.substring(0, 80) + '...' : 'Sin descripción.'}
                </Card.Text>
                <div className="mt-auto pt-3 border-top">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="h4 mb-0 text-primary fw-bold">${product.price ? parseFloat(product.price).toFixed(2) : '0.00'}</span>
                    </div>
                    <div className="d-grid gap-2">
                        <Button variant="outline-primary" size="sm" onClick={() => navigate(`/productos/${product.id}`)}>Ver Detalle</Button>
                        <Button variant="success" size="sm" onClick={() => addToCart(product)}><FaShoppingCart className="me-2" /> Agregar</Button>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 8;
    
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await fetch(MOCKAPI_URL); 
                if (!response.ok) throw new Error(`Error API (${response.status})`);
                const data = await response.json();
                setProducts(data);
                setError(null);
            } catch (err) {
                console.error(err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts = useMemo(() => {
        if (!searchTerm) return products;
        const lowerCaseSearch = searchTerm.toLowerCase();
        return products.filter(p =>
            (p.title && p.title.toLowerCase().includes(lowerCaseSearch)) ||
            (p.description && p.description.toLowerCase().includes(lowerCaseSearch))
        );
    }, [products, searchTerm]);

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = (pageNumber) => { setCurrentPage(pageNumber); window.scrollTo(0, 0); };

    if (loading) return <Container className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '50vh' }}><Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} /><p className="mt-3 text-muted">Cargando catálogo...</p></Container>;
    if (error) return <Container className="text-center my-5"><div className="alert alert-danger">Error: {error.message}</div></Container>;

    return (
        <Container className="py-4">
            <Helmet><title>Inicio | Maked3co</title><meta name="description" content="Catálogo de productos de impresión 3D." /></Helmet>
            <div className="text-center mb-5"><h1 className="fw-bold text-dark display-5">Catálogo Maked3co</h1><p className="text-muted lead">Descubre nuestros diseños exclusivos</p></div>
            <div className="bg-white p-3 rounded shadow-sm mb-4 d-flex justify-content-between align-items-center flex-wrap">
                <SearchBarContainer>
                    <FaSearch className="search-icon" />
                    <Form.Control type="text" placeholder="Buscar productos..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
                </SearchBarContainer>
                <div className="text-muted small mt-2 mt-lg-0">Mostrando {currentProducts.length} de {filteredProducts.length} resultados</div>
            </div>
            {filteredProducts.length === 0 ? (
                <div className="text-center py-5 bg-light rounded"><h3 className="text-muted">No se encontraron productos.</h3></div>
            ) : (
                <Row className="g-4">{currentProducts.map(product => (<Col xs={12} sm={6} md={4} lg={3} key={product.id}><ProductCard product={product} /></Col>))}</Row>
            )}
            {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-5">
                    <Pagination>
                        <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
                        {[...Array(totalPages)].map((_, index) => (<Pagination.Item key={index} active={currentPage === index + 1} onClick={() => paginate(index + 1)}>{index + 1}</Pagination.Item>))}
                        <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />
                    </Pagination>
                </div>
            )}
        </Container>
    );
};

const ProductDetail = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`${MOCKAPI_URL}/${id}`)
            .then(res => { if (!res.ok) throw new Error('Not found'); return res.json(); })
            .then(data => { setProduct(data); setLoading(false); })
            .catch(err => { console.error(err); setLoading(false); });
    }, [id]);

    if (loading) return <Container className="text-center my-5"><Spinner animation="border" variant="primary" /></Container>;
    if (!product) return <Container className="text-center my-5"><div className="alert alert-warning">Producto no disponible.</div></Container>;

    return (
        <Container className="py-5">
            <Helmet><title>{product.title} | Detalle</title></Helmet>
            <Card className="border-0 shadow-lg overflow-hidden">
                <Row className="g-0">
                    <Col md={6}><img src={product.image} alt={product.title} className="img-fluid w-100 h-100" style={{ objectFit: 'cover', minHeight: '400px' }} /></Col>
                    <Col md={6}>
                        <Card.Body className="p-5 d-flex flex-column h-100">
                            <h1 className="fw-bold mb-3">{product.title}</h1>
                            <h2 className="text-primary mb-4">${parseFloat(product.price).toFixed(2)}</h2>
                            <p className="lead text-muted mb-5">{product.description}</p>
                            <div className="mt-auto">
                                <Button variant="success" size="lg" className="w-100 py-3 fw-bold" onClick={() => addToCart(product)}><FaShoppingCart className="me-2" /> AÑADIR AL CARRITO</Button>
                                <Link to="/" className="btn btn-outline-secondary w-100 mt-3">Volver al Catálogo</Link>
                            </div>
                        </Card.Body>
                    </Col>
                </Row>
            </Card>
        </Container>
    );
};

// --- CARRITO MODIFICADO CON WHATSAPP ---
const CartPage = () => {
    const { cart, totalAmount, removeFromCart, updateQuantity, clearCart } = useCart();
    const [isCheckingOut, setIsCheckingOut] = useState(false); // Estado para controlar la vista de resumen

    // Función para generar el mensaje y abrir WhatsApp
    const handleWhatsAppCheckout = () => {
        let message = `Hola Maked3co! 👋 Quiero finalizar mi compra:%0A%0A`;
        
        cart.forEach(item => {
            message += `▪️ ${item.quantity}x ${item.title} - $${(item.price * item.quantity).toFixed(2)}%0A`;
        });

        message += `%0A*Total: $${totalAmount.toFixed(2)}*%0A%0A`;
        message += `Espero los datos para realizar el pago. Gracias!`;

        // Abrir WhatsApp
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
        
        // Vaciar carrito y volver al inicio
        clearCart();
        toast.success("¡Pedido enviado a WhatsApp! Te responderemos a la brevedad.");
        setIsCheckingOut(false);
    };

    return (
        <Container className="py-5">
            <Helmet><title>Carrito de Compras</title></Helmet>
            
            {!isCheckingOut ? (
                // VISTA DEL CARRITO NORMAL (Edición)
                <>
                    <h2 className="mb-4 fw-bold border-bottom pb-3">Tu Carrito</h2>
                    {cart.length === 0 ? (
                        <div className="text-center py-5 bg-light rounded"><h3>Tu carrito está vacío 🛒</h3><p className="text-muted">¡Agrega algunos productos geniales!</p><Button as={Link} to="/" variant="primary" className="mt-3">Ir a Comprar</Button></div>
                    ) : (
                        <Row>
                            <Col lg={8}>
                                {cart.map(item => (
                                    <Card key={item.id} className="mb-3 border-0 shadow-sm">
                                        <Card.Body>
                                            <Row className="align-items-center">
                                                <Col xs={3} md={2}><img src={item.image} alt={item.title} className="img-fluid rounded" onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100?text=3D"; }} /></Col>
                                                <Col xs={9} md={4}><h5 className="mb-1">{item.title}</h5><small className="text-muted">Precio: ${item.price.toFixed(2)}</small></Col>
                                                <Col xs={6} md={3}><div className="d-flex align-items-center"><Button variant="outline-secondary" size="sm" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</Button><span className="mx-3 fw-bold">{item.quantity}</span><Button variant="outline-secondary" size="sm" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button></div></Col>
                                                <Col xs={6} md={3} className="text-end"><div className="fw-bold mb-2">${(item.price * item.quantity).toFixed(2)}</div><Button variant="link" className="text-danger p-0 text-decoration-none" onClick={() => removeFromCart(item.id)}>Eliminar</Button></Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                ))}
                            </Col>
                            <Col lg={4}>
                                <Card className="border-0 shadow-sm bg-light">
                                    <Card.Body className="p-4">
                                        <h4 className="card-title mb-4">Resumen</h4>
                                        <div className="d-flex justify-content-between mb-2"><span>Subtotal</span><span>${totalAmount.toFixed(2)}</span></div>
                                        <hr /><div className="d-flex justify-content-between mb-4 fs-4 fw-bold"><span>Total</span><span>${totalAmount.toFixed(2)}</span></div>
                                        <div className="d-grid gap-2">
                                            {/* CAMBIO: Botón activa el modo Checkout */}
                                            <Button variant="primary" size="lg" onClick={() => setIsCheckingOut(true)}>Finalizar Compra</Button>
                                            <Button variant="outline-danger" onClick={clearCart}>Vaciar Carrito</Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    )}
                </>
            ) : (
                // VISTA DE RESUMEN DE COMPRA (Pre-WhatsApp)
                <div className="d-flex justify-content-center">
                    <Card className="shadow-lg border-0" style={{ maxWidth: '600px', width: '100%' }}>
                        <Card.Header className="bg-success text-white text-center py-3">
                            <h3 className="mb-0 fw-bold">Confirmar Pedido</h3>
                        </Card.Header>
                        <Card.Body className="p-4">
                            <h5 className="mb-3 text-muted">Estás a un paso de finalizar tu compra.</h5>
                            <ListGroup variant="flush" className="mb-4">
                                {cart.map(item => (
                                    <ListGroup.Item key={item.id} className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>{item.quantity}x</strong> {item.title}
                                        </div>
                                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                                    </ListGroup.Item>
                                ))}
                                <ListGroup.Item className="d-flex justify-content-between align-items-center bg-light fw-bold fs-5">
                                    <span>TOTAL A PAGAR:</span>
                                    <span>${totalAmount.toFixed(2)}</span>
                                </ListGroup.Item>
                            </ListGroup>
                            
                            <div className="alert alert-info small">
                                Al confirmar, se abrirá WhatsApp con el detalle de tu pedido para coordinar el pago y el envío directamente con nosotros.
                            </div>

                            <div className="d-grid gap-2">
                                <Button variant="success" size="lg" onClick={handleWhatsAppCheckout} className="d-flex align-items-center justify-content-center">
                                    <FaWhatsapp size={24} className="me-2" /> Confirmar y Pagar por WhatsApp
                                </Button>
                                <Button variant="outline-secondary" onClick={() => setIsCheckingOut(false)} className="d-flex align-items-center justify-content-center">
                                    <FaArrowLeft className="me-2" /> Volver al Carrito
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            )}
        </Container>
    );
};

const Reviews = () => (
    <Container className="py-5 text-center">
        <Helmet><title>Reseñas | Maked3co</title></Helmet>
        <h2 className="mb-4">Lo que dicen nuestros clientes</h2>
        <Row className="justify-content-center">
            {[1, 2, 3].map(i => (
                <Col md={4} key={i} className="mb-3"><Card className="h-100 shadow-sm border-0"><Card.Body><p className="text-warning mb-2">★★★★★</p><Card.Text>"Excelente calidad de impresión y envío muy rápido."</Card.Text><footer className="blockquote-footer mt-3">Cliente {i}</footer></Card.Body></Card></Col>
            ))}
        </Row>
    </Container>
);

const Contact = () => {
    return (
        <Container className="py-5">
            <Helmet><title>Contacto | Maked3co</title></Helmet>
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="shadow border-0 p-4">
                        <Card.Body>
                            <h2 className="text-center mb-4">Contáctanos</h2>
                            <Form>
                                <Form.Group className="mb-3"><Form.Label>Nombre</Form.Label><Form.Control type="text" placeholder="Tu nombre" /></Form.Group>
                                <Form.Group className="mb-3"><Form.Label>Email</Form.Label><Form.Control type="email" placeholder="nombre@ejemplo.com" /></Form.Group>
                                <Form.Group className="mb-3"><Form.Label>Mensaje</Form.Label><Form.Control as="textarea" rows={4} /></Form.Group>
                                <Button variant="primary" type="submit" className="w-100">Enviar Mensaje</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

const PrivateRoute = ({ children }) => {
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();
    useEffect(() => { if (!isLoggedIn) { toast.warn("Debes iniciar sesión para acceder a esta sección."); navigate('/login'); } }, [isLoggedIn, navigate]);
    return isLoggedIn ? children : null;
};

const App = () => {
    return (
        <>
            <Helmet><title>Maked3co | Impresión 3D</title><meta name="description" content="Tienda de productos impresos en 3D" /></Helmet>
            <Header />
            <MainContainer>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/productos/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/reseñas" element={<Reviews />} />
                    <Route path="/contacto" element={<Contact />} />
                    <Route path="/admin" element={<PrivateRoute><AdminProducts /></PrivateRoute>} />
                    <Route path="*" element={<Container className="text-center py-5"><h1 className="display-1 fw-bold text-danger">404</h1><p className="lead">Página no encontrada</p><Button as={Link} to="/" variant="outline-primary">Volver al Inicio</Button></Container>} />
                </Routes>
            </MainContainer>
            <FooterContainer><Container><p className="mb-0">© {new Date().getFullYear()} Maked3co. Todos los derechos reservados.</p></Container></FooterContainer>
        </>
    );
};

export default App;