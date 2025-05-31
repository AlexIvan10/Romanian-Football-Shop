import React, {useEffect} from 'react';
import {
    Container,
    Box,
    Typography,
    Button,
    Grid,
    Paper,
    IconButton,
    Card,
    CardContent,
    Divider,
    Chip,
} from '@mui/material';
import { useAuth } from '../../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import LogoutIcon from '@mui/icons-material/Logout';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import AssessmentIcon from '@mui/icons-material/Assessment';

export const AdminPage: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role !== 'ADMIN') {
            navigate('/');
            return;
        }
    }, [user, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // If user is not admin, don't render the component
    if (!user || user.role !== 'ADMIN') {
        return null;
    }

    const managementOptions = [
        {
            title: "Client Management",
            description: "Manage customer accounts",
            icon: <PeopleIcon sx={{ fontSize: 48 }} />,
            path: "/admin/clients",
            color: "#1976d2",
            gradient: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)"
        },
        {
            title: "Order Management",
            description: "View and process orders",
            icon: <ShoppingCartIcon sx={{ fontSize: 48 }} />,
            path: "/admin/orders",
            color: "#2e7d32",
            gradient: "linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)"
        },
        {
            title: "Coupon Management",
            description: "Create and manage coupons",
            icon: <LocalOfferIcon sx={{ fontSize: 48 }} />,
            path: "/admin/coupons",
            color: "#9c27b0",
            gradient: "linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)"
        },
        {
            title: "Product Management",
            description: "Add and edit products",
            icon: <InventoryIcon sx={{ fontSize: 48 }} />,
            path: "/admin/products",
            color: "#ed6c02",
            gradient: "linear-gradient(135deg, #ed6c02 0%, #ff9800 100%)"
        },
        {
            title: "Stock Management",
            description: "Monitor available inventory",
            icon: <AssessmentIcon sx={{ fontSize: 48 }} />,
            path: "/admin/stocks",
            color: "#d32f2f",
            gradient: "linear-gradient(135deg, #d32f2f 0%, #f44336 100%)"
        },
        {
            title: "Product Photo Management",
            description: "Upload and organize images",
            icon: <PhotoLibraryIcon sx={{ fontSize: 48 }} />,
            path: "/admin/photos",
            color: "#7b1fa2",
            gradient: "linear-gradient(135deg, #7b1fa2 0%, #ab47bc 100%)"
        }
    ];

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            py: 6,
        }}>
            <Container maxWidth="xl">
                {/* Header Section */}
                <Paper
                    elevation={8}
                    sx={{
                        p: 4,
                        mb: 6,
                        borderRadius: 4,
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                >
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 3
                    }}>
                        {/* Logo and Title */}
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 3,
                        }}>
                            <Box sx={{
                                position: 'relative',
                                p: 2,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                                boxShadow: '0 8px 24px rgba(25, 118, 210, 0.3)',
                            }}>
                                <SportsSoccerIcon
                                    sx={{
                                        fontSize: 40,
                                        color: 'white',
                                        animation: 'spin 6s linear infinite',
                                        '@keyframes spin': {
                                            '0%': { transform: 'rotate(0deg)' },
                                            '100%': { transform: 'rotate(360deg)' }
                                        }
                                    }}
                                />
                            </Box>
                            <Box>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontWeight: 800,
                                        background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        color: 'transparent',
                                        mb: 0.5,
                                    }}
                                >
                                    Romanian Football Store
                                </Typography>
                                <Chip
                                    label="Admin Dashboard"
                                    size="small"
                                    sx={{
                                        background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                                        color: 'white',
                                        fontWeight: 'bold'
                                    }}
                                />
                            </Box>
                        </Box>

                        {/* Logout Button */}
                        <Button
                            variant="contained"
                            onClick={handleLogout}
                            startIcon={<LogoutIcon />}
                            sx={{
                                px: 4,
                                py: 1.5,
                                borderRadius: 3,
                                textTransform: 'none',
                                fontWeight: 600,
                                background: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)',
                                boxShadow: '0 6px 20px rgba(211, 47, 47, 0.3)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #c62828 0%, #e53935 100%)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 25px rgba(211, 47, 47, 0.4)',
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            Logout
                        </Button>
                    </Box>
                </Paper>

                {/* Welcome Section */}
                <Box sx={{ mb: 6, textAlign: 'center' }}>
                    <Typography
                        variant="h3"
                        component="h1"
                        gutterBottom
                        sx={{
                            fontWeight: 700,
                            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                            mb: 2,
                        }}
                    >
                        Administration Panel
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: 'text.secondary',
                            fontWeight: 400,
                            maxWidth: 600,
                            mx: 'auto'
                        }}
                    >
                        Manage all aspects of your football store from one place
                    </Typography>
                </Box>

                {/* Management Options Grid */}
                <Grid container spacing={4}>
                    {managementOptions.map((option, index) => (
                        <Grid size = {{xs: 12, sm: 6, lg: 4}}  key={index}>
                            <Card
                                sx={{
                                    height: '100%',
                                    cursor: 'pointer',
                                    background: 'rgba(255, 255, 255, 0.9)',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: 3,
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&:hover': {
                                        transform: 'translateY(-8px) scale(1.02)',
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                                        '& .card-icon': {
                                            transform: 'scale(1.1) rotate(5deg)',
                                        },
                                        '&::before': {
                                            opacity: 1,
                                        }
                                    },
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '4px',
                                        background: option.gradient,
                                        opacity: 0,
                                        transition: 'opacity 0.3s ease',
                                    }
                                }}
                                onClick={() => navigate(option.path)}
                            >
                                <CardContent sx={{ p: 4, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    {/* Icon Container */}
                                    <Box
                                        sx={{
                                            mb: 3,
                                            mx: 'auto',
                                            width: 80,
                                            height: 80,
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            background: `${option.color}15`,
                                            position: 'relative',
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                inset: 0,
                                                borderRadius: '50%',
                                                background: option.gradient,
                                                opacity: 0.1,
                                            }
                                        }}
                                    >
                                        <Box
                                            className="card-icon"
                                            sx={{
                                                color: option.color,
                                                transition: 'all 0.3s ease',
                                                zIndex: 1,
                                                position: 'relative',
                                            }}
                                        >
                                            {option.icon}
                                        </Box>
                                    </Box>

                                    {/* Content */}
                                    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <Typography
                                            variant="h6"
                                            component="h2"
                                            sx={{
                                                fontWeight: 700,
                                                color: 'text.primary',
                                                mb: 1.5,
                                                lineHeight: 1.3,
                                            }}
                                        >
                                            {option.title}
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: 'text.secondary',
                                                lineHeight: 1.5,
                                                mb: 2,
                                            }}
                                        >
                                            {option.description}
                                        </Typography>

                                        <Box sx={{ mt: 'auto' }}>
                                            <Chip
                                                label="Access"
                                                size="small"
                                                sx={{
                                                    background: option.gradient,
                                                    color: 'white',
                                                    fontWeight: 600,
                                                    '&:hover': {
                                                        background: option.gradient,
                                                    }
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Footer */}
                <Box sx={{ mt: 8, textAlign: 'center' }}>
                    <Divider sx={{ mb: 3, opacity: 0.3 }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary', opacity: 0.7 }}>
                        © 2024 Romanian Football Store - Administration Panel
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default AdminPage;