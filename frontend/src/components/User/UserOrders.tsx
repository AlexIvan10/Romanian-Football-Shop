import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Card,
    CardContent,
    Chip,
    Avatar,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Alert,
    Fade,
    Grid,
    Divider,
    useTheme,
} from '@mui/material';
import { useAuth } from '../../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import NumbersIcon from '@mui/icons-material/Numbers';
import StraightenIcon from '@mui/icons-material/Straighten';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface OrderItem {
    id: number;
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    player?: string;
    number?: string;
    size: string;
}

interface Order {
    id: number;
    totalPrice: number;
    status: 'PENDING' | 'COMPLETED' | 'CANCELED';
    city: string;
    street: string;
    number: string;
    postalCode: string;
    orderItems?: OrderItem[];
}

const UserOrders: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchUserOrders();
    }, [user, navigate]);

    const fetchUserOrders = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8080/api/orders', {
                credentials: 'include'
            });

            if (response.ok) {
                const allOrders = await response.json();
                // Filter orders for the current user
                const userOrders = allOrders.filter((order: any) => order.userId === user?.id);
                // Sort by ID descending (newest first)
                const sortedOrders = userOrders.sort((a: any, b: any) => b.id - a.id);
                setOrders(sortedOrders);
            } else {
                throw new Error('Failed to fetch orders');
            }
        } catch (error) {
            setError('Failed to load your orders. Please try again.');
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewOrderItems = async (order: Order) => {
        try {
            setSelectedOrder({
                ...order,
                orderItems: order.orderItems || []
            });
            setOpenDialog(true);

            // If order already has orderItems, no need to fetch again
            if (order.orderItems && order.orderItems.length > 0) {
                return;
            }

            // Fetch complete order details including items
            const response = await fetch(`http://localhost:8080/api/orders/${order.id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (response.ok) {
                const orderData = await response.json();

                // Transform the order items to match our interface
                const transformedItems: OrderItem[] = (orderData.orderItems || []).map((item: any) => ({
                    id: item.id,
                    productId: item.productId,
                    productName: item.productName || 'Unknown Product',
                    quantity: item.quantity || 0,
                    price: item.price || 0,
                    player: item.player,
                    number: item.number,
                    size: item.size || 'Unknown'
                }));

                setSelectedOrder(prev => ({
                    ...prev!,
                    orderItems: transformedItems
                }));
            }
        } catch (error) {
            console.error('Error fetching order items:', error);
            setError('Failed to fetch order details');
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setTimeout(() => {
            setSelectedOrder(null);
        }, 300);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PENDING':
                return <PendingIcon />;
            case 'COMPLETED':
                return <CheckCircleIcon />;
            case 'CANCELED':
                return <CancelIcon />;
            default:
                return <PendingIcon />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING':
                return '#ed6c02';
            case 'COMPLETED':
                return '#2e7d32';
            case 'CANCELED':
                return '#d32f2f';
            default:
                return '#ed6c02';
        }
    };

    if (loading) {
        return (
            <Box sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            }}>
                <Typography variant="h6">Loading your orders...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            py: 4
        }}>
            <Container maxWidth="xl">
                {/* Header Section */}
                <Paper
                    elevation={8}
                    sx={{
                        p: 4,
                        mb: 4,
                        borderRadius: 4,
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Button
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate('/user-data')}
                            variant="contained"
                            sx={{
                                py: 1.5,
                                px: 4,
                                borderRadius: 3,
                                textTransform: 'none',
                                fontWeight: 600,
                                background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                                boxShadow: '0 6px 20px rgba(25, 118, 210, 0.3)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #1565c0 0%, #1e88e5 100%)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 25px rgba(25, 118, 210, 0.4)',
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            Back to Profile
                        </Button>

                        <Chip
                            label="My Orders"
                            icon={<ShoppingCartIcon />}
                            sx={{
                                background: 'linear-gradient(45deg, #2e7d32, #66bb6a)',
                                color: 'white',
                                fontWeight: 'bold',
                                px: 2,
                                py: 1
                            }}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Box sx={{
                            position: 'relative',
                            p: 2,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
                            boxShadow: '0 8px 24px rgba(46, 125, 50, 0.3)',
                        }}>
                            <ShoppingCartIcon sx={{
                                fontSize: 40,
                                color: 'white'
                            }} />
                        </Box>
                        <Box>
                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: 800,
                                    background: 'linear-gradient(45deg, #2e7d32, #66bb6a)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    color: 'transparent',
                                    mb: 0.5,
                                }}
                            >
                                My Orders
                            </Typography>
                            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
                                Track and view your order history
                            </Typography>
                        </Box>
                    </Box>
                </Paper>

                {error && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                        {error}
                    </Alert>
                )}

                {/* Orders List */}
                {orders.length === 0 ? (
                    <Card
                        elevation={12}
                        sx={{
                            borderRadius: 4,
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            p: 6,
                            textAlign: 'center'
                        }}
                    >
                        <ShoppingCartIcon sx={{ fontSize: 80, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
                        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                            No Orders Yet
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            You haven't placed any orders yet. Start shopping to see your orders here!
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/')}
                            sx={{
                                borderRadius: 3,
                                textTransform: 'none',
                                px: 4,
                                py: 1.5,
                                fontWeight: 600,
                                background: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
                            }}
                        >
                            Start Shopping
                        </Button>
                    </Card>
                ) : (
                    <Grid container spacing={3}>
                        {orders.map((order, index) => (
                            <Grid size={{xs: 12, md: 6, lg: 4}} key={order.id}>
                                <Fade in timeout={300 + index * 100}>
                                    <Card
                                        elevation={8}
                                        sx={{
                                            borderRadius: 3,
                                            background: 'rgba(255, 255, 255, 0.95)',
                                            backdropFilter: 'blur(20px)',
                                            border: '1px solid rgba(255, 255, 255, 0.2)',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
                                            }
                                        }}
                                    >
                                        <CardContent sx={{ p: 3 }}>
                                            {/* Order Header */}
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Avatar sx={{
                                                        width: 32,
                                                        height: 32,
                                                        background: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
                                                        fontSize: '0.8rem',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        #{order.id}
                                                    </Avatar>
                                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                        Order #{order.id}
                                                    </Typography>
                                                </Box>
                                                <Chip
                                                    icon={getStatusIcon(order.status)}
                                                    label={order.status}
                                                    sx={{
                                                        backgroundColor: getStatusColor(order.status),
                                                        color: 'white',
                                                        fontWeight: 'bold',
                                                        '& .MuiChip-icon': {
                                                            color: 'white'
                                                        }
                                                    }}
                                                />
                                            </Box>

                                            <Divider sx={{ my: 2 }} />

                                            {/* Order Details */}
                                            <Box sx={{ mb: 2 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                    <Typography variant="h6" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                                                        ${order.totalPrice.toFixed(2)}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                                    <LocationOnIcon sx={{ color: 'text.secondary', fontSize: 18, mt: 0.5 }} />
                                                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.4 }}>
                                                        {`${order.street} ${order.number}, ${order.city}, ${order.postalCode}`}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            {/* View Details Button */}
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                startIcon={<VisibilityIcon />}
                                                onClick={() => handleViewOrderItems(order)}
                                                sx={{
                                                    borderRadius: 2,
                                                    textTransform: 'none',
                                                    py: 1.5,
                                                    fontWeight: 600,
                                                    background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                                                    '&:hover': {
                                                        background: 'linear-gradient(135deg, #1565c0 0%, #1e88e5 100%)',
                                                        transform: 'scale(1.02)',
                                                    },
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                View Order Details
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Fade>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {/* Order Items Dialog */}
                <Dialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                    maxWidth="lg"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: 4,
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(20px)',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                        }
                    }}
                >
                    <DialogTitle sx={{
                        background: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
                        color: 'white',
                        py: 3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                    }}>
                        <ShoppingCartIcon />
                        Order Details - Order #{selectedOrder?.id}
                        <Chip
                            icon={getStatusIcon(selectedOrder?.status || '')}
                            label={selectedOrder?.status}
                            sx={{
                                ml: 'auto',
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                color: 'white',
                                fontWeight: 'bold',
                                '& .MuiChip-icon': {
                                    color: 'white'
                                }
                            }}
                        />
                    </DialogTitle>
                    <DialogContent sx={{ p: 3 }}>
                        <Box sx={{ mb: 3 }}>
                            <Grid container spacing={2}>
                                <Grid size={{xs: 12, md: 6}}>
                                    <Typography variant="body1" color="text.secondary">
                                        <strong>Total: ${selectedOrder?.totalPrice.toFixed(2)}</strong>
                                    </Typography>
                                </Grid>
                                <Grid size={{xs: 12, md: 6}}>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>Delivery Address:</strong> {selectedOrder?.street} {selectedOrder?.number}, {selectedOrder?.city}, {selectedOrder?.postalCode}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>

                        <TableContainer
                            component={Paper}
                            sx={{
                                borderRadius: 3,
                                overflow: 'hidden',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                        >
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ background: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)' }}>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Product</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Size</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Player Name</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Number</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Quantity</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Price</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {selectedOrder?.orderItems?.map((item, index) => (
                                        <Fade in timeout={200 + index * 100} key={item.id}>
                                            <TableRow sx={{
                                                '&:nth-of-type(even)': { backgroundColor: 'rgba(0, 0, 0, 0.02)' },
                                                '&:hover': { backgroundColor: 'rgba(46, 125, 50, 0.04)' }
                                            }}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <SportsSoccerIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                                                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                            {item.productName}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <StraightenIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                                                        <Chip
                                                            label={item.size}
                                                            size="small"
                                                            sx={{
                                                                background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                                                                color: 'white',
                                                                fontWeight: 'bold'
                                                            }}
                                                        />
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    {item.player ? (
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <PersonIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                                {item.player}
                                                            </Typography>
                                                        </Box>
                                                    ) : (
                                                        <Typography variant="body2" color="text.secondary">-</Typography>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {item.number ? (
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <NumbersIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                                                            <Chip
                                                                label={item.number}
                                                                size="small"
                                                                sx={{
                                                                    background: 'linear-gradient(135deg, #ed6c02 0%, #ff9800 100%)',
                                                                    color: 'white',
                                                                    fontWeight: 'bold'
                                                                }}
                                                            />
                                                        </Box>
                                                    ) : (
                                                        <Typography variant="body2" color="text.secondary">-</Typography>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                        {item.quantity}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Typography variant="body1" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                                                            ${item.price.toFixed(2)}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        </Fade>
                                    ))}
                                    {(!selectedOrder?.orderItems || selectedOrder.orderItems.length === 0) && (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                                    <ShoppingCartIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5 }} />
                                                    <Typography variant="body1" color="text.secondary">
                                                        Loading order items...
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button
                            onClick={handleCloseDialog}
                            variant="contained"
                            sx={{
                                borderRadius: 3,
                                textTransform: 'none',
                                px: 4,
                                py: 1.5,
                                fontWeight: 600,
                                background: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
                                boxShadow: '0 6px 20px rgba(46, 125, 50, 0.3)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #1b5e20 0%, #4caf50 100%)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 25px rgba(46, 125, 50, 0.4)',
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default UserOrders;