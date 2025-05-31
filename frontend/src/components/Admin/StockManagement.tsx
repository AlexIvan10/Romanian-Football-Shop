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
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Snackbar,
    Alert,
    Card,
    CardContent,
    Chip,
    Avatar,
    Tooltip,
    Fade,
    Grid,
    InputAdornment,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InventoryIcon from "@mui/icons-material/Inventory";
import Inventory2Icon from '@mui/icons-material/Inventory2';
import SearchIcon from '@mui/icons-material/Search';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import StraightenIcon from '@mui/icons-material/Straighten';
import NumbersIcon from '@mui/icons-material/Numbers';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {useAuth} from '../../utils/AuthContext';
import {useNavigate} from 'react-router-dom';

interface Product {
    id: number;
    name: string;
    price: number;
}

interface ProductInventory {
    id: number;
    product: Product;
    size: 'S' | 'M' | 'L' | 'XL' | 'XXL';
    quantity: number;
}

interface FormData {
    productId: string;
    size: 'S' | 'M' | 'L' | 'XL' | 'XXL';
    quantity: string;
}

const StockManagement: React.FC = () => {
    const {user} = useAuth();
    const navigate = useNavigate();
    const [inventory, setInventory] = useState<ProductInventory[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedInventory, setSelectedInventory] = useState<ProductInventory | null>(null);
    const [formData, setFormData] = useState<FormData>({
        productId: '',
        size: 'M',
        quantity: ''
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });
    const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

    useEffect(() => {
        if (user && user.role !== 'ADMIN') {
            navigate('/');
            return;
        }
        fetchInventory();
        fetchProducts();
    }, [user, navigate]);

    const fetchInventory = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/productInventory', {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setInventory(data);
            } else if (response.status === 401 || response.status === 403) {
                showSnackbar('Unauthorized. Please make sure you have admin privileges.', 'error');
                navigate('/login');
            }
        } catch (error) {
            showSnackbar('Failed to fetch inventory', 'error');
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/product', {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setProducts(data);
            }
        } catch (error) {
            showSnackbar('Failed to fetch products', 'error');
        }
    };

    const validateForm = (): boolean => {
        const errors: {[key: string]: string} = {};

        if (!formData.productId) {
            errors.productId = 'Product selection is required';
        }

        if (!formData.quantity.trim()) {
            errors.quantity = 'Quantity is required';
        } else {
            const quantity = parseInt(formData.quantity);
            if (isNaN(quantity) || quantity < 0) {
                errors.quantity = 'Quantity must be a positive number';
            }
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const checkExistingInventory = async (productId: string, size: string, currentId?: number): Promise<boolean> => {
        try {
            const response = await fetch(`http://localhost:8080/api/productInventory/product/${productId}`, {
                credentials: 'include'
            });

            if (response.ok) {
                const inventoryItems = await response.json();
                return inventoryItems.some((item: any) => {
                    // If we're editing, exclude the current item from the check
                    if (currentId && item.id === currentId) return false;
                    return item.size === size;
                });
            }
            return false;
        } catch (error) {
            console.error('Error checking existing inventory:', error);
            return false;
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear specific field error when user starts typing
        if (formErrors[field]) {
            setFormErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        // Check for existing product-size combination
        const exists = await checkExistingInventory(
            formData.productId,
            formData.size,
            selectedInventory?.id
        );

        if (exists) {
            showSnackbar('This size already exists for the selected product. Please edit the existing entry instead.', 'error');
            return;
        }

        const url = 'http://localhost:8080/api/productInventory';
        const method = isEditing ? 'PUT' : 'POST';
        const endpoint = isEditing && selectedInventory ? `${url}/${selectedInventory.id}` : url;

        try {
            const selectedProduct = products.find(p => p.id === parseInt(formData.productId));
            if (!selectedProduct) {
                showSnackbar('Invalid product selected', 'error');
                return;
            }

            const inventoryData = {
                product: selectedProduct,
                size: formData.size,
                quantity: parseInt(formData.quantity)
            };

            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(inventoryData)
            });

            if (response.ok) {
                showSnackbar(`Stock ${isEditing ? 'updated' : 'added'} successfully`, 'success');
                fetchInventory();
                handleCloseDialog();
            } else {
                throw new Error('Operation failed');
            }
        } catch (error) {
            showSnackbar((error as Error).message, 'error');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this inventory item?')) return;

        try {
            const response = await fetch(`http://localhost:8080/api/productInventory/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                showSnackbar('Stock deleted successfully', 'success');
                fetchInventory();
            } else {
                throw new Error('Failed to delete inventory');
            }
        } catch (error) {
            showSnackbar((error as Error).message, 'error');
        }
    };

    const handleEdit = (inventory: ProductInventory) => {
        setSelectedInventory(inventory);
        setFormData({
            productId: inventory.product.id.toString(),
            size: inventory.size,
            quantity: inventory.quantity.toString()
        });
        setIsEditing(true);
        setFormErrors({});
        setOpenDialog(true);
    };

    const handleOpenDialog = () => {
        setFormData({
            productId: '',
            size: 'M',
            quantity: ''
        });
        setIsEditing(false);
        setFormErrors({});
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedInventory(null);
        setFormData({
            productId: '',
            size: 'M',
            quantity: ''
        });
        setFormErrors({});
    };

    const showSnackbar = (message: string, severity: 'success' | 'error') => {
        setSnackbar({open: true, message, severity});
    };

    const [searchQuery, setSearchQuery] = useState('');
    const filteredInventory = inventory.filter(item =>
        item.product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!user || user.role !== 'ADMIN') {
        return null;
    }

    // Calculate statistics
    const totalItems = inventory.length;
    const lowStockItems = inventory.filter(item => item.quantity < 5).length;
    const outOfStockItems = inventory.filter(item => item.quantity === 0).length;
    const totalStockValue = inventory.reduce((sum, item) => sum + (item.quantity * item.product.price), 0);

    const getStockStatus = (quantity: number) => {
        if (quantity === 0) return { status: 'Out of Stock', color: '#d32f2f', icon: <ErrorIcon /> };
        if (quantity < 5) return { status: 'Low Stock', color: '#ed6c02', icon: <WarningIcon /> };
        return { status: 'In Stock', color: '#2e7d32', icon: <CheckCircleIcon /> };
    };

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
                            label="Stock Management"
                            icon={<Inventory2Icon />}
                            sx={{
                                background: 'linear-gradient(45deg, #d32f2f, #f44336)',
                                color: 'white',
                                fontWeight: 'bold',
                                px: 2,
                                py: 1
                            }}
                        />
                    </Box>

                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 3}}>
                            <Box sx={{
                                position: 'relative',
                                p: 2,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)',
                                boxShadow: '0 8px 24px rgba(211, 47, 47, 0.3)',
                            }}>
                                <TrendingUpIcon sx={{
                                    fontSize: 40,
                                    color: 'white'
                                }}/>
                            </Box>
                            <Box>
                                <Typography
                                    variant="h3"
                                    sx={{
                                        fontWeight: 800,
                                        background: 'linear-gradient(45deg, #d32f2f, #f44336)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        color: 'transparent',
                                        mb: 0.5,
                                    }}
                                >
                                    Stock Management
                                </Typography>
                                <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
                                    Monitor and manage your inventory levels
                                </Typography>
                            </Box>
                        </Box>

                        <Button
                            variant="contained"
                            startIcon={<AddIcon/>}
                            onClick={handleOpenDialog}
                            sx={{
                                py: 1.5,
                                px: 4,
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
                            Add Stock Entry
                        </Button>
                    </Box>
                </Paper>

                {/* Statistics Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid size={{xs: 12, md: 3}}>
                        <Card sx={{
                            background: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)',
                            color: 'white',
                            borderRadius: 3,
                            height: '100%'
                        }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                                            {totalItems}
                                        </Typography>
                                        <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                            Total Stock Items
                                        </Typography>
                                    </Box>
                                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                                        <Inventory2Icon sx={{ fontSize: 30 }} />
                                    </Avatar>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{xs: 12, md: 3}}>
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
                                            {lowStockItems}
                                        </Typography>
                                        <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                            Low Stock Alerts
                                        </Typography>
                                    </Box>
                                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                                        <WarningIcon sx={{ fontSize: 30 }} />
                                    </Avatar>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{xs: 12, md: 3}}>
                        <Card sx={{
                            background: 'linear-gradient(135deg, #7b1fa2 0%, #ab47bc 100%)',
                            color: 'white',
                            borderRadius: 3,
                            height: '100%'
                        }}>
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                                            {outOfStockItems}
                                        </Typography>
                                        <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                            Out of Stock
                                        </Typography>
                                    </Box>
                                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                                        <ErrorIcon sx={{ fontSize: 30 }} />
                                    </Avatar>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{xs: 12, md: 3}}>
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
                                            ${totalStockValue.toFixed(0)}
                                        </Typography>
                                        <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                            Total Stock Value
                                        </Typography>
                                    </Box>
                                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                                        <TrendingUpIcon sx={{ fontSize: 30 }} />
                                    </Avatar>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Search Section */}
                <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
                    <TextField
                        fullWidth
                        label="Search Stock Items"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by product name..."
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: 'text.secondary' }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 3,
                                '&.Mui-focused fieldset': {
                                    borderColor: '#d32f2f',
                                    borderWidth: 2,
                                }
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: '#d32f2f',
                            }
                        }}
                    />
                </Paper>

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
                        background: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)',
                        p: 3,
                        color: 'white'
                    }}>
                        <Typography variant="h5" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Inventory2Icon />
                            Stock Management Table
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
                            Monitor inventory levels and manage stock quantities
                        </Typography>
                    </Box>

                    <TableContainer sx={{ maxHeight: 600 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{
                                        background: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: '1rem'
                                    }}>
                                        Product Name
                                    </TableCell>
                                    <TableCell sx={{
                                        background: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: '1rem'
                                    }}>
                                        Size
                                    </TableCell>
                                    <TableCell sx={{
                                        background: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: '1rem'
                                    }}>
                                        Quantity
                                    </TableCell>
                                    <TableCell sx={{
                                        background: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: '1rem'
                                    }}>
                                        Status
                                    </TableCell>
                                    <TableCell align="center" sx={{
                                        background: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: '1rem'
                                    }}>
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {[...filteredInventory]
                                    .sort((a, b) => {
                                        const nameComparison = a.product.name.localeCompare(b.product.name);
                                        if (nameComparison !== 0) return nameComparison;
                                        const sizeOrder = {'S': 1, 'M': 2, 'L': 3, 'XL': 4, 'XXL': 5};
                                        return sizeOrder[a.size] - sizeOrder[b.size];
                                    })
                                    .map((item, index) => (
                                        <Fade in timeout={300 + index * 100} key={item.id}>
                                            <TableRow
                                                sx={{
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(211, 47, 47, 0.08)',
                                                        transform: 'scale(1.01)',
                                                    },
                                                    '&:nth-of-type(even)': {
                                                        backgroundColor: 'rgba(0, 0, 0, 0.02)'
                                                    }
                                                }}
                                            >
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <SportsSoccerIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                            {item.product.name}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={item.size}
                                                        icon={<StraightenIcon />}
                                                        sx={{
                                                            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                                                            color: 'white',
                                                            fontWeight: 'bold',
                                                            px: 2,
                                                            '& .MuiChip-icon': {
                                                                color: 'white'
                                                            }
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <NumbersIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                                                        <Typography
                                                            variant="h6"
                                                            sx={{
                                                                color: getStockStatus(item.quantity).color,
                                                                fontWeight: 'bold'
                                                            }}
                                                        >
                                                            {item.quantity}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        icon={getStockStatus(item.quantity).icon}
                                                        label={getStockStatus(item.quantity).status}
                                                        sx={{
                                                            background: `linear-gradient(135deg, ${getStockStatus(item.quantity).color} 0%, ${getStockStatus(item.quantity).color}dd 100%)`,
                                                            color: 'white',
                                                            fontWeight: 'bold',
                                                            px: 2,
                                                            minWidth: 120,
                                                            '& .MuiChip-icon': {
                                                                color: 'white'
                                                            }
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                        <Tooltip title="Edit stock quantity">
                                                            <IconButton
                                                                onClick={() => handleEdit(item)}
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
                                                                <EditIcon/>
                                                            </IconButton>
                                                        </Tooltip>

                                                        <Tooltip title="Delete stock entry">
                                                            <IconButton
                                                                onClick={() => handleDelete(item.id)}
                                                                sx={{
                                                                    background: 'linear-gradient(135deg, #ed6c02 0%, #ff9800 100%)',
                                                                    color: 'white',
                                                                    '&:hover': {
                                                                        background: 'linear-gradient(135deg, #e65100 0%, #f57c00 100%)',
                                                                        transform: 'scale(1.1)',
                                                                    },
                                                                    transition: 'all 0.2s ease'
                                                                }}
                                                            >
                                                                <DeleteIcon/>
                                                            </IconButton>
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

                {/* Enhanced Dialog */}
                <Dialog
                    open={openDialog}
                    onClose={handleCloseDialog}
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
                        background: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)',
                        color: 'white',
                        py: 3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                    }}>
                        {isEditing ? <EditIcon /> : <AddIcon />}
                        {isEditing ? 'Edit Stock Entry' : 'Add New Stock Entry'}
                    </DialogTitle>
                    <DialogContent sx={{ mt: 3, pb: 2 }}>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {isEditing
                                    ? `Update the stock details for ${selectedInventory?.product.name} (${selectedInventory?.size})`
                                    : 'Add a new stock entry to your inventory system'
                                }
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <TextField
                                select
                                fullWidth
                                label="Select Product"
                                value={formData.productId}
                                onChange={(e) => handleInputChange('productId', e.target.value)}
                                required
                                error={!!formErrors.productId}
                                helperText={formErrors.productId}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#d32f2f',
                                            borderWidth: 2,
                                        }
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: '#d32f2f',
                                    }
                                }}
                                InputProps={{
                                    startAdornment: <SportsSoccerIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                }}
                            >
                                {products.map((product) => (
                                    <MenuItem key={product.id} value={product.id}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                            <span>{product.name}</span>
                                            <Typography variant="body2" color="text.secondary">
                                                ${product.price}
                                            </Typography>
                                        </Box>
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                select
                                fullWidth
                                label="Product Size"
                                value={formData.size}
                                onChange={(e) => handleInputChange('size', e.target.value)}
                                required
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#d32f2f',
                                            borderWidth: 2,
                                        }
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: '#d32f2f',
                                    }
                                }}
                                InputProps={{
                                    startAdornment: <StraightenIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                }}
                            >
                                {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                                    <MenuItem key={size} value={size}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <StraightenIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                            <Typography sx={{ fontWeight: 500 }}>
                                                Size {size}
                                            </Typography>
                                        </Box>
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                fullWidth
                                label="Stock Quantity"
                                type="number"
                                value={formData.quantity}
                                onChange={(e) => handleInputChange('quantity', e.target.value)}
                                required
                                error={!!formErrors.quantity}
                                helperText={formErrors.quantity || 'Enter the available quantity for this product size'}
                                inputProps={{min: "0"}}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#d32f2f',
                                            borderWidth: 2,
                                        }
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: '#d32f2f',
                                    }
                                }}
                                InputProps={{
                                    startAdornment: <NumbersIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                }}
                            />

                            {formData.quantity && (
                                <Box sx={{
                                    p: 2,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 3,
                                    background: 'rgba(211, 47, 47, 0.04)'
                                }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        Stock Status Preview:
                                    </Typography>
                                    <Chip
                                        icon={getStockStatus(parseInt(formData.quantity) || 0).icon}
                                        label={getStockStatus(parseInt(formData.quantity) || 0).status}
                                        sx={{
                                            background: `linear-gradient(135deg, ${getStockStatus(parseInt(formData.quantity) || 0).color} 0%, ${getStockStatus(parseInt(formData.quantity) || 0).color}dd 100%)`,
                                            color: 'white',
                                            fontWeight: 'bold',
                                            '& .MuiChip-icon': {
                                                color: 'white'
                                            }
                                        }}
                                    />
                                </Box>
                            )}
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, gap: 2 }}>
                        <Button
                            onClick={handleCloseDialog}
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
                            onClick={handleSubmit}
                            variant="contained"
                            sx={{
                                borderRadius: 3,
                                textTransform: 'none',
                                px: 4,
                                py: 1.5,
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
                            {isEditing ? 'Update Stock' : 'Add Stock'}
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
};

export default StockManagement;