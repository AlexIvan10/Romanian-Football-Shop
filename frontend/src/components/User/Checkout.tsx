import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../../utils/AuthContext';
import {
    Container,
    Typography,
    Box,
    TextField,
    Button,
    RadioGroup,
    FormControlLabel,
    Radio,
    Paper,
    Grid,
    Divider,
    Alert,
    CircularProgress,
    AppBar,
    Toolbar
} from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

interface CartItemDTO {
    id: number;
    product: {
        id: number;
        name: string;
        price: number;
    };
    size: string;
    quantity: number;
    player: string | null;
    number: string | null;
    price: number;
}

interface OrderFormData {
    city: string;
    street: string;
    number: string;
    postalCode: string;
    paymentMethod: 'CARD' | 'RAMBURS';
}

interface FormErrors {
    city?: string;
    street?: string;
    number?: string;
    postalCode?: string;
}

interface CouponResult {
    valid: boolean;
    discountPercentage?: number;
    message?: string;
    discountId?: number; // Add this
}

const Checkout = () => {
    const navigate = useNavigate();
    const {user} = useAuth();
    const [cartItems, setCartItems] = useState<CartItemDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [couponCode, setCouponCode] = useState('');
    const [couponResult, setCouponResult] = useState<CouponResult | null>(null);
    const [formData, setFormData] = useState<OrderFormData>({
        city: '',
        street: '',
        number: '',
        postalCode: '',
        paymentMethod: 'CARD'
    });
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [orderProcessing, setOrderProcessing] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchCartItems();
    }, [user, navigate]);

    const fetchCartItems = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/cart/user/${user?.id}/items`, {
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Failed to fetch cart items');
            const data = await response.json();
            setCartItems(data);
        } catch (error) {
            console.error('Error fetching cart items:', error);
        } finally {
            setLoading(false);
        }
    };

    const validateForm = (): boolean => {
        const errors: FormErrors = {};
        let isValid = true;

        if (!formData.city.trim()) {
            errors.city = 'Please complete the city field';
            isValid = false;
        }

        if (!formData.street.trim()) {
            errors.street = 'Please complete the street field';
            isValid = false;
        }

        if (!formData.number.trim()) {
            errors.number = 'Please complete the street number field';
            isValid = false;
        }

        if (!formData.postalCode.trim()) {
            errors.postalCode = 'Please complete the postal code field';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (formErrors[name as keyof FormErrors]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const applyCoupon = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/discount/validate?code=${encodeURIComponent(couponCode.trim())}`,
                {
                    credentials: 'include',
                    headers: {
                        'Accept': 'application/json'
                    }
                }
            );

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            console.log('Coupon validation response:', data); // Add this log
            setCouponResult(data);
        } catch (error) {
            console.error('Error applying coupon:', error);
            setCouponResult({
                valid: false,
                message: 'Error applying coupon. Please try again.'
            });
        }
    };


    const handleSubmitOrder = async () => {
        if (!validateForm()) return;

        setOrderProcessing(true);
        try {
            const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
            const discountAmount = couponResult?.valid && couponResult.discountPercentage
                ? (subtotal * couponResult.discountPercentage) / 100
                : 0;
            const total = subtotal - discountAmount;

            const orderItems = cartItems.map(item => ({
                productId: item.product.id,
                size: item.size,
                quantity: item.quantity,
                player: item.player,
                number: item.number,
                price: item.price
            }));

            console.log("Full coupon result:", couponResult);
            console.log("Discount ID from coupon:", couponResult?.discountId);

            const orderData = {
                userId: user?.id,
                discountId: couponResult?.valid ? couponResult.discountId : null,
                totalPrice: total,  // This is already the discounted total
                status: 'pending',
                city: formData.city,
                street: formData.street,
                number: formData.number,
                postalCode: formData.postalCode,
                orderItems: orderItems
            };

            console.log("Complete order data being sent:", JSON.stringify(orderData, null, 2));

            const response = await fetch('http://localhost:8080/api/orders', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error("Order creation failed:", errorData);
                throw new Error('Failed to create order');
            }

            const orderResponse = await response.json();
            console.log("Order creation response:", orderResponse);

            // Navigate to order completed page with order data
            navigate('/order-completed', {
                state: {
                    orderId: orderResponse.id,
                    total: total
                }
            });

        } catch (error) {
            console.error('Error processing order:', error);
            alert('Failed to process order. Please try again.');
        } finally {
            setOrderProcessing(false);
        }
    };

    const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
    const discountAmount = couponResult?.valid && couponResult.discountPercentage
        ? (subtotal * couponResult.discountPercentage) / 100
        : 0;
    const total = subtotal - discountAmount;

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
                        onClick={() => navigate('/')}
                    >
                        <SportsSoccerIcon
                            sx={{
                                fontSize: 48,
                                color: '#1976d2',
                                animation: 'spin 4s linear infinite',
                                '@keyframes spin': {
                                    '0%': { transform: 'rotate(0deg)' },
                                    '100%': { transform: 'rotate(360deg)' }
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

                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                        <Button
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate('/')}
                            variant="contained"
                            sx={{
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
                        <Button
                            startIcon={<ShoppingCartIcon />}
                            onClick={() => navigate('/cart')}
                            variant="contained"
                            sx={{
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
                            Back to cart
                        </Button>
                    </Box>
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
                        Checkout
                    </Typography>

                    <Grid container spacing={4}>
                        <Grid size = {{xs: 12, md: 8}}>
                            <Paper sx={{
                                p: 3,
                                mb: 3,
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(10px)',
                            }}>
                                <Typography
                                    variant="h6"
                                    gutterBottom
                                    sx={{
                                        background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        color: 'transparent',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Delivery Address
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid size = {{xs: 12}}>
                                        <TextField
                                            fullWidth
                                            label="City"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            error={!!formErrors.city}
                                            helperText={formErrors.city}
                                        />
                                    </Grid>
                                    <Grid size = {{xs: 12}}>
                                        <TextField
                                            fullWidth
                                            label="Street"
                                            name="street"
                                            value={formData.street}
                                            onChange={handleInputChange}
                                            error={!!formErrors.street}
                                            helperText={formErrors.street}
                                        />
                                    </Grid>
                                    <Grid size = {{xs: 12, sm: 6}}>
                                        <TextField
                                            fullWidth
                                            label="Number"
                                            name="number"
                                            value={formData.number}
                                            onChange={handleInputChange}
                                            error={!!formErrors.number}
                                            helperText={formErrors.number}
                                        />
                                    </Grid>
                                    <Grid size = {{xs: 12, sm: 6}}>
                                        <TextField
                                            fullWidth
                                            label="Postal Code"
                                            name="postalCode"
                                            value={formData.postalCode}
                                            onChange={handleInputChange}
                                            error={!!formErrors.postalCode}
                                            helperText={formErrors.postalCode}
                                        />
                                    </Grid>
                                </Grid>
                            </Paper>

                            <Paper sx={{
                                p: 3,
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(10px)',
                            }}>
                                <Typography
                                    variant="h6"
                                    gutterBottom
                                    sx={{
                                        background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        color: 'transparent',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Payment Method
                                </Typography>
                                <RadioGroup
                                    value={formData.paymentMethod}
                                    onChange={handleInputChange}
                                    name="paymentMethod"
                                >
                                    <FormControlLabel
                                        value="CARD"
                                        control={<Radio />}
                                        label="Credit/debit card"
                                    />
                                    <FormControlLabel
                                        value="RAMBURS"
                                        control={<Radio />}
                                        label="Cash on delivery"
                                    />
                                </RadioGroup>
                            </Paper>
                        </Grid>

                        <Grid size = {{xs: 12, md: 4}}>
                            <Paper sx={{
                                p: 3,
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(10px)',
                            }}>
                                <Typography
                                    variant="h6"
                                    gutterBottom
                                    sx={{
                                        background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        color: 'transparent',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Order Summary
                                </Typography>

                                {cartItems.map((item) => (
                                    <Box key={item.id} sx={{ mb: 2 }}>
                                        <Typography variant="body1">
                                            {item.product.name} x {item.quantity}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Size: {item.size}
                                            {item.player && `, Name: ${item.player}`}
                                            {item.number && `, Number: ${item.number}`}
                                        </Typography>
                                        <Typography variant="body2" sx={{
                                            background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                                            backgroundClip: 'text',
                                            WebkitBackgroundClip: 'text',
                                            color: 'transparent',
                                            fontWeight: 'bold'
                                        }}>
                                            $ {item.price.toFixed(2)}
                                        </Typography>
                                        <Divider sx={{ mt: 1 }} />
                                    </Box>
                                ))}

                                <Box sx={{ mb: 2 }}>
                                    <TextField
                                        size="small"
                                        label="Coupon code"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        error={couponResult?.valid === false}
                                        helperText={couponResult?.valid === false ? couponResult.message : ''}
                                        sx={{ mr: 1, width: '70%' }}
                                    />
                                    <Button
                                        variant="contained"
                                        onClick={applyCoupon}
                                        sx={{
                                            mt: 1,
                                            background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                                            '&:hover': {
                                                background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                                            }
                                        }}
                                        disabled={!couponCode.trim()}
                                    >
                                        Apply
                                    </Button>
                                </Box>

                                {couponResult?.valid && (
                                    <Alert severity="success" sx={{ mb: 2 }}>
                                        Coupon applied successfully! {couponResult.discountPercentage}% discount
                                    </Alert>
                                )}

                                <Divider sx={{ my: 2 }} />

                                <Box sx={{ mb: 2 }}>
                                    <Typography sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Subtotal:</span>
                                        <span>$ {subtotal.toFixed(2)}</span>
                                    </Typography>

                                    {couponResult?.valid && (
                                        <Typography sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            color: 'green'
                                        }}>
                                            <span>Discount ({couponResult.discountPercentage}%):</span>
                                            <span>- $ {discountAmount.toFixed(2)}</span>
                                        </Typography>
                                    )}

                                    <Typography variant="h6" sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        mt: 2,
                                        background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        color: 'transparent',
                                        fontWeight: 'bold'
                                    }}>
                                        <span>Total:</span>
                                        <span>$ {total.toFixed(2)}</span>
                                    </Typography>
                                </Box>

                                <Button
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                    onClick={handleSubmitOrder}
                                    disabled={orderProcessing}
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
                                    {orderProcessing ? <CircularProgress size={24} /> : 'Place Order'}
                                </Button>
                            </Paper>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </Box>
    );
};

export default Checkout;