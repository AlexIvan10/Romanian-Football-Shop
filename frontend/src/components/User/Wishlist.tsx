import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
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
    CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

interface ProductDTO {
    id: number;
    name: string;
    description: string;
    price: number;
    team: string;
    photoUrl: string;
    licenced: boolean;
}

interface WishlistItemDTO {
    id: number;
    product: ProductDTO;
}

const Wishlist = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [wishlistItems, setWishlistItems] = useState<WishlistItemDTO[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchWishlistItems = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/wishlist/user/${user?.id}/items`, {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch wishlist items');
            }

            const data = await response.json();
            setWishlistItems(data);
        } catch (error) {
            console.error('Error fetching wishlist items:', error);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchWishlistItems();
    }, [user, navigate, fetchWishlistItems]);

    const removeFromWishlist = async (itemId: number) => {
        try {
            const response = await fetch(`http://localhost:8080/api/wishlistItems/${itemId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to remove item from wishlist');
            }

            setWishlistItems(prevItems => prevItems.filter(item => item.id !== itemId));
        } catch (error) {
            console.error('Error removing item from wishlist:', error);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
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

                    <Button
                        startIcon={<ArrowBackIcon />}
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
                        My Wishlist
                    </Typography>

                    {wishlistItems.length === 0 ? (
                        <Typography variant="h6" textAlign="center">
                            Your wishlist is empty
                        </Typography>
                    ) : (
                        <>
                            {wishlistItems.map((item) => (
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
                                        <Grid container spacing={2} alignItems="center">
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
                                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                    {item.product.name}
                                                </Typography>
                                                <Typography variant="body1" color="text.secondary">
                                                    Team: {item.product.team}
                                                </Typography>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 3 }}>
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
                                            <Grid size={{ xs: 12, sm: 3 }} sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                gap: 2
                                            }}>
                                                <IconButton
                                                    onClick={() => navigate(`/product/${item.product.id}`)}
                                                    sx={{
                                                        color: '#1976d2',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(25, 118, 210, 0.1)',
                                                            transform: 'scale(1.1)',
                                                        },
                                                    }}
                                                >
                                                    <ShoppingCartIcon />
                                                </IconButton>
                                                <IconButton
                                                    onClick={() => removeFromWishlist(item.id)}
                                                    sx={{
                                                        color: '#ef5350',
                                                        '&:hover': {
                                                            backgroundColor: 'rgba(239, 83, 80, 0.1)',
                                                            transform: 'scale(1.1)',
                                                        },
                                                    }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            ))}
                        </>
                    )}
                </Paper>
            </Container>
        </Box>
    );
};

export default Wishlist;