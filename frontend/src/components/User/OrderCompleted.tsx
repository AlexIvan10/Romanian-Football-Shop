import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    Button,
    Paper,
    Card,
    CardContent,
    Fade,
    Grow,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HomeIcon from '@mui/icons-material/Home';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import EmailIcon from '@mui/icons-material/Email';

interface OrderData {
    orderId?: number;
    total?: number;
}

const OrderCompleted: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const orderData = location.state as OrderData;

    useEffect(() => {
        // If no order data is passed, redirect to home (prevents direct access)
        if (!orderData) {
            navigate('/');
        }
    }, [orderData, navigate]);

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            py: 8,
            display: 'flex',
            alignItems: 'center',
        }}>
            <Container maxWidth="md">
                <Fade in timeout={800}>
                    <Paper
                        elevation={24}
                        sx={{
                            p: 6,
                            borderRadius: 4,
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(20px)',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                            textAlign: 'center'
                        }}
                    >
                        {/* Success Icon */}
                        <Grow in timeout={1000}>
                            <Box sx={{ mb: 4 }}>
                                <CheckCircleIcon
                                    sx={{
                                        fontSize: 120,
                                        color: '#4caf50',
                                        filter: 'drop-shadow(0 4px 8px rgba(76, 175, 80, 0.3))',
                                        animation: 'pulse 2s infinite',
                                        '@keyframes pulse': {
                                            '0%': { transform: 'scale(1)' },
                                            '50%': { transform: 'scale(1.05)' },
                                            '100%': { transform: 'scale(1)' }
                                        }
                                    }}
                                />
                            </Box>
                        </Grow>

                        {/* Main Title */}
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 700,
                                mb: 2,
                                background: 'linear-gradient(45deg, #4caf50, #8bc34a)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                color: 'transparent',
                            }}
                        >
                            Order Completed!
                        </Typography>

                        <Typography
                            variant="h6"
                            color="text.secondary"
                            sx={{ mb: 4, lineHeight: 1.6 }}
                        >
                            Thank you for your purchase! Your order has been successfully placed and is being processed.
                        </Typography>

                        {/* Order Details Card */}
                        {orderData && (
                            <Fade in timeout={1200}>
                                <Card
                                    sx={{
                                        mb: 4,
                                        background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
                                        border: '1px solid rgba(25, 118, 210, 0.2)',
                                        borderRadius: 3,
                                    }}
                                >
                                    <CardContent sx={{ py: 3 }}>
                                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                            Order Details
                                        </Typography>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            {orderData.orderId && (
                                                <Typography variant="body1">
                                                    <strong>Order ID:</strong> #{orderData.orderId}
                                                </Typography>
                                            )}
                                            {orderData.total && (
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        color: '#1976d2',
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    Total: ${orderData.total.toFixed(2)}
                                                </Typography>
                                            )}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Fade>
                        )}

                        {/* Information Cards */}
                        <Box sx={{ mb: 4 }}>
                            <Fade in timeout={1400}>
                                <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
                                    <Card sx={{
                                        flex: 1,
                                        minWidth: 200,
                                        background: 'rgba(33, 150, 243, 0.1)',
                                        border: '1px solid rgba(33, 150, 243, 0.2)'
                                    }}>
                                        <CardContent sx={{ textAlign: 'center', py: 2 }}>
                                            <LocalShippingIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                Your order will be processed and shipped within 2-3 business days
                                            </Typography>
                                        </CardContent>
                                    </Card>

                                    <Card sx={{
                                        flex: 1,
                                        minWidth: 200,
                                        background: 'rgba(76, 175, 80, 0.1)',
                                        border: '1px solid rgba(76, 175, 80, 0.2)'
                                    }}>
                                        <CardContent sx={{ textAlign: 'center', py: 2 }}>
                                            <EmailIcon sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                A confirmation email will be sent to your registered email address
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Box>
                            </Fade>
                        </Box>

                        {/* Home Button */}
                        <Fade in timeout={1600}>
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<HomeIcon />}
                                onClick={handleGoHome}
                                sx={{
                                    py: 2,
                                    px: 6,
                                    borderRadius: 3,
                                    textTransform: 'none',
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                                    boxShadow: '0 6px 20px rgba(25, 118, 210, 0.3)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 8px 25px rgba(25, 118, 210, 0.4)',
                                        background: 'linear-gradient(45deg, #1565c0 30%, #1e88e5 90%)',
                                    }
                                }}
                            >
                                Back to Home
                            </Button>
                        </Fade>

                        {/* Footer */}
                        <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                                <SportsSoccerIcon
                                    sx={{
                                        fontSize: 32,
                                        color: '#1976d2',
                                        animation: 'spin 4s linear infinite',
                                        '@keyframes spin': {
                                            '0%': { transform: 'rotate(0deg)' },
                                            '100%': { transform: 'rotate(360deg)' }
                                        }
                                    }}
                                />
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 600,
                                        background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        color: 'transparent',
                                    }}
                                >
                                    Romanian Football Store
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Thank you for choosing us for your football gear!
                            </Typography>
                        </Box>
                    </Paper>
                </Fade>
            </Container>
        </Box>
    );
};

export default OrderCompleted;