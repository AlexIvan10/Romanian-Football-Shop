import React, {useState, useEffect, ChangeEvent} from 'react';
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
    Snackbar,
    Alert,
    FormControlLabel,
    Checkbox,
    AlertColor,
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
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import StoreIcon from '@mui/icons-material/Store';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import SearchIcon from '@mui/icons-material/Search';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import DescriptionIcon from '@mui/icons-material/Description';
import VerifiedIcon from '@mui/icons-material/Verified';
import CancelIcon from '@mui/icons-material/Cancel';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {useAuth} from '../../utils/AuthContext';
import {useNavigate} from 'react-router-dom';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    team: string;
    licenced: boolean;
}

interface FormData {
    name: string;
    description: string;
    price: string;
    team: string;
    licenced: boolean;
}

interface SnackbarState {
    open: boolean;
    message: string;
    severity: AlertColor;
}

const ProductManagement: React.FC = () => {
    const {user} = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        description: '',
        price: '',
        team: '',
        licenced: false
    });
    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: '',
        severity: 'success'
    });
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (user && user.role !== 'ADMIN') {
            navigate('/');
            return;
        }
        fetchProducts();
    }, [user, navigate]);

    const handleApiResponse = async (response: Response, successMessage: string): Promise<boolean> => {
        if (response.ok) {
            showSnackbar(successMessage, 'success');
            return true;
        } else if (response.status === 401 || response.status === 403) {
            showSnackbar('Unauthorized. Please make sure you have admin privileges.', 'error');
            navigate('/login');
            return false;
        } else {
            const errorText = await response.text();
            showSnackbar(errorText || 'Operation failed', 'error');
            return false;
        }
    };

    const fetchProducts = async (): Promise<void> => {
        try {
            const response = await fetch('http://localhost:8080/api/product', {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setProducts(data);
            } else if (response.status === 401 || response.status === 403) {
                showSnackbar('Unauthorized. Please make sure you have admin privileges.', 'error');
                navigate('/login');
            } else {
                throw new Error('Failed to fetch products');
            }
        } catch (error) {
            showSnackbar('Failed to fetch products', 'error');
        }
    };

    const validateForm = (): boolean => {
        const errors: { [key: string]: string } = {};

        if (!formData.name.trim()) {
            errors.name = 'Product name is required';
        }

        if (!formData.description.trim()) {
            errors.description = 'Product description is required';
        }

        if (!formData.price.trim()) {
            errors.price = 'Price is required';
        } else {
            const price = parseFloat(formData.price);
            if (isNaN(price) || price < 0) {
                errors.price = 'Price must be a valid positive number';
            }
        }

        if (!formData.team.trim()) {
            errors.team = 'Team is required';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const {name, value, type, checked} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear specific field error when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const showSnackbar = (message: string, severity: AlertColor): void => {
        setSnackbar({open: true, message, severity});
    };

    const handleSubmit = async (): Promise<void> => {
        if (!validateForm()) {
            return;
        }

        const url = 'http://localhost:8080/api/product';
        const method = isEditing ? 'PUT' : 'POST';
        const endpoint = isEditing && selectedProduct ? `${url}/${selectedProduct.id}` : url;

        try {
            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price)
                })
            });

            if (await handleApiResponse(response, `Product ${isEditing ? 'updated' : 'created'} successfully`)) {
                fetchProducts();
                handleCloseDialog();
            }
        } catch (error) {
            showSnackbar((error as Error).message, 'error');
        }
    };

    const handleEdit = (product: Product): void => {
        setSelectedProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            team: product.team,
            licenced: product.licenced
        });
        setIsEditing(true);
        setFormErrors({});
        setOpenDialog(true);
    };

    const handleDelete = async (id: number): Promise<void> => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            const response = await fetch(`http://localhost:8080/api/product/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (await handleApiResponse(response, 'Product deleted successfully')) {
                fetchProducts();
            }
        } catch (error) {
            showSnackbar((error as Error).message, 'error');
        }
    };

    const handleOpenDialog = (): void => {
        setFormData({
            name: '',
            description: '',
            price: '',
            team: '',
            licenced: false
        });
        setIsEditing(false);
        setFormErrors({});
        setOpenDialog(true);
    };

    const handleCloseDialog = (): void => {
        setOpenDialog(false);
        setSelectedProduct(null);
        setFormData({
            name: '',
            description: '',
            price: '',
            team: '',
            licenced: false
        });
        setFormErrors({});
    };

    const [searchQuery, setSearchQuery] = useState('');
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.team.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!user || user.role !== 'ADMIN') {
        return null;
    }

    // Calculate statistics
    const totalProducts = products.length;
    const licensedProducts = products.filter(p => p.licenced).length;
    const unlicensedProducts = products.filter(p => !p.licenced).length;
    const averagePrice = products.length > 0
        ? products.reduce((sum, p) => sum + p.price, 0) / products.length
        : 0;

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
                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>
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
                            label="Product Management"
                            icon={<Inventory2Icon/>}
                            sx={{
                                background: 'linear-gradient(45deg, #ed6c02, #ff9800)',
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
                                background: 'linear-gradient(135deg, #ed6c02 0%, #ff9800 100%)',
                                boxShadow: '0 8px 24px rgba(237, 108, 2, 0.3)',
                            }}>
                                <Inventory2Icon sx={{
                                    fontSize: 40,
                                    color: 'white'
                                }}/>
                            </Box>
                            <Box>
                                <Typography
                                    variant="h3"
                                    sx={{
                                        fontWeight: 800,
                                        background: 'linear-gradient(45deg, #ed6c02, #ff9800)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        color: 'transparent',
                                        mb: 0.5,
                                    }}
                                >
                                    Product Management
                                </Typography>
                                <Typography variant="h6" color="text.secondary" sx={{fontWeight: 400}}>
                                    Manage your football store inventory and products
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
                                background: 'linear-gradient(135deg, #ed6c02 0%, #ff9800 100%)',
                                boxShadow: '0 6px 20px rgba(237, 108, 2, 0.3)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #e65100 0%, #f57c00 100%)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 25px rgba(237, 108, 2, 0.4)',
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            Add New Product
                        </Button>
                    </Box>
                </Paper>

                {/* Statistics Cards */}
                <Grid container spacing={3} sx={{mb: 4}}>
                    <Grid size={{xs: 12, md: 3}}>
                        <Card sx={{
                            background: 'linear-gradient(135deg, #ed6c02 0%, #ff9800 100%)',
                            color: 'white',
                            borderRadius: 3,
                            height: '100%'
                        }}>
                            <CardContent sx={{p: 3}}>
                                <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <Box>
                                        <Typography variant="h4" sx={{fontWeight: 'bold', mb: 1}}>
                                            {totalProducts}
                                        </Typography>
                                        <Typography variant="body1" sx={{opacity: 0.9}}>
                                            Total Products
                                        </Typography>
                                    </Box>
                                    <Avatar sx={{bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56}}>
                                        <Inventory2Icon sx={{fontSize: 30}}/>
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
                            <CardContent sx={{p: 3}}>
                                <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <Box>
                                        <Typography variant="h4" sx={{fontWeight: 'bold', mb: 1}}>
                                            {licensedProducts}
                                        </Typography>
                                        <Typography variant="body1" sx={{opacity: 0.9}}>
                                            Licensed Products
                                        </Typography>
                                    </Box>
                                    <Avatar sx={{bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56}}>
                                        <VerifiedIcon sx={{fontSize: 30}}/>
                                    </Avatar>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{xs: 12, md: 3}}>
                        <Card sx={{
                            background: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)',
                            color: 'white',
                            borderRadius: 3,
                            height: '100%'
                        }}>
                            <CardContent sx={{p: 3}}>
                                <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <Box>
                                        <Typography variant="h4" sx={{fontWeight: 'bold', mb: 1}}>
                                            {unlicensedProducts}
                                        </Typography>
                                        <Typography variant="body1" sx={{opacity: 0.9}}>
                                            Unlicensed Products
                                        </Typography>
                                    </Box>
                                    <Avatar sx={{bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56}}>
                                        <CancelIcon sx={{fontSize: 30}}/>
                                    </Avatar>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{xs: 12, md: 3}}>
                        <Card sx={{
                            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                            color: 'white',
                            borderRadius: 3,
                            height: '100%'
                        }}>
                            <CardContent sx={{p: 3}}>
                                <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <Box>
                                        <Typography variant="h4" sx={{fontWeight: 'bold', mb: 1}}>
                                            ${averagePrice.toFixed(2)}
                                        </Typography>
                                        <Typography variant="body1" sx={{opacity: 0.9}}>
                                            Average Price
                                        </Typography>
                                    </Box>
                                    <Avatar sx={{bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56}}>
                                        <AttachMoneyIcon sx={{fontSize: 30}}/>
                                    </Avatar>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Search Section */}
                <Paper sx={{p: 3, mb: 4, borderRadius: 3}}>
                    <TextField
                        fullWidth
                        label="Search Products"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by product name or team..."
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{color: 'text.secondary'}}/>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 3,
                                '&.Mui-focused fieldset': {
                                    borderColor: '#ed6c02',
                                    borderWidth: 2,
                                }
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: '#ed6c02',
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
                        background: 'linear-gradient(135deg, #ed6c02 0%, #ff9800 100%)',
                        p: 3,
                        color: 'white'
                    }}>
                        <Typography variant="h5" sx={{fontWeight: 600, display: 'flex', alignItems: 'center', gap: 2}}>
                            <Inventory2Icon/>
                            Product Management Table
                        </Typography>
                        <Typography variant="body2" sx={{opacity: 0.9, mt: 1}}>
                            View and manage all products in your football store
                        </Typography>
                    </Box>

                    <TableContainer sx={{maxHeight: 600}}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{
                                        background: 'linear-gradient(135deg, #ed6c02 0%, #ff9800 100%)',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: '1rem'
                                    }}>
                                        Product ID
                                    </TableCell>
                                    <TableCell sx={{
                                        background: 'linear-gradient(135deg, #ed6c02 0%, #ff9800 100%)',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: '1rem'
                                    }}>
                                        Product Name
                                    </TableCell>
                                    <TableCell sx={{
                                        background: 'linear-gradient(135deg, #ed6c02 0%, #ff9800 100%)',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: '1rem'
                                    }}>
                                        Price
                                    </TableCell>
                                    <TableCell sx={{
                                        background: 'linear-gradient(135deg, #ed6c02 0%, #ff9800 100%)',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: '1rem'
                                    }}>
                                        Team
                                    </TableCell>
                                    <TableCell sx={{
                                        background: 'linear-gradient(135deg, #ed6c02 0%, #ff9800 100%)',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: '1rem'
                                    }}>
                                        Licensed
                                    </TableCell>
                                    <TableCell align="center" sx={{
                                        background: 'linear-gradient(135deg, #ed6c02 0%, #ff9800 100%)',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: '1rem'
                                    }}>
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredProducts.map((product, index) => (
                                    <Fade in timeout={300 + index * 100} key={product.id}>
                                        <TableRow
                                            sx={{
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(237, 108, 2, 0.08)',
                                                    transform: 'scale(1.01)',
                                                },
                                                '&:nth-of-type(even)': {
                                                    backgroundColor: 'rgba(0, 0, 0, 0.02)'
                                                }
                                            }}
                                        >
                                            <TableCell>
                                                <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                                                    <Avatar sx={{
                                                        width: 40,
                                                        height: 40,
                                                        background: 'linear-gradient(135deg, #ed6c02 0%, #ff9800 100%)',
                                                        fontSize: '0.9rem',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        #{product.id}
                                                    </Avatar>
                                                    <Typography variant="body1" sx={{fontWeight: 600}}>
                                                        {product.id}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                                                    <SportsSoccerIcon sx={{color: 'text.secondary', fontSize: 20}}/>
                                                    <Box>
                                                        <Typography variant="body1" sx={{fontWeight: 600}}>
                                                            {product.name}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary" sx={{
                                                            maxWidth: 200,
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap'
                                                        }}>
                                                            {product.description}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                                    <AttachMoneyIcon sx={{color: '#ed6c02', fontSize: 20}}/>
                                                    <Typography variant="h6"
                                                                sx={{color: '#ed6c02', fontWeight: 'bold'}}>
                                                        {product.price.toFixed(2)}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={product.team}
                                                    sx={{
                                                        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                                                        color: 'white',
                                                        fontWeight: 'bold',
                                                        px: 2,
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    icon={product.licenced ? <VerifiedIcon/> : <CancelIcon/>}
                                                    label={product.licenced ? 'Licensed' : 'Unlicensed'}
                                                    sx={{
                                                        background: product.licenced
                                                            ? 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)'
                                                            : 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)',
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
                                                <Box sx={{display: 'flex', gap: 1, justifyContent: 'center'}}>
                                                    <Tooltip title="Edit product">
                                                        <IconButton
                                                            onClick={() => handleEdit(product)}
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

                                                    <Tooltip title="Delete product">
                                                        <IconButton
                                                            onClick={() => handleDelete(product.id)}
                                                            sx={{
                                                                background: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)',
                                                                color: 'white',
                                                                '&:hover': {
                                                                    background: 'linear-gradient(135deg, #c62828 0%, #e53935 100%)',
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
                    maxWidth="md"
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
                        background: 'linear-gradient(135deg, #ed6c02 0%, #ff9800 100%)',
                        color: 'white',
                        py: 3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                    }}>
                        {isEditing ? <EditIcon/> : <AddIcon/>}
                        {isEditing ? 'Edit Product' : 'Add New Product'}
                    </DialogTitle>
                    <DialogContent sx={{mt: 3, pb: 2}}>
                        <Box sx={{mb: 2}}>
                            <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
                                {isEditing
                                    ? `Update the product details for product ID: ${selectedProduct?.id}`
                                    : 'Add a new product to your football store inventory'
                                }
                            </Typography>
                        </Box>
                        <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
                            <TextField
                                fullWidth
                                label="Product Name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                autoFocus
                                error={!!formErrors.name}
                                helperText={formErrors.name}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#ed6c02',
                                            borderWidth: 2,
                                        }
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: '#ed6c02',
                                    }
                                }}
                                InputProps={{
                                    startAdornment: <SportsSoccerIcon sx={{mr: 1, color: 'text.secondary'}}/>
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Product Description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                multiline
                                rows={4}
                                required
                                error={!!formErrors.description}
                                helperText={formErrors.description}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#ed6c02',
                                            borderWidth: 2,
                                        }
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: '#ed6c02',
                                    }
                                }}
                                InputProps={{
                                    startAdornment: <DescriptionIcon
                                        sx={{mr: 1, color: 'text.secondary', alignSelf: 'flex-start', mt: 1}}/>
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Price (USD)"
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleInputChange}
                                required
                                error={!!formErrors.price}
                                helperText={formErrors.price || 'Enter the product price in USD'}
                                inputProps={{step: "0.01", min: "0"}}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#ed6c02',
                                            borderWidth: 2,
                                        }
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: '#ed6c02',
                                    }
                                }}
                                InputProps={{
                                    startAdornment: <AttachMoneyIcon sx={{mr: 1, color: 'text.secondary'}}/>
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Team Name"
                                name="team"
                                value={formData.team}
                                onChange={handleInputChange}
                                required
                                error={!!formErrors.team}
                                helperText={formErrors.team}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#ed6c02',
                                            borderWidth: 2,
                                        }
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: '#ed6c02',
                                    }
                                }}
                                InputProps={{
                                    startAdornment: <StoreIcon sx={{mr: 1, color: 'text.secondary'}}/>
                                }}
                            />

                            <Box sx={{
                                p: 2,
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 3,
                                background: 'rgba(237, 108, 2, 0.04)'
                            }}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={formData.licenced}
                                            onChange={handleInputChange}
                                            name="licenced"
                                            sx={{
                                                color: '#ed6c02',
                                                '&.Mui-checked': {
                                                    color: '#ed6c02',
                                                },
                                            }}
                                        />
                                    }
                                    label={
                                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                            <VerifiedIcon sx={{color: '#ed6c02', fontSize: 20}}/>
                                            <Typography variant="body1" sx={{fontWeight: 500}}>
                                                Licensed Product
                                            </Typography>
                                        </Box>
                                    }
                                />
                                <Typography variant="body2" color="text.secondary" sx={{ml: 4, mt: 0.5}}>
                                    Check this if the product is officially licensed by the team
                                </Typography>
                            </Box>
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{p: 3, gap: 2}}>
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
                                background: 'linear-gradient(135deg, #ed6c02 0%, #ff9800 100%)',
                                boxShadow: '0 6px 20px rgba(237, 108, 2, 0.3)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #e65100 0%, #f57c00 100%)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 25px rgba(237, 108, 2, 0.4)',
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {isEditing ? 'Update Product' : 'Create Product'}
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

export default ProductManagement;