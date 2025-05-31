import React, {useState, useEffect} from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert,
    AlertColor,
    IconButton,
    TextField,
    Card,
    CardContent,
    Chip,
    Avatar,
    Tooltip,
    Fade,
    Grid,
    Badge,
    InputAdornment,
} from '@mui/material';
import {useAuth} from '../../utils/AuthContext';
import {useNavigate} from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import NumbersIcon from '@mui/icons-material/Numbers';
import StraightenIcon from '@mui/icons-material/Straighten';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import HomeIcon from '@mui/icons-material/Home';

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

interface SnackbarState {
    open: boolean;
    message: string;
    severity: AlertColor;
}

interface AddressFormData {
    city: string;
    street: string;
    number: string;
    postalCode: string;
}

const OrderManagement: React.FC = () => {
    const {user} = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openAddressDialog, setOpenAddressDialog] = useState(false);
    const [addressForm, setAddressForm] = useState<AddressFormData>({
        city: '',
        street: '',
        number: '',
        postalCode: ''
    });
    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: '',
        severity: 'success'
    });
    const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

    useEffect(() => {
        if (user && user.role !== 'ADMIN') {
            navigate('/');
            return;
        }
        fetchOrders();
    }, [user, navigate]);

    const showSnackbar = (message: string, severity: AlertColor): void => {
        setSnackbar({open: true, message, severity});
    };

    const fetchOrders = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/orders', {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                // Filter and sort orders
                const pendingOrders = data
                    .filter((order: Order) => order.status === 'PENDING')
                    .sort((a: Order, b: Order) => a.id - b.id);
                setOrders(pendingOrders);
            } else {
                throw new Error('Failed to fetch orders');
            }
        } catch (error) {
            showSnackbar('Failed to fetch orders', 'error');
        }
    };

    const handleStatusUpdate = async (orderId: number, newStatus: 'COMPLETED' | 'CANCELED') => {
        try {
            const response = await fetch(`http://localhost:8080/api/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    status: newStatus
                })
            });

            if (response.ok) {
                showSnackbar(`Order ${orderId} marked as ${newStatus.toLowerCase()}`, 'success');
                fetchOrders(); // Refresh the orders list
                handleCloseDialog(); // Close dialog if open
            } else {
                throw new Error('Failed to update order status');
            }
        } catch (error) {
            showSnackbar('Failed to update order status', 'error');
        }
    };

    const handleViewOrderItems = async (order: Order) => {
        try {
            // Set the basic order info and open dialog
            setSelectedOrder({
                ...order,
                orderItems: order.orderItems || []
            });
            setOpenDialog(true);

            // If order already has orderItems from the initial fetch, no need to fetch again
            if (order.orderItems && order.orderItems.length > 0) {
                return;
            }

            // Otherwise, fetch the complete order details including items
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
            } else {
                throw new Error('Failed to fetch order details');
            }
        } catch (error) {
            console.error('Error fetching order items:', error);
            showSnackbar('Failed to fetch order items', 'error');
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        // Wait for dialog animation to complete before clearing data
        setTimeout(() => {
            setSelectedOrder(null);
        }, 300);
    };

    const validateAddressForm = (): boolean => {
        const errors: {[key: string]: string} = {};

        if (!addressForm.street.trim()) {
            errors.street = 'Street is required';
        }

        if (!addressForm.number.trim()) {
            errors.number = 'Number is required';
        }

        if (!addressForm.city.trim()) {
            errors.city = 'City is required';
        }

        if (!addressForm.postalCode.trim()) {
            errors.postalCode = 'Postal code is required';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleOpenAddressDialog = (order: Order) => {
        setSelectedOrder(order);
        setAddressForm({
            city: order.city,
            street: order.street,
            number: order.number,
            postalCode: order.postalCode
        });
        setFormErrors({});
        setOpenAddressDialog(true);
    };

    const handleCloseAddressDialog = () => {
        setOpenAddressDialog(false);
        setAddressForm({
            city: '',
            street: '',
            number: '',
            postalCode: ''
        });
        setFormErrors({});
        setSelectedOrder(null);
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setAddressForm(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear specific field error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleAddressSubmit = async () => {
        if (!validateAddressForm() || !selectedOrder) return;

        try {
            const response = await fetch(`http://localhost:8080/api/orders/${selectedOrder.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    city: addressForm.city,
                    street: addressForm.street,
                    number: addressForm.number,
                    postalCode: addressForm.postalCode
                })
            });

            if (response.ok) {
                showSnackbar('Delivery address updated successfully', 'success');
                fetchOrders();
                handleCloseAddressDialog();
            } else {
                const errorText = await response.text();
                console.error('Update failed:', errorText);
                throw new Error('Failed to update address');
            }
        } catch (error) {
            console.error('Address update error:', error);
            showSnackbar('Failed to update delivery address', 'error');
        }
    };

    if (!user || user.role !== 'ADMIN') {
        return null;
    }

    // Calculate statistics
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

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
                            startIcon={<ArrowBackIcon/>}
                            onClick={() => navigate('/admin')}
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
                            Back to Dashboard
                        </Button>

                        <Chip
                            label="Order Management"
                            icon={<LocalShippingIcon />}
                            sx={{
                                background: 'linear-gradient(45deg, #2e7d32, #66bb6a)',
                                color: 'white',
                                fontWeight: 'bold',
                                px: 2,
                                py: 1
                            }}
                        />
                    </Box>

                    <Box sx={{display: 'flex', alignItems: 'center', gap: 3}}>
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
                            }}/>
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
                                Order Management
                            </Typography>
                            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
                                Manage pending orders and process deliveries
                            </Typography>
                        </Box>
                    </Box>
                </Paper>

                {/* Statistics Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid size={{xs: 12, md: 4}}>
                        <Card sx={{
                            background: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
                            color: 'white',
                            borderRadius: 3,
                            height: '100%'
                        }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                                            {totalOrders}
                                        </Typography>
                                        <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                            Pending Orders
                                        </Typography>
                                    </Box>
                                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                                        <PendingIcon sx={{ fontSize: 30 }} />
                                    </Avatar>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{xs: 12, md: 4}}>
                        <Card sx={{
                            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                            color: 'white',
                            borderRadius: 3,
                            height: '100%'
                        }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                                            ${totalRevenue.toFixed(2)}
                                        </Typography>
                                        <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                            Total Revenue
                                        </Typography>
                                    </Box>
                                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                                        <AttachMoneyIcon sx={{ fontSize: 30 }} />
                                    </Avatar>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{xs: 12, md: 4}}>
                        <Card sx={{
                            background: 'linear-gradient(135deg, #ed6c02 0%, #ff9800 100%)',
                            color: 'white',
                            borderRadius: 3,
                            height: '100%'
                        }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                                            ${averageOrderValue.toFixed(2)}
                                        </Typography>
                                        <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                            Average Order Value
                                        </Typography>
                                    </Box>
                                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                                        <LocalShippingIcon sx={{ fontSize: 30 }} />
                                    </Avatar>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Main Content */}
                <Card
                    elevation={12}
                    sx={{
                        borderRadius: 4,
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        overflow: 'hidden'
                    }}
                >
                    <Box sx={{
                        background: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
                        p: 3,
                        color: 'white'
                    }}>
                        <Typography variant="h5" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 2 }}>
                            <LocalShippingIcon />
                            Pending Orders Management
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
                            Process pending orders, update delivery addresses, and manage order status
                        </Typography>
                    </Box>

                    <TableContainer sx={{ maxHeight: 600 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{
                                        background: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: '1rem'
                                    }}>
                                        Order ID
                                    </TableCell>
                                    <TableCell sx={{
                                        background: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: '1rem'
                                    }}>
                                        Total Price
                                    </TableCell>
                                    <TableCell sx={{
                                        background: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: '1rem'
                                    }}>
                                        Delivery Address
                                    </TableCell>
                                    <TableCell sx={{
                                        background: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: '1rem'
                                    }}>
                                        Status
                                    </TableCell>
                                    <TableCell align="center" sx={{
                                        background: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: '1rem'
                                    }}>
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orders.map((order, index) => (
                                    <Fade in timeout={300 + index * 100} key={order.id}>
                                        <TableRow
                                            sx={{
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(46, 125, 50, 0.08)',
                                                    transform: 'scale(1.01)',
                                                },
                                                '&:nth-of-type(even)': {
                                                    backgroundColor: 'rgba(0, 0, 0, 0.02)'
                                                }
                                            }}
                                        >
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar sx={{
                                                        width: 40,
                                                        height: 40,
                                                        background: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
                                                        fontSize: '0.9rem',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        #{order.id}
                                                    </Avatar>
                                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                        {order.id}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <AttachMoneyIcon sx={{ color: '#2e7d32', fontSize: 20 }} />
                                                    <Typography variant="h6" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                                                        {order.totalPrice.toFixed(2)}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <LocationOnIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                                                    <Typography variant="body2" sx={{ maxWidth: 250 }}>
                                                        {`${order.street} ${order.number}, ${order.city}, ${order.postalCode}`}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    icon={<PendingIcon />}
                                                    label="PENDING"
                                                    sx={{
                                                        background: 'linear-gradient(135deg, #ed6c02 0%, #ff9800 100%)',
                                                        color: 'white',
                                                        fontWeight: 'bold',
                                                        px: 2,
                                                        '& .MuiChip-icon': {
                                                            color: 'white'
                                                        }
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                                                    <Tooltip title="View order items">
                                                        <IconButton
                                                            onClick={() => handleViewOrderItems(order)}
                                                            sx={{
                                                                background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                                                                color: 'white',
                                                                '&:hover': {
                                                                    background: 'linear-gradient(135deg, #1565c0 0%, #1e88e5 100%)',
                                                                    transform: 'scale(1.1)',
                                                                },
                                                                transition: 'all 0.2s ease'
                                                            }}
                                                        >
                                                            <VisibilityIcon/>
                                                        </IconButton>
                                                    </Tooltip>

                                                    <Tooltip title="Edit delivery address">
                                                        <IconButton
                                                            onClick={() => handleOpenAddressDialog(order)}
                                                            sx={{
                                                                background: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
                                                                color: 'white',
                                                                '&:hover': {
                                                                    background: 'linear-gradient(135deg, #8e24aa 0%, #ab47bc 100%)',
                                                                    transform: 'scale(1.1)',
                                                                },
                                                                transition: 'all 0.2s ease'
                                                            }}
                                                        >
                                                            <EditIcon/>
                                                        </IconButton>
                                                    </Tooltip>

                                                    <Tooltip title="Mark as completed">
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            onClick={() => handleStatusUpdate(order.id, 'COMPLETED')}
                                                            startIcon={<CheckCircleIcon />}
                                                            sx={{
                                                                background: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
                                                                color: 'white',
                                                                textTransform: 'none',
                                                                borderRadius: 2,
                                                                fontWeight: 600,
                                                                '&:hover': {
                                                                    background: 'linear-gradient(135deg, #1b5e20 0%, #4caf50 100%)',
                                                                    transform: 'scale(1.05)',
                                                                },
                                                                transition: 'all 0.2s ease'
                                                            }}
                                                        >
                                                            Complete
                                                        </Button>
                                                    </Tooltip>

                                                    <Tooltip title="Cancel order">
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            onClick={() => handleStatusUpdate(order.id, 'CANCELED')}
                                                            startIcon={<CancelIcon />}
                                                            sx={{
                                                                background: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)',
                                                                color: 'white',
                                                                textTransform: 'none',
                                                                borderRadius: 2,
                                                                fontWeight: 600,
                                                                '&:hover': {
                                                                    background: 'linear-gradient(135deg, #c62828 0%, #e53935 100%)',
                                                                    transform: 'scale(1.05)',
                                                                },
                                                                transition: 'all 0.2s ease'
                                                            }}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    </Fade>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>

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
                        Order Items - Order #{selectedOrder?.id}
                    </DialogTitle>
                    <DialogContent sx={{ p: 3 }}>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body1" color="text.secondary">
                                Order Details: <strong>Total ${selectedOrder?.totalPrice.toFixed(2)}</strong>
                            </Typography>
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
                                                        <AttachMoneyIcon sx={{ color: '#2e7d32', fontSize: 18 }} />
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

                {/* Address Edit Dialog */}
                <Dialog
                    open={openAddressDialog}
                    onClose={handleCloseAddressDialog}
                    maxWidth="sm"
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
                        <LocationOnIcon />
                        Edit Delivery Address - Order #{selectedOrder?.id}
                    </DialogTitle>
                    <DialogContent sx={{ mt: 3, pb: 2 }}>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Update the delivery address for order #{selectedOrder?.id}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <TextField
                                fullWidth
                                label="Street Name"
                                name="street"
                                value={addressForm.street}
                                onChange={handleAddressChange}
                                required
                                error={!!formErrors.street}
                                helperText={formErrors.street}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#2e7d32',
                                            borderWidth: 2,
                                        }
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: '#2e7d32',
                                    }
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LocationOnIcon sx={{ color: 'text.secondary' }} />
                                        </InputAdornment>
                                    )
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Street Number"
                                name="number"
                                value={addressForm.number}
                                onChange={handleAddressChange}
                                required
                                error={!!formErrors.number}
                                helperText={formErrors.number}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#2e7d32',
                                            borderWidth: 2,
                                        }
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: '#2e7d32',
                                    }
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <NumbersIcon sx={{ color: 'text.secondary' }} />
                                        </InputAdornment>
                                    )
                                }}
                            />

                            <TextField
                                fullWidth
                                label="City"
                                name="city"
                                value={addressForm.city}
                                onChange={handleAddressChange}
                                required
                                error={!!formErrors.city}
                                helperText={formErrors.city}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#2e7d32',
                                            borderWidth: 2,
                                        }
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: '#2e7d32',
                                    }
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <HomeIcon sx={{ color: 'text.secondary' }} />
                                        </InputAdornment>
                                    )
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Postal Code"
                                name="postalCode"
                                value={addressForm.postalCode}
                                onChange={handleAddressChange}
                                required
                                error={!!formErrors.postalCode}
                                helperText={formErrors.postalCode}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#2e7d32',
                                            borderWidth: 2,
                                        }
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: '#2e7d32',
                                    }
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LocalShippingIcon sx={{ color: 'text.secondary' }} />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, gap: 2 }}>
                        <Button
                            onClick={handleCloseAddressDialog}
                            sx={{
                                borderRadius: 3,
                                textTransform: 'none',
                                px: 4,
                                py: 1.5,
                                fontWeight: 600,
                                color: 'text.secondary',
                                '&:hover': {
                                    backgroundColor: 'rgba(0,0,0,0.04)',
                                }
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddressSubmit}
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
                            Update Address
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Enhanced Snackbar */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={() => setSnackbar({...snackbar, open: false})}
                    anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                >
                    <Alert
                        onClose={() => setSnackbar({...snackbar, open: false})}
                        severity={snackbar.severity}
                        sx={{
                            width: '100%',
                            borderRadius: 3,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                            fontWeight: 500,
                        }}
                        variant="filled"
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Container>
        </Box>
    );
}

export default OrderManagement;