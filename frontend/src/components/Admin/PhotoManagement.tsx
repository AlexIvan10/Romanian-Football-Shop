import React, {useState, useEffect} from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Grid,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Snackbar,
    Alert,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    FormControlLabel,
    Switch,
    MenuItem,
    Chip,
    Avatar,
    Tooltip,
    Fade,
    InputAdornment,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PhotoIcon from '@mui/icons-material/Photo';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import SearchIcon from '@mui/icons-material/Search';
import ImageIcon from '@mui/icons-material/Image';
import LinkIcon from '@mui/icons-material/Link';
import OrderIcon from '@mui/icons-material/FormatListNumbered';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import CollectionsIcon from '@mui/icons-material/Collections';
import {useAuth} from '../../utils/AuthContext';
import {useNavigate} from 'react-router-dom';

interface Product {
    id: number;
    name: string;
}

interface ProductPhoto {
    id: number;
    product: Product;
    photoUrl: string;
    isPrimary: boolean;
    displayOrder: number;
}

interface FormData {
    productId: string;
    photoUrl: string;
    isPrimary: boolean;
    displayOrder: string;
}

const PhotoManagement: React.FC = () => {
    const {user} = useAuth();
    const navigate = useNavigate();
    const [photos, setPhotos] = useState<ProductPhoto[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState<ProductPhoto | null>(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [previewError, setPreviewError] = useState(false);
    const [previewLoading, setPreviewLoading] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        productId: '',
        photoUrl: '',
        isPrimary: false,
        displayOrder: '0'
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPhotos, setFilteredPhotos] = useState<ProductPhoto[]>([]);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (user && user.role !== 'ADMIN') {
            navigate('/');
            return;
        }
        fetchPhotos();
        fetchProducts();
    }, [user, navigate]);

    useEffect(() => {
        // Filter photos based on search query
        const filtered = photos.filter(photo =>
            photo.product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredPhotos(filtered);
    }, [searchQuery, photos]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const url = formData.photoUrl.trim();
            if (url) {
                setPreviewLoading(true);
                setPreviewError(false);

                // Test if the image can be loaded
                const img = new Image();
                img.onload = () => {
                    setPreviewUrl(url);
                    setPreviewLoading(false);
                };
                img.onerror = () => {
                    setPreviewError(true);
                    setPreviewLoading(false);
                    setPreviewUrl('');
                };
                img.src = url;
            } else {
                setPreviewUrl('');
                setPreviewError(false);
                setPreviewLoading(false);
            }
        }, 800); // Wait 800ms after user stops typing

        return () => clearTimeout(timeoutId);
    }, [formData.photoUrl]);

    const fetchPhotos = async (productId?: string) => {
        try {
            let url = 'http://localhost:8080/api/productPhotos';
            if (productId) {
                url += `/${productId}`;
            }

            const response = await fetch(url, {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setPhotos(Array.isArray(data) ? data : [data]);
            } else if (response.status === 401 || response.status === 403) {
                showSnackbar('Unauthorized. Please login again.', 'error');
                navigate('/login');
            }
        } catch (error) {
            showSnackbar('Failed to fetch photos', 'error');
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
        const errors: { [key: string]: string } = {};

        if (!formData.productId) {
            errors.productId = 'Product selection is required';
        }

        if (!formData.photoUrl.trim()) {
            errors.photoUrl = 'Photo URL is required';
        } else {
            const urlValue = formData.photoUrl.trim();

            const isRelativeUrl = urlValue.startsWith('/images/products');

            if (!isRelativeUrl) {
                try {
                    new URL(urlValue);
                } catch {
                    errors.photoUrl = 'Please enter a valid URL (absolute URL or relative path starting with /images/products)';
                }
            }

        }

        if (!formData.displayOrder.trim()) {
            errors.displayOrder = 'Display order is required';
        } else {
            const order = parseInt(formData.displayOrder);
            if (isNaN(order) || order < 0) {
                errors.displayOrder = 'Display order must be a positive number';
            }
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (field: string, value: string | boolean) => {
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

        // Clear preview states when URL field changes
        if (field === 'photoUrl') {
            setPreviewError(false);
            setPreviewLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            const selectedProduct = products.find(p => p.id === parseInt(formData.productId));
            if (!selectedProduct) {
                showSnackbar('Invalid product selected', 'error');
                return;
            }

            const photoData = {
                id: selectedPhoto?.id,
                product: selectedProduct,
                photoUrl: formData.photoUrl,
                isPrimary: formData.isPrimary,
                displayOrder: parseInt(formData.displayOrder)
            };

            // If setting as primary, first update any existing primary photo
            if (formData.isPrimary) {
                const existingPrimary = photos.find(
                    photo => photo.product.id === parseInt(formData.productId) &&
                        photo.isPrimary &&
                        (!selectedPhoto || photo.id !== selectedPhoto.id)
                );

                if (existingPrimary) {
                    await fetch(`http://localhost:8080/api/productPhotos/${existingPrimary.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'  // Remove auth header
                        },
                        credentials: 'include',
                        body: JSON.stringify({...existingPrimary, isPrimary: false})
                    });
                }
            }

            const url = 'http://localhost:8080/api/productPhotos';
            const method = isEditing ? 'PUT' : 'POST';
            const endpoint = isEditing && selectedPhoto ? `${url}/${selectedPhoto.id}` : url;

            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json'  // Remove auth header
                },
                credentials: 'include',
                body: JSON.stringify(photoData)
            });

            if (response.ok) {
                showSnackbar(`Photo ${isEditing ? 'updated' : 'added'} successfully`, 'success');
                fetchPhotos();
                handleCloseDialog();
            } else {
                throw new Error('Operation failed');
            }
        } catch (error) {
            showSnackbar((error as Error).message, 'error');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this photo?')) return;

        try {
            const response = await fetch(`http://localhost:8080/api/productPhotos/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                showSnackbar('Photo deleted successfully', 'success');
                fetchPhotos();
            } else {
                throw new Error('Failed to delete photo');
            }
        } catch (error) {
            showSnackbar((error as Error).message, 'error');
        }
    };

    const handleEdit = (photo: ProductPhoto) => {
        setSelectedPhoto(photo);
        setFormData({
            productId: photo.product.id.toString(),
            photoUrl: photo.photoUrl,
            isPrimary: photo.isPrimary || false,
            displayOrder: photo.displayOrder?.toString() || '0'
        });
        setIsEditing(true);
        setFormErrors({});
        setOpenDialog(true);
    };

    const handleOpenDialog = () => {
        setFormData({
            productId: '',
            photoUrl: '',
            isPrimary: false,
            displayOrder: '0'
        });
        setIsEditing(false);
        setFormErrors({});
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedPhoto(null);
        setFormData({
            productId: '',
            photoUrl: '',
            isPrimary: false,
            displayOrder: '0'
        });
        setFormErrors({});
        // Clear preview states
        setPreviewUrl('');
        setPreviewError(false);
        setPreviewLoading(false);
    };

    const showSnackbar = (message: string, severity: 'success' | 'error') => {
        setSnackbar({open: true, message, severity});
    };

    if (!user || user.role !== 'ADMIN') {
        return null;
    }

    // Calculate statistics
    const totalPhotos = photos.length;
    const primaryPhotos = photos.filter(p => p.isPrimary).length;
    const secondaryPhotos = photos.filter(p => !p.isPrimary).length;
    const uniqueProducts = new Set(photos.map(p => p.product.id)).size;

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
                            label="Photo Management"
                            icon={<PhotoLibraryIcon/>}
                            sx={{
                                background: 'linear-gradient(45deg, #7b1fa2, #ab47bc)',
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
                                background: 'linear-gradient(135deg, #7b1fa2 0%, #ab47bc 100%)',
                                boxShadow: '0 8px 24px rgba(123, 31, 162, 0.3)',
                            }}>
                                <CollectionsIcon sx={{
                                    fontSize: 40,
                                    color: 'white'
                                }}/>
                            </Box>
                            <Box>
                                <Typography
                                    variant="h3"
                                    sx={{
                                        fontWeight: 800,
                                        background: 'linear-gradient(45deg, #7b1fa2, #ab47bc)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        color: 'transparent',
                                        mb: 0.5,
                                    }}
                                >
                                    Photo Management
                                </Typography>
                                <Typography variant="h6" color="text.secondary" sx={{fontWeight: 400}}>
                                    Manage product photos and image galleries
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
                                background: 'linear-gradient(135deg, #7b1fa2 0%, #ab47bc 100%)',
                                boxShadow: '0 6px 20px rgba(123, 31, 162, 0.3)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #6a1b9a 0%, #9c27b0 100%)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 25px rgba(123, 31, 162, 0.4)',
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            Add New Photo
                        </Button>
                    </Box>
                </Paper>

                {/* Statistics Cards */}
                <Grid container spacing={3} sx={{mb: 4}}>
                    <Grid size={{xs: 12, md: 3}}>
                        <Card sx={{
                            background: 'linear-gradient(135deg, #7b1fa2 0%, #ab47bc 100%)',
                            color: 'white',
                            borderRadius: 3,
                            height: '100%'
                        }}>
                            <CardContent sx={{p: 3}}>
                                <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <Box>
                                        <Typography variant="h4" sx={{fontWeight: 'bold', mb: 1}}>
                                            {totalPhotos}
                                        </Typography>
                                        <Typography variant="body1" sx={{opacity: 0.9}}>
                                            Total Photos
                                        </Typography>
                                    </Box>
                                    <Avatar sx={{bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56}}>
                                        <PhotoLibraryIcon sx={{fontSize: 30}}/>
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
                                            {primaryPhotos}
                                        </Typography>
                                        <Typography variant="body1" sx={{opacity: 0.9}}>
                                            Primary Photos
                                        </Typography>
                                    </Box>
                                    <Avatar sx={{bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56}}>
                                        <StarIcon sx={{fontSize: 30}}/>
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
                                            {secondaryPhotos}
                                        </Typography>
                                        <Typography variant="body1" sx={{opacity: 0.9}}>
                                            Secondary Photos
                                        </Typography>
                                    </Box>
                                    <Avatar sx={{bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56}}>
                                        <ImageIcon sx={{fontSize: 30}}/>
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
                            <CardContent sx={{p: 3}}>
                                <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <Box>
                                        <Typography variant="h4" sx={{fontWeight: 'bold', mb: 1}}>
                                            {uniqueProducts}
                                        </Typography>
                                        <Typography variant="body1" sx={{opacity: 0.9}}>
                                            Products with Photos
                                        </Typography>
                                    </Box>
                                    <Avatar sx={{bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56}}>
                                        <PhotoIcon sx={{fontSize: 30}}/>
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
                        label="Search Product Photos"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by product name..."
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
                                    borderColor: '#7b1fa2',
                                    borderWidth: 2,
                                }
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: '#7b1fa2',
                            }
                        }}
                    />
                </Paper>

                {/* Photo Grid */}
                <Grid container spacing={3}>
                    {filteredPhotos.map((photo, index) => (
                        <Grid size={{xs: 12, sm: 6, md: 4, lg: 3}} key={photo.id}>
                            <Fade in timeout={300 + index * 100}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderRadius: 3,
                                        overflow: 'hidden',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-8px)',
                                            boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                                        }
                                    }}
                                >
                                    <Box sx={{position: 'relative'}}>
                                        <CardMedia
                                            component="img"
                                            height="220"
                                            image={photo.photoUrl}
                                            alt={`Product ${photo.product.name}`}
                                            sx={{
                                                objectFit: 'cover',
                                                backgroundColor: '#f5f5f5'
                                            }}
                                        />
                                        {photo.isPrimary && (
                                            <Chip
                                                icon={<StarIcon/>}
                                                label="Primary"
                                                size="small"
                                                sx={{
                                                    position: 'absolute',
                                                    top: 8,
                                                    right: 8,
                                                    background: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    '& .MuiChip-icon': {
                                                        color: 'white'
                                                    }
                                                }}
                                            />
                                        )}
                                        <Box sx={{
                                            position: 'absolute',
                                            bottom: 8,
                                            left: 8,
                                            background: 'rgba(0,0,0,0.7)',
                                            borderRadius: 2,
                                            px: 1.5,
                                            py: 0.5
                                        }}>
                                            <Typography variant="caption" sx={{color: 'white', fontWeight: 500}}>
                                                Order: {photo.displayOrder}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <CardContent sx={{flexGrow: 1, p: 3}}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 600,
                                                color: 'text.primary',
                                                mb: 1,
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            {photo.product.name}
                                        </Typography>

                                        <Chip
                                            label={photo.isPrimary ? 'Primary Photo' : 'Secondary Photo'}
                                            size="small"
                                            icon={photo.isPrimary ? <StarIcon/> : <StarBorderIcon/>}
                                            sx={{
                                                background: photo.isPrimary
                                                    ? 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)'
                                                    : 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                                                color: 'white',
                                                fontWeight: 'bold',
                                                '& .MuiChip-icon': {
                                                    color: 'white'
                                                }
                                            }}
                                        />
                                    </CardContent>

                                    <CardActions sx={{justifyContent: 'space-between', p: 2, pt: 0}}>
                                        <Box sx={{display: 'flex', gap: 1}}>
                                            <Tooltip title="Edit photo">
                                                <IconButton
                                                    onClick={() => handleEdit(photo)}
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
                                                    <EditIcon sx={{fontSize: 20}}/>
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip title="Delete photo">
                                                <IconButton
                                                    onClick={() => handleDelete(photo.id)}
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
                                                    <DeleteIcon sx={{fontSize: 20}}/>
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </CardActions>
                                </Card>
                            </Fade>
                        </Grid>
                    ))}
                </Grid>

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
                        background: 'linear-gradient(135deg, #7b1fa2 0%, #ab47bc 100%)',
                        color: 'white',
                        py: 3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                    }}>
                        {isEditing ? <EditIcon/> : <AddIcon/>}
                        {isEditing ? 'Edit Photo' : 'Add New Photo'}
                    </DialogTitle>
                    <DialogContent sx={{mt: 3, pb: 2}}>
                        <Box sx={{mb: 2}}>
                            <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
                                {isEditing
                                    ? `Update the photo details for ${selectedPhoto?.product.name}`
                                    : 'Add a new photo to your product gallery'
                                }
                            </Typography>
                        </Box>
                        <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
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
                                            borderColor: '#7b1fa2',
                                            borderWidth: 2,
                                        }
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: '#7b1fa2',
                                    }
                                }}
                                InputProps={{
                                    startAdornment: <PhotoIcon sx={{mr: 1, color: 'text.secondary'}}/>
                                }}
                            >
                                {products.map((product) => (
                                    <MenuItem key={product.id} value={product.id}>
                                        {product.name}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <TextField
                                fullWidth
                                label="Photo URL"
                                value={formData.photoUrl}
                                onChange={(e) => handleInputChange('photoUrl', e.target.value)}
                                required
                                error={!!formErrors.photoUrl}
                                helperText={formErrors.photoUrl || 'Enter the complete URL of the image'}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#7b1fa2',
                                            borderWidth: 2,
                                        }
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: '#7b1fa2',
                                    }
                                }}
                                InputProps={{
                                    startAdornment: <LinkIcon sx={{mr: 1, color: 'text.secondary'}}/>
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Display Order"
                                type="number"
                                value={formData.displayOrder}
                                onChange={(e) => handleInputChange('displayOrder', e.target.value)}
                                required
                                error={!!formErrors.displayOrder}
                                helperText={formErrors.displayOrder || 'Set the order for displaying this photo'}
                                inputProps={{min: "0"}}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#7b1fa2',
                                            borderWidth: 2,
                                        }
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: '#7b1fa2',
                                    }
                                }}
                                InputProps={{
                                    startAdornment: <OrderIcon sx={{mr: 1, color: 'text.secondary'}}/>
                                }}
                            />

                            <Box sx={{
                                p: 2,
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 3,
                                background: 'rgba(123, 31, 162, 0.04)'
                            }}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.isPrimary}
                                            onChange={(e) => handleInputChange('isPrimary', e.target.checked)}
                                            sx={{
                                                '& .MuiSwitch-switchBase.Mui-checked': {
                                                    color: '#7b1fa2',
                                                },
                                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                    backgroundColor: '#7b1fa2',
                                                },
                                            }}
                                        />
                                    }
                                    label={
                                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                            <StarIcon sx={{color: '#7b1fa2', fontSize: 20}}/>
                                            <Typography variant="body1" sx={{fontWeight: 500}}>
                                                Set as Primary Photo
                                            </Typography>
                                        </Box>
                                    }
                                />
                                <Typography variant="body2" color="text.secondary" sx={{ml: 4, mt: 0.5}}>
                                    Primary photos are displayed first in product galleries
                                </Typography>
                            </Box>

                            {(previewUrl || previewLoading || previewError) && (
                                <Box sx={{
                                    p: 2,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 3,
                                    background: 'rgba(0,0,0,0.02)'
                                }}>
                                    <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
                                        Photo Preview:
                                    </Typography>

                                    {previewLoading && (
                                        <Box sx={{
                                            width: '100%',
                                            height: 200,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: '#f5f5f5',
                                            borderRadius: 2,
                                            border: '1px solid #e0e0e0'
                                        }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Loading preview...
                                            </Typography>
                                        </Box>
                                    )}

                                    {previewError && (
                                        <Box sx={{
                                            width: '100%',
                                            height: 200,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: '#f5f5f5',
                                            borderRadius: 2,
                                            border: '1px solid #e0e0e0'
                                        }}>
                                            <ImageIcon sx={{fontSize: 48, color: 'text.disabled', mb: 1}}/>
                                            <Typography variant="body2" color="text.secondary">
                                                Unable to load image preview
                                            </Typography>
                                            <Typography variant="caption" color="text.disabled">
                                                Please check if the URL is accessible
                                            </Typography>
                                        </Box>
                                    )}

                                    {previewUrl && !previewLoading && !previewError && (
                                        <Box
                                            component="img"
                                            src={previewUrl}
                                            alt="Preview"
                                            sx={{
                                                width: '100%',
                                                height: 200,
                                                objectFit: 'contain',
                                                borderRadius: 2,
                                                backgroundColor: '#f5f5f5',
                                                border: '1px solid #e0e0e0'
                                            }}
                                        />
                                    )}
                                </Box>
                            )}
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
                                background: 'linear-gradient(135deg, #7b1fa2 0%, #ab47bc 100%)',
                                boxShadow: '0 6px 20px rgba(123, 31, 162, 0.3)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #6a1b9a 0%, #9c27b0 100%)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 25px rgba(123, 31, 162, 0.4)',
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {isEditing ? 'Update Photo' : 'Add Photo'}
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

export default PhotoManagement;