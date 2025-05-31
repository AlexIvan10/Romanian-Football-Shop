import React, {useState, useEffect, JSX} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../../utils/AuthContext';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    InputBase,
    Paper,
    Container,
    Grid,
    Card,
    CardContent,
    CardMedia,
    IconButton,
    Box,
    CircularProgress,
    ButtonGroup,
    Chip
} from '@mui/material';
import {styled} from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import FilterListIcon from '@mui/icons-material/FilterList';

// Define interfaces
interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    team: string;
    photoUrl: string;
    licenced: boolean;
}

type SortType = 'none' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc';

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

const NavButton = styled(Button)(({theme}) => ({
    background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
    color: 'white',
    padding: '10px 20px',
    margin: '0 10px',
    borderRadius: '8px',
    textTransform: 'none',
    boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
    transition: 'transform 0.2s',
    '&:hover': {
        transform: 'scale(1.05)',
        background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
    }
}));

const ActiveNavButton = styled(NavButton)(({theme}) => ({
    background: 'linear-gradient(45deg, #115293 30%, #1976d2 90%)',
    boxShadow: '0 3px 5px 2px rgba(17, 82, 147, .3)',
    transform: 'scale(1.05)',
    '&:hover': {
        transform: 'scale(1.05)',
        background: 'linear-gradient(45deg, #115293 30%, #1976d2 90%)',
    }
}));

const FilterButton = styled(Button)(({theme}) => ({
    borderRadius: '8px',
    textTransform: 'none',
    padding: '8px 16px',
    margin: '0 4px',
    transition: 'all 0.2s ease',
    border: '1px solid #e0e0e0',
    backgroundColor: 'white',
    color: '#666',
    '&:hover': {
        backgroundColor: '#f5f5f5',
        borderColor: '#1976d2',
        transform: 'translateY(-2px)',
    }
}));

const ActiveFilterButton = styled(FilterButton)(({theme}) => ({
    background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
    color: 'white',
    borderColor: '#1976d2',
    boxShadow: '0 3px 10px rgba(25, 118, 210, 0.3)',
    '&:hover': {
        background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
        transform: 'translateY(-2px)',
    }
}));

function AllProducts(): JSX.Element {
    const navigate = useNavigate();
    const {user} = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchValue, setSearchValue] = useState('');
    const [sortType, setSortType] = useState<SortType>('none');

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        sortProducts();
    }, [products, sortType]);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/product');
            if (!response.ok) throw new Error('Failed to fetch products');
            const data = await response.json();
            setProducts(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const sortProducts = () => {
        let sorted = [...products];

        switch (sortType) {
            case 'name-asc':
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                sorted.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'price-asc':
                sorted.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                sorted.sort((a, b) => b.price - a.price);
                break;
            default:
                // Keep original order
                break;
        }

        setFilteredProducts(sorted);
    };

    const handleSortChange = (newSortType: SortType) => {
        setSortType(newSortType);
    };

    const getSortButtonProps = (buttonSortType: SortType) => ({
        component: sortType === buttonSortType ? ActiveFilterButton : FilterButton,
        onClick: () => handleSortChange(buttonSortType)
    });

    const getSortLabel = () => {
        switch (sortType) {
            case 'name-asc': return 'Name A-Z';
            case 'name-desc': return 'Name Z-A';
            case 'price-asc': return 'Price Low-High';
            case 'price-desc': return 'Price High-Low';
            default: return 'Default';
        }
    };

    const handleSearch = () => {
        if (searchValue.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchValue.trim())}`);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleSearch();
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
                        Welcome!
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
                        My Account
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
                                placeholder="Searching..."
                                value={searchValue}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                inputProps={{'aria-label': 'search'}}
                                endAdornment={
                                    <Button
                                        onClick={handleSearch}
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
                                        Search
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

            {/* Navigation Buttons */}
            <Paper
                elevation={0}
                sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                }}
            >
                <Container>
                    <Box sx={{display: 'flex', justifyContent: 'center', py: 1, gap: 1}}>
                        <ActiveNavButton>
                            All products
                        </ActiveNavButton>
                        <NavButton onClick={() => navigate('/logistics')}>
                            Logistics policy
                        </NavButton>
                        <NavButton onClick={() => navigate('/payment')}>
                            About Payment
                        </NavButton>
                        <NavButton onClick={() => navigate('/contact')}>
                            Contact
                        </NavButton>
                    </Box>
                </Container>
            </Paper>

            {/* Products Section */}
            <Container sx={{mt: 4, mb: 4}}>
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
                        variant="h5"
                        sx={{
                            mb: 3,
                            fontWeight: 'bold',
                            textAlign: 'center',
                            background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                        }}
                    >
                        All products
                    </Typography>

                    {/* Filter Controls */}
                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 3,
                        gap: 2
                    }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            flexWrap: 'wrap',
                            justifyContent: 'center'
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <FilterListIcon sx={{ color: '#1976d2' }} />
                                <Typography variant="h6" sx={{
                                    fontWeight: 'bold',
                                    color: '#1976d2'
                                }}>
                                    Sort by:
                                </Typography>
                            </Box>

                            <ButtonGroup variant="outlined" size="small">
                                <Button
                                    {...getSortButtonProps('none')}
                                    startIcon={<FilterListIcon />}
                                >
                                    Default
                                </Button>
                                <Button
                                    {...getSortButtonProps('name-asc')}
                                >
                                    A-Z
                                </Button>
                                <Button
                                    {...getSortButtonProps('name-desc')}
                                >
                                    Z-A
                                </Button>
                                <Button
                                    {...getSortButtonProps('price-asc')}
                                    startIcon={<><ArrowUpwardIcon sx={{ fontSize: 16 }} /></>}
                                >
                                    Price
                                </Button>
                                <Button
                                    {...getSortButtonProps('price-desc')}
                                    startIcon={<><ArrowDownwardIcon sx={{ fontSize: 16 }} /></>}
                                >
                                    Price
                                </Button>
                            </ButtonGroup>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                                Showing {filteredProducts.length} products
                            </Typography>
                            <Chip
                                label={getSortLabel()}
                                size="small"
                                color="primary"
                                variant="outlined"
                            />
                        </Box>
                    </Box>

                    {loading ? (
                        <Box display="flex" justifyContent="center" my={4}>
                            <CircularProgress/>
                        </Box>
                    ) : error ? (
                        <Typography color="error" textAlign="center">
                            {error}
                        </Typography>
                    ) : (
                        <Grid container spacing={3}>
                            {filteredProducts.map((product) => (
                                <Grid size = {{xs: 12, sm: 6, md: 3}} key={product.id}>
                                    <Card
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            background: 'rgba(255, 255, 255, 0.95)',
                                            backdropFilter: 'blur(10px)',
                                            transition: 'transform 0.2s ease',
                                            '&:hover': {
                                                transform: 'scale(1.03)',
                                                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                                            },
                                        }}
                                        onClick={() => navigate(`/product/${product.id}`)}
                                    >
                                        <CardMedia
                                            component="img"
                                            image={product.photoUrl}
                                            alt={product.name}
                                            sx={{height: 350, objectFit: 'contain'}}
                                        />
                                        <CardContent>
                                            <Typography variant="body1" align="center" gutterBottom>
                                                {product.name}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                align="center"
                                                color="text.secondary"
                                                gutterBottom
                                            >
                                                {product.team}
                                            </Typography>
                                            <Typography
                                                variant="h6"
                                                align="center"
                                                sx={{
                                                    background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                                                    backgroundClip: 'text',
                                                    WebkitBackgroundClip: 'text',
                                                    color: 'transparent',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                ${product.price.toFixed(2)}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Paper>
            </Container>
        </Box>
    );
}

export default AllProducts;