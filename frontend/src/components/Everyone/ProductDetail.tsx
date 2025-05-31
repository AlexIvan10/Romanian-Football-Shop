import React, {useCallback, useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {useAuth} from '../../utils/AuthContext';
import {
    Container,
    Grid,
    Typography,
    Button,
    Box,
    Paper,
    CircularProgress,
    IconButton,
    AppBar,
    Toolbar,
    InputBase,
    ToggleButton,
    ToggleButtonGroup,
    TextField,
    OutlinedInput,
    InputAdornment,
    Tooltip,
    Snackbar,
    Alert,
    AlertColor,
} from '@mui/material';
import {styled} from '@mui/material/styles';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import VerifiedIcon from '@mui/icons-material/Verified';

// Styled components
const Search = styled('div')(({theme}) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: '#f5f5f5',
    marginRight: theme.spacing(10),
    marginLeft: theme.spacing(-2),
    width: '100%',
    maxWidth: '600px',
}));

const SearchIconWrapper = styled('div')(({theme}) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({theme}) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        width: '100%',
    },
}));

const TopAppBar = styled(AppBar)(({theme}) => ({
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    color: '#000',
    boxShadow: 'none',
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
}));

const StyledButton = styled(Button)(({theme}) => ({
    background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '8px',
    textTransform: 'none',
    boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
    transition: 'transform 0.2s',
    '&:hover': {
        transform: 'scale(1.05)',
        background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
    }
}));

const StyledToggleButton = styled(ToggleButton)(({theme}) => ({
    width: '60px',
    position: 'relative',
    transition: 'all 0.2s ease',
    '&.Mui-selected': {
        background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
        color: 'white',
        transform: 'scale(1.05)',
        '&:hover': {
            background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
        },
    },
    '&:hover': {
        transform: 'scale(1.05)',
    },
    '&.Mui-disabled': {
        color: 'text.disabled',
        bgcolor: 'action.disabledBackground',
        '&::after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: '1px',
            backgroundColor: 'text.disabled',
            transform: 'rotate(-10deg)',
        },
    },
}));

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    team: string;
    licenced: boolean;
}

interface ProductPhoto {
    id: number;
    photoUrl: string;
    isPrimary: boolean;
    displayOrder: number;
}

interface ProductSize {
    size: string;
    quantity: number;
}

interface WishlistItemDTO {
    id: number;
    product: {
        id: number;
    };
}

interface SnackbarState {
    open: boolean;
    message: string;
    severity: AlertColor;
}

const ALL_SIZES = ['S', 'M', 'L', 'XL', 'XXL'] as const;
type Size = typeof ALL_SIZES[number];

const ProductDetail: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const {user} = useAuth();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [photos, setPhotos] = useState<ProductPhoto[]>([]);
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
    const [availableSizes, setAvailableSizes] = useState<ProductSize[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [quantity, setQuantity] = useState(1);
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: '',
        severity: 'success'
    });

    const showSnackbar = (message: string, severity: AlertColor): void => {
        setSnackbar({open: true, message, severity});
    };

    const handleSizeChange = (
        event: React.MouseEvent<HTMLElement>,
        newSize: string,
    ) => {
        setSelectedSize(newSize);
    };

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity >= 1 && newQuantity <= 10) {
            setQuantity(newQuantity);
        }
    };

    const checkWishlistStatus = useCallback(async () => {
        if (!user || !product) return;

        try {
            const response = await fetch(`http://localhost:8080/api/wishlist/user/${user.id}/check/${product.id}`, {
                credentials: 'include'
            });

            if (!response.ok) throw new Error('Failed to check wishlist status');

            const data = await response.json();
            setIsInWishlist(data.inWishlist);
        } catch (error) {
            console.error('Error checking wishlist status:', error);
        }
    }, [user, product]);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                setLoading(true);
                // Fetch product details
                const productResponse = await fetch(`http://localhost:8080/api/product/${id}`);
                if (!productResponse.ok) throw new Error('Failed to fetch product');
                const productData = await productResponse.json();
                setProduct(productData);

                // Fetch product photos
                const photosResponse = await fetch(`http://localhost:8080/api/productPhotos/${id}`);
                if (!photosResponse.ok) throw new Error('Failed to fetch photos');
                const photosData = await photosResponse.json();
                setPhotos(photosData);

                // Fetch inventory/sizes
                const inventoryResponse = await fetch(`http://localhost:8080/api/productInventory/product/${id}`);
                if (!inventoryResponse.ok) throw new Error('Failed to fetch inventory');
                const inventoryData = await inventoryResponse.json();
                // Filter only sizes with quantity > 0
                const availableSizes = inventoryData
                    .filter((item: ProductSize) => item.quantity > 0)
                    .sort((a: ProductSize, b: ProductSize) => {
                        const sizeOrder = {'S': 1, 'M': 2, 'L': 3, 'XL': 4, 'XXL': 5};
                        return sizeOrder[a.size as keyof typeof sizeOrder] - sizeOrder[b.size as keyof typeof sizeOrder];
                    });
                setAvailableSizes(availableSizes);

                if (user) {
                    // Check wishlist status after product is fetched
                    const wishlistResponse = await fetch(`http://localhost:8080/api/wishlist/user/${user.id}/check/${productData.id}`, {
                        credentials: 'include'
                    });

                    if (wishlistResponse.ok) {
                        const data = await wishlistResponse.json();
                        setIsInWishlist(data.inWishlist);
                    }
                }

            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProductData();
        }
    }, [id, user]);

    const handleAddToCart = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (!selectedSize) {
            showSnackbar('Please select a size before adding to cart', 'warning');
            return;
        }

        try {
            // First get the user's cart
            const cartResponse = await fetch(`http://localhost:8080/api/cart/user/${user.id}`, {
                credentials: 'include'
            });

            if (!cartResponse.ok) {
                throw new Error('Failed to get user cart');
            }

            const cartData = await cartResponse.json();

            // Now add the item to the cart
            const response = await fetch('http://localhost:8080/api/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    cartId: cartData.id,
                    productId: product?.id,
                    size: selectedSize,
                    quantity: quantity,
                    player: name || null,
                    number: number || null
                })
            });

            if (response.ok) {
                showSnackbar('Product added to cart successfully!', 'success');
                // Reset form after successful addition
                setSelectedSize('');
                setQuantity(1);
                setName('');
                setNumber('');
            } else if (response.status === 401 || response.status === 403) {
                showSnackbar('Authentication required. Please log in again.', 'error');
                navigate('/login');
            } else {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to add item to cart');
            }
        } catch (err) {
            console.error('Error adding to cart:', err);
            showSnackbar(err instanceof Error ? err.message : 'Failed to add item to cart. Please try again.', 'error');
        }
    };

    const toggleWishlist = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            if (isInWishlist) {
                // Find wishlist item ID first
                const wishlistResponse = await fetch(`http://localhost:8080/api/wishlist/user/${user.id}/items`, {
                    credentials: 'include'
                });

                if (!wishlistResponse.ok) throw new Error('Failed to fetch wishlist items');

                const wishlistItems: WishlistItemDTO[] = await wishlistResponse.json();
                const wishlistItem = wishlistItems.find(item => item.product.id === product?.id);

                if (!wishlistItem) throw new Error('Wishlist item not found');

                // Remove from wishlist
                const response = await fetch(`http://localhost:8080/api/wishlistItems/${wishlistItem.id}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });

                if (response.ok) {
                    setIsInWishlist(false);
                    showSnackbar('Product removed from wishlist', 'success');
                } else if (response.status === 401 || response.status === 403) {
                    showSnackbar('Authentication required. Please log in again.', 'error');
                    navigate('/login');
                } else {
                    throw new Error('Failed to remove from wishlist');
                }
            } else {
                // Add to wishlist
                const response = await fetch(`http://localhost:8080/api/wishlist/add`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: user.id,
                        productId: product?.id
                    })
                });

                if (response.ok) {
                    setIsInWishlist(true);
                    showSnackbar('Product added to wishlist', 'success');
                } else if (response.status === 401 || response.status === 403) {
                    showSnackbar('Authentication required. Please log in again.', 'error');
                    navigate('/login');
                } else {
                    throw new Error('Failed to add to wishlist');
                }
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
            showSnackbar(error instanceof Error ? error.message : 'Failed to update wishlist. Please try again.', 'error');
        }
    };

    const handleAccountClick = () => {
        if (!user) {
            navigate('/login');
        } else if (user.role === 'ADMIN') {
            navigate('/admin');
        } else {
            navigate('/user-data');
        }
    };

    const handleWishlistClick = () => {
        if (!user) {
            navigate('/login');
        } else {
            navigate('/wishlist');
        }
    };

    const handleCartClick = () => {
        if (!user) {
            navigate('/login');
        } else {
            navigate('/cart');
        }
    };

    const handleSearch = (value: string) => {
        if (value.trim()) {
            navigate(`/search?query=${encodeURIComponent(value.trim())}`);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            const target = event.target as HTMLInputElement;
            handleSearch(target.value);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress/>
            </Box>
        );
    }

    if (error || !product) {
        return (
            <Box textAlign="center" py={4}>
                <Typography variant="h5">
                    {error || 'Product not found'}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        }}>
            {/* Welcome Bar */}
            <TopAppBar position="static">
                <Toolbar>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 'bold',
                            background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                            fontSize: '1.2rem',
                            letterSpacing: '0.5px'
                        }}
                    >
                        Bine ai venit!
                    </Typography>
                    <Box sx={{flexGrow: 1}}/>
                    <Button
                        startIcon={
                            <AccountCircleIcon
                                sx={{
                                    fontSize: 28,
                                    background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    color: 'transparent',
                                }}
                            />
                        }
                        sx={{
                            '&:hover': {
                                transform: 'scale(1.05)',
                                transition: 'transform 0.2s ease',
                            },
                            fontWeight: 'bold',
                            background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                        }}
                        onClick={handleAccountClick}
                    >
                        Contul meu
                    </Button>
                </Toolbar>
            </TopAppBar>

            {/* Logo and Search Bar */}
            <TopAppBar position="static">
                <Toolbar>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer'
                        }}
                        onClick={() => navigate('/')}
                    >
                        <SportsSoccerIcon
                            sx={{
                                fontSize: 40,
                                mr: 2,
                                color: '#1976d2',
                                animation: 'spin 4s linear infinite',
                                '@keyframes spin': {
                                    '0%': {transform: 'rotate(0deg)'},
                                    '100%': {transform: 'rotate(360deg)'}
                                }
                            }}
                        />
                        <Box sx={{display: {xs: 'none', sm: 'flex'}, flexDirection: 'column', alignItems: 'center'}}>
                            <Typography variant="h6" sx={{
                                fontWeight: 'bold',
                                background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                color: 'transparent',
                            }}>
                                Romanian
                            </Typography>
                            <Typography variant="h6" sx={{
                                fontWeight: 'bold',
                                background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                color: 'transparent',
                            }}>
                                Football Shop
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{flexGrow: 1, display: 'flex', justifyContent: 'center'}}>
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon/>
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Cautare..."
                                inputProps={{'aria-label': 'search'}}
                                onKeyPress={handleKeyPress}
                                endAdornment={
                                    <Button
                                        onClick={() => {
                                            const input = document.querySelector('input[aria-label="search"]') as HTMLInputElement;
                                            handleSearch(input.value);
                                        }}
                                        sx={{
                                            height: '80%',
                                            m: 0.5,
                                            background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                                            color: 'white',
                                            padding: '8px 16px',
                                            borderRadius: '8px',
                                            textTransform: 'none',
                                            boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
                                            transition: 'transform 0.2s',
                                            '&:hover': {
                                                transform: 'scale(1.05)',
                                                background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                                            }
                                        }}
                                    >
                                        Cauta
                                    </Button>
                                }
                            />
                        </Search>
                    </Box>
                    <IconButton
                        onClick={handleWishlistClick}
                        sx={{
                            mr: 1,
                            '&:hover': {
                                transform: 'scale(1.15)',
                                transition: 'transform 0.2s ease',
                            }
                        }}
                    >
                        <FavoriteBorderIcon
                            sx={{
                                fontSize: 28,
                                background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                color: '#1976d2',
                            }}
                        />
                    </IconButton>
                    <IconButton
                        onClick={handleCartClick}
                        sx={{
                            '&:hover': {
                                transform: 'scale(1.15)',
                                transition: 'transform 0.2s ease',
                            }
                        }}
                    >
                        <ShoppingBagIcon
                            sx={{
                                fontSize: 28,
                                background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                color: '#1976d2',
                            }}
                        />
                    </IconButton>
                </Toolbar>
            </TopAppBar>

            {/* Product Content */}
            <Container maxWidth="lg" sx={{mt: 4, mb: 4}}>
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
                    <Grid container spacing={4}>
                        {/* Left column with main image and thumbnails */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            {/* Main selected image */}
                            <Paper
                                elevation={3}
                                sx={{
                                    mb: 2,
                                    overflow: 'hidden',
                                    borderRadius: 2,
                                    background: 'rgba(255, 255, 255, 0.95)',
                                }}
                            >
                                <img
                                    src={photos[selectedPhotoIndex]?.photoUrl}
                                    alt={`${product.name} - Main View`}
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        maxHeight: '600px',
                                        objectFit: 'contain'
                                    }}
                                />
                            </Paper>

                            {/* Thumbnails row */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 2,
                                    overflowX: 'auto',
                                    pb: 1
                                }}
                            >
                                {photos.map((photo, index) => (
                                    <Paper
                                        key={photo.id}
                                        elevation={2}
                                        sx={{
                                            border: index === selectedPhotoIndex ? '2px solid #1976d2' : '2px solid transparent',
                                            cursor: 'pointer',
                                            minWidth: '80px',
                                            maxWidth: '80px',
                                            height: '80px',
                                            overflow: 'hidden',
                                            borderRadius: 1,
                                            transition: 'transform 0.2s ease',
                                            '&:hover': {
                                                transform: 'scale(1.05)',
                                            }
                                        }}
                                        onClick={() => setSelectedPhotoIndex(index)}
                                    >
                                        <img
                                            src={photo.photoUrl}
                                            alt={`${product.name} - Thumbnail ${photo.displayOrder}`}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    </Paper>
                                ))}
                            </Box>
                        </Grid>

                        {/* Right column */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography
                                variant="h4"
                                sx={{
                                    mb: 2,
                                    fontWeight: 'bold',
                                    background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    color: 'transparent',
                                }}
                            >
                                {product.name}
                            </Typography>

                            <Typography
                                variant="h5"
                                sx={{
                                    mb: 2,
                                    color: '#1976d2',
                                    fontWeight: 'bold'
                                }}
                            >
                                ${product.price.toFixed(2)}
                            </Typography>

                            {/* Updated Team and License section */}
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 2}}>
                                <Typography variant="subtitle1">
                                    Team: {product.team}
                                </Typography>
                                {product.licenced && (
                                    <Tooltip
                                        title="Licensed Product"
                                        arrow
                                        placement="top"
                                    >
                                        <VerifiedIcon
                                            sx={{
                                                color: '#1976d2',
                                                cursor: 'help',
                                                transition: 'transform 0.2s ease',
                                                '&:hover': {
                                                    transform: 'scale(1.1)'
                                                }
                                            }}
                                        />
                                    </Tooltip>
                                )}
                            </Box>

                            <Typography variant="body1" paragraph sx={{mt: 2, mb: 3}}>
                                {product.description}
                            </Typography>

                            {/* Size Selection */}
                            <Box sx={{mb: 3}}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Size
                                </Typography>
                                <ToggleButtonGroup
                                    value={selectedSize}
                                    exclusive
                                    onChange={handleSizeChange}
                                    aria-label="size selection"
                                >
                                    {ALL_SIZES.map((size) => {
                                        const sizeData = availableSizes.find(s => s.size === size);
                                        const isAvailable = sizeData && sizeData.quantity > 0;

                                        return (
                                            <ToggleButton
                                                key={size}
                                                value={size}
                                                disabled={!isAvailable}
                                                sx={{
                                                    width: '60px',
                                                    position: 'relative',
                                                    '&.Mui-selected': {
                                                        backgroundColor: '#1976d2',
                                                        color: 'white',
                                                        '&:hover': {
                                                            backgroundColor: '#1565c0',
                                                        },
                                                    },
                                                    '&.Mui-disabled': {
                                                        color: 'text.disabled',
                                                        bgcolor: 'action.disabledBackground',
                                                        '&::after': {
                                                            content: '""',
                                                            position: 'absolute',
                                                            top: '50%',
                                                            left: 0,
                                                            right: 0,
                                                            height: '1px',
                                                            backgroundColor: 'text.disabled',
                                                            transform: 'rotate(-10deg)',
                                                        },
                                                    },
                                                }}
                                            >
                                                {size}
                                            </ToggleButton>
                                        );
                                    })}
                                </ToggleButtonGroup>
                            </Box>

                            {/* Name Input */}
                            <Box sx={{mb: 3}}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Name (optional)
                                </Typography>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    size="small"
                                />
                            </Box>

                            {/* Number Input */}
                            <Box sx={{mb: 3}}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Number (optional)
                                </Typography>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    value={number}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (!val || (parseInt(val) >= 0 && parseInt(val) <= 99)) {
                                            setNumber(val);
                                        }
                                    }}
                                    type="number"
                                    inputProps={{min: 0, max: 99}}
                                    size="small"
                                />
                            </Box>

                            {/* Quantity Selector */}
                            <Box sx={{mb: 3}}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Quantity
                                </Typography>
                                <OutlinedInput
                                    type="text"
                                    value={quantity}
                                    size="small"
                                    sx={{width: '120px'}}
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <IconButton
                                                onClick={() => handleQuantityChange(quantity - 1)}
                                                edge="start"
                                                size="small"
                                            >
                                                <RemoveIcon/>
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => handleQuantityChange(quantity + 1)}
                                                edge="end"
                                                size="small"
                                            >
                                                <AddIcon/>
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </Box>

                            {/* Action Buttons */}
                            <Box sx={{display: 'flex', gap: 2}}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    startIcon={<ShoppingBagIcon/>}
                                    sx={{
                                        flex: 1,
                                        background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                                        color: 'white',
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        textTransform: 'none',
                                        boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
                                        transition: 'transform 0.2s',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                                        }
                                    }}
                                    onClick={handleAddToCart}
                                >
                                    Add to Cart
                                </Button>
                                <IconButton
                                    sx={{
                                        border: 1,
                                        borderColor: 'divider',
                                        width: 48,
                                        height: 48,
                                        '&:hover': {
                                            transform: 'scale(1.15)',
                                            transition: 'transform 0.2s ease',
                                        }
                                    }}
                                    onClick={toggleWishlist}
                                >
                                    {isInWishlist ? (
                                        <FavoriteIcon sx={{color: 'red'}}/>
                                    ) : (
                                        <FavoriteBorderIcon/>
                                    )}
                                </IconButton>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>

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
        </Box>
    );
}

export default ProductDetail;