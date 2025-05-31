import React, {useState, useEffect, useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../../utils/AuthContext';
import {
    Container,
    Typography,
    Box,
    Paper,
    Grid,
    IconButton,
    Button,
    Card,
    CardContent,
    Divider,
    CircularProgress,
} from '@mui/material';
import {styled} from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface ProductDTO {
    id: number;
    name: string;
    description: string;
    price: number;
    team: string;
    photoUrl: string;
    licenced: boolean;
}

interface CartItemDTO {
    id: number;
    product: ProductDTO;
    size: string;
    quantity: number;
    player: string | null;
    number: string | null;
    price: number;
}

const Cart: React.FC = () => {
    const navigate = useNavigate();
    const {user} = useAuth();
    const [cartItems, setCartItems] = useState<CartItemDTO[]>([]);
    const [loading, setLoading] = useState(true);

    const MAX_QUANTITY = 10;
    const MIN_QUANTITY = 1;

    const fetchCartItems = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/cart/user/${user?.id}/items`, {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch cart items');
            }

            const data = await response.json();
            setCartItems(data);
        } catch (error) {
            console.error('Error fetching cart items:', error);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchCartItems();
    }, [user, navigate, fetchCartItems]);

    const updateQuantity = async (itemId: number, newQuantity: number) => {
        if (newQuantity < MIN_QUANTITY || newQuantity > MAX_QUANTITY) return;

        try {
            const response = await fetch(`http://localhost:8080/api/cartItems/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({quantity: newQuantity})
            });

            if (!response.ok) {
                throw new Error('Failed to update quantity');
            }

            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.id === itemId
                        ? {...item, quantity: newQuantity}
                        : item
                )
            );
        } catch (error) {
            console.error('Error updating quantity:', error);
            await fetchCartItems();
        }
    };

    const removeItem = async (itemId: number) => {
        try {
            const response = await fetch(`http://localhost:8080/api/cartItems/${itemId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to remove item');
            }

            setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
        } catch (error) {
            console.error('Error removing item:', error);
            await fetchCartItems();
        }
    };

    const subtotal = cartItems.reduce((sum, item) =>
        sum + (item.product.price * item.quantity), 0
    );

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress/>
            </Box>
        );
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            py: 8,
        }}>
            <Container maxWidth="lg">
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mb: 4
                }}>
                    {/* Logo Section */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            mb: 4,
                            cursor: 'pointer',
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                                transform: 'scale(1.05)'
                            }
                        }}
                    >
                        <SportsSoccerIcon
                            sx={{
                                fontSize: 48,
                                color: '#1976d2',
                                animation: 'spin 4s linear infinite',
                                '@keyframes spin': {
                                    '0%': {transform: 'rotate(0deg)'},
                                    '100%': {transform: 'rotate(360deg)'}
                                }
                            }}
                        />
                        <Box>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 'bold',
                                    background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    color: 'transparent',
                                }}
                            >
                                Romanian Football Store
                            </Typography>
                        </Box>
                    </Box>

                    <Button
                        startIcon={<ArrowBackIcon/>}
                        onClick={() => navigate('/')}
                        variant="contained"
                        sx={{
                            mb: 3,
                            py: 1.5,
                            px: 4,
                            borderRadius: 2,
                            textTransform: 'none',
                            background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                            boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
                            transition: 'transform 0.2s',
                            '&:hover': {
                                transform: 'scale(1.05)',
                                background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                            }
                        }}
                    >
                        Back to main page
                    </Button>
                </Box>

                <Paper
                    elevation={24}
                    sx={{
                        p: 4,
                        borderRadius: 3,
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
                    }}
                >
                    <Typography
                        variant="h3"
                        component="h1"
                        gutterBottom
                        align="center"
                        sx={{
                            mb: 6,
                            fontWeight: 700,
                            background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                        }}
                    >
                        My Cart
                    </Typography>

                    {cartItems.length === 0 ? (
                        <Typography variant="h6" textAlign="center">
                            Your cart is empty
                        </Typography>
                    ) : (
                        <>
                            {cartItems.map((item) => (
                                <Card
                                    key={item.id}
                                    sx={{
                                        mb: 2,
                                        background: 'rgba(255, 255, 255, 0.95)',
                                        backdropFilter: 'blur(10px)',
                                        transition: 'transform 0.2s ease',
                                        '&:hover': {
                                            transform: 'scale(1.01)',
                                            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                                        },
                                    }}
                                >
                                    <CardContent>
                                        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                                            <Grid size={{ xs: 12, sm: 3 }}>
                                                <img
                                                    src={item.product.photoUrl || '/placeholder.png'}
                                                    alt={item.product.name}
                                                    style={{
                                                        width: '100%',
                                                        maxWidth: '150px',
                                                        height: '150px',
                                                        objectFit: 'contain'
                                                    }}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 4 }}>
                                                <Typography variant="h6" sx={{fontWeight: 'bold'}}>
                                                    {item.product.name}
                                                </Typography>
                                                <Typography variant="body1" color="text.secondary">
                                                    Size: {item.size}
                                                </Typography>
                                                {item.player && (
                                                    <Typography variant="body1" color="text.secondary">
                                                        Name: {item.player}
                                                    </Typography>
                                                )}
                                                {item.number && (
                                                    <Typography variant="body1" color="text.secondary">
                                                        Number: {item.number}
                                                    </Typography>
                                                )}
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 2 }}>
                                                <Typography variant="h6" sx={{
                                                    textAlign: 'center',
                                                    background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                                                    backgroundClip: 'text',
                                                    WebkitBackgroundClip: 'text',
                                                    color: 'transparent',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {item.product.price.toFixed(2)} RON
                                                </Typography>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 2 }}>
                                                <Box display="flex" alignItems="center" justifyContent="center">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        disabled={item.quantity <= MIN_QUANTITY}
                                                        sx={{
                                                            color: '#1976d2',
                                                            '&:hover': {backgroundColor: 'rgba(25, 118, 210, 0.1)'},
                                                        }}
                                                    >
                                                        <RemoveIcon/>
                                                    </IconButton>
                                                    <Typography sx={{mx: 2, fontWeight: 'bold'}}>
                                                        {item.quantity}
                                                    </Typography>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        disabled={item.quantity >= MAX_QUANTITY}
                                                        sx={{
                                                            color: '#1976d2',
                                                            '&:hover': {backgroundColor: 'rgba(25, 118, 210, 0.1)'},
                                                        }}
                                                    >
                                                        <AddIcon/>
                                                    </IconButton>
                                                </Box>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 1 }}>
                                                <IconButton
                                                    onClick={() => removeItem(item.id)}
                                                    sx={{
                                                        color: '#ef5350',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(239, 83, 80, 0.1)',
                                                            transform: 'scale(1.1)',
                                                        },
                                                    }}
                                                >
                                                    <DeleteIcon/>
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            ))}

                            <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 4}}>
                                <Card sx={{
                                    width: '300px',
                                    background: 'rgba(255, 255, 255, 0.95)',
                                    backdropFilter: 'blur(10px)',
                                }}>
                                    <CardContent>
                                        <Typography variant="h6" sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            mb: 2,
                                            fontWeight: 'bold'
                                        }}>
                                            <span>Total:</span>
                                            <span style={{
                                                background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                                                backgroundClip: 'text',
                                                WebkitBackgroundClip: 'text',
                                                color: 'transparent',
                                            }}>
                                                {subtotal.toFixed(2)} RON
                                            </span>
                                        </Typography>

                                        <Button
                                            variant="contained"
                                            fullWidth
                                            onClick={() => navigate('/checkout')}
                                            sx={{
                                                background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                                                color: 'white',
                                                padding: '12px',
                                                borderRadius: '8px',
                                                textTransform: 'none',
                                                fontWeight: 'bold',
                                                boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
                                                transition: 'transform 0.2s',
                                                '&:hover': {
                                                    transform: 'scale(1.02)',
                                                    background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                                                }
                                            }}
                                        >
                                            Proceed to Checkout
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Box>
                        </>
                    )}
                </Paper>
            </Container>
        </Box>
    );
};

export default Cart;