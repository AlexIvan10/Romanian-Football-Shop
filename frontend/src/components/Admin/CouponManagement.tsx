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
    Switch,
    AlertColor,
    Card,
    CardContent,
    Chip,
    Avatar,
    Tooltip,
    Fade,
    Grid,
    Badge,
    FormHelperText,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import DiscountIcon from '@mui/icons-material/Discount';
import PercentIcon from '@mui/icons-material/Percent';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import {useAuth} from '../../utils/AuthContext';
import {useNavigate} from 'react-router-dom';

interface Discount {
    id: number;
    code: string;
    discountPercentage: number;
    active: boolean;
}

interface FormData {
    code: string;
    discountPercentage: string;
    active: boolean;
}

interface SnackbarState {
    open: boolean;
    message: string;
    severity: AlertColor;
}

const CouponManagement: React.FC = () => {
    const {user} = useAuth();
    const navigate = useNavigate();
    const [discounts, setDiscounts] = useState<Discount[]>([]);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null);
    const [formData, setFormData] = useState<FormData>({
        code: '',
        discountPercentage: '',
        active: true
    });
    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: '',
        severity: 'success'
    });
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (!user || user.role !== 'ADMIN') {
            navigate('/');
            return;
        }
        fetchDiscounts();
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

    const fetchDiscounts = async (): Promise<void> => {
        try {
            const response = await fetch('http://localhost:8080/api/discount', {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setDiscounts(data);
            } else if (response.status === 401 || response.status === 403) {
                showSnackbar('Unauthorized. Please make sure you have admin privileges.', 'error');
                navigate('/login');
            } else {
                throw new Error('Failed to fetch discounts');
            }
        } catch (error) {
            showSnackbar('Failed to fetch discounts', 'error');
        }
    };

    const validateForm = (): boolean => {
        const errors: { [key: string]: string } = {};

        if (!formData.code.trim()) {
            errors.code = 'Coupon code is required';
        }

        if (!formData.discountPercentage.trim()) {
            errors.discountPercentage = 'Discount percentage is required';
        } else {
            const percentage = parseInt(formData.discountPercentage);
            if (isNaN(percentage) || percentage < 0 || percentage > 100) {
                errors.discountPercentage = 'Discount percentage must be between 0 and 100';
            }
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

        const url = 'http://localhost:8080/api/discount';
        const method = isEditing ? 'PUT' : 'POST';
        const endpoint = isEditing && selectedDiscount ? `${url}/${selectedDiscount.id}` : url;

        try {
            const discountData = {
                ...formData,
                discountPercentage: parseInt(formData.discountPercentage),
                active: isEditing ? selectedDiscount?.active : true
            };

            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(discountData)
            });

            if (await handleApiResponse(response, `Coupon ${isEditing ? 'updated' : 'created'} successfully`)) {
                fetchDiscounts();
                handleCloseDialog();
            }
        } catch (error) {
            showSnackbar((error as Error).message, 'error');
        }
    };

    const handleEdit = (discount: Discount): void => {
        setSelectedDiscount(discount);
        setFormData({
            code: discount.code,
            discountPercentage: discount.discountPercentage.toString(),
            active: discount.active
        });
        setIsEditing(true);
        setFormErrors({});
        setOpenDialog(true);
    };

    const handleDelete = async (id: number): Promise<void> => {
        if (!window.confirm('Are you sure you want to delete this coupon?')) return;

        try {
            const response = await fetch(`http://localhost:8080/api/discount/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (await handleApiResponse(response, 'Coupon deleted successfully')) {
                fetchDiscounts();
            }
        } catch (error) {
            showSnackbar((error as Error).message, 'error');
        }
    };

    const handleToggleActive = async (discount: Discount): Promise<void> => {
        try {
            const discountUpdate = {
                id: discount.id,
                code: discount.code,
                discountPercentage: discount.discountPercentage,
                active: !discount.active
            };

            const response = await fetch(`http://localhost:8080/api/discount/${discount.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(discountUpdate)
            });

            if (await handleApiResponse(response, `Coupon ${!discount.active ? 'activated' : 'deactivated'} successfully`)) {
                fetchDiscounts();
            }
        } catch (error) {
            showSnackbar((error as Error).message, 'error');
        }
    };

    const handleOpenDialog = (): void => {
        setFormData({
            code: '',
            discountPercentage: '',
            active: true
        });
        setIsEditing(false);
        setFormErrors({});
        setOpenDialog(true);
    };

    const handleCloseDialog = (): void => {
        setOpenDialog(false);
        setSelectedDiscount(null);
        setFormData({
            code: '',
            discountPercentage: '',
            active: true
        });
        setFormErrors({});
    };

    if (!user || user.role !== 'ADMIN') {
        return null;
    }

    // Calculate statistics
    const totalCoupons = discounts.length;
    const activeCoupons = discounts.filter(d => d.active).length;
    const inactiveCoupons = discounts.filter(d => !d.active).length;

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
                            label="Coupon Management"
                            icon={<LocalOfferIcon/>}
                            sx={{
                                background: 'linear-gradient(45deg, #9c27b0, #ba68c8)',
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
                                background: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
                                boxShadow: '0 8px 24px rgba(156, 39, 176, 0.3)',
                            }}>
                                <DiscountIcon sx={{
                                    fontSize: 40,
                                    color: 'white'
                                }}/>
                            </Box>
                            <Box>
                                <Typography
                                    variant="h3"
                                    sx={{
                                        fontWeight: 800,
                                        background: 'linear-gradient(45deg, #9c27b0, #ba68c8)',
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        color: 'transparent',
                                        mb: 0.5,
                                    }}
                                >
                                    Coupon Management
                                </Typography>
                                <Typography variant="h6" color="text.secondary" sx={{fontWeight: 400}}>
                                    Create and manage discount coupons for your store
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
                                background: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
                                boxShadow: '0 6px 20px rgba(156, 39, 176, 0.3)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #8e24aa 0%, #ab47bc 100%)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 25px rgba(156, 39, 176, 0.4)',
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            Create New Coupon
                        </Button>
                    </Box>
                </Paper>

                {/* Statistics Cards */}
                <Grid container spacing={3} sx={{mb: 4}}>
                    <Grid size={{xs: 12, md: 4}}>
                        <Card sx={{
                            background: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
                            color: 'white',
                            borderRadius: 3,
                            height: '100%'
                        }}>
                            <CardContent sx={{p: 3}}>
                                <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <Box>
                                        <Typography variant="h4" sx={{fontWeight: 'bold', mb: 1}}>
                                            {totalCoupons}
                                        </Typography>
                                        <Typography variant="body1" sx={{opacity: 0.9}}>
                                            Total Coupons
                                        </Typography>
                                    </Box>
                                    <Avatar sx={{bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56}}>
                                        <LocalOfferIcon sx={{fontSize: 30}}/>
                                    </Avatar>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{xs: 12, md: 4}}>
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
                                            {activeCoupons}
                                        </Typography>
                                        <Typography variant="body1" sx={{opacity: 0.9}}>
                                            Active Coupons
                                        </Typography>
                                    </Box>
                                    <Avatar sx={{bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56}}>
                                        <CheckCircleIcon sx={{fontSize: 30}}/>
                                    </Avatar>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{xs: 12, md: 4}}>
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
                                            {inactiveCoupons}
                                        </Typography>
                                        <Typography variant="body1" sx={{opacity: 0.9}}>
                                            Inactive Coupons
                                        </Typography>
                                    </Box>
                                    <Avatar sx={{bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56}}>
                                        <CancelIcon sx={{fontSize: 30}}/>
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
                        background: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
                        p: 3,
                        color: 'white'
                    }}>
                        <Typography variant="h5" sx={{fontWeight: 600, display: 'flex', alignItems: 'center', gap: 2}}>
                            <LocalOfferIcon/>
                            Coupon Management Table
                        </Typography>
                        <Typography variant="body2" sx={{opacity: 0.9, mt: 1}}>
                            View and manage all discount coupons in the system
                        </Typography>
                    </Box>

                    <TableContainer sx={{maxHeight: 600}}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{
                                        background: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: '1rem'
                                    }}>
                                        Coupon ID
                                    </TableCell>
                                    <TableCell sx={{
                                        background: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: '1rem'
                                    }}>
                                        Coupon Code
                                    </TableCell>
                                    <TableCell sx={{
                                        background: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: '1rem'
                                    }}>
                                        Discount
                                    </TableCell>
                                    <TableCell sx={{
                                        background: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: '1rem'
                                    }}>
                                        Status
                                    </TableCell>
                                    <TableCell align="center" sx={{
                                        background: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: '1rem'
                                    }}>
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {discounts.map((discount, index) => (
                                    <Fade in timeout={300 + index * 100} key={discount.id}>
                                        <TableRow
                                            sx={{
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(156, 39, 176, 0.08)',
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
                                                        background: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
                                                        fontSize: '0.9rem',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        #{discount.id}
                                                    </Avatar>
                                                    <Typography variant="body1" sx={{fontWeight: 600}}>
                                                        {discount.id}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                                                    <LocalOfferIcon sx={{color: 'text.secondary', fontSize: 20}}/>
                                                    <Typography variant="body1"
                                                                sx={{fontWeight: 600, fontFamily: 'monospace'}}>
                                                        {discount.code}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                                    <PercentIcon sx={{color: '#9c27b0', fontSize: 20}}/>
                                                    <Typography variant="h6"
                                                                sx={{color: '#9c27b0', fontWeight: 'bold'}}>
                                                        {discount.discountPercentage}%
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    icon={discount.active ? <CheckCircleIcon/> : <CancelIcon/>}
                                                    label={discount.active ? 'Active' : 'Inactive'}
                                                    sx={{
                                                        background: discount.active
                                                            ? 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)'
                                                            : 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)',
                                                        color: 'white',
                                                        fontWeight: 'bold',
                                                        px: 2,
                                                        minWidth: 100,
                                                        '& .MuiChip-icon': {
                                                            color: 'white'
                                                        }
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Box sx={{display: 'flex', gap: 1, justifyContent: 'center'}}>
                                                    <Tooltip
                                                        title={`${discount.active ? 'Deactivate' : 'Activate'} coupon`}>
                                                        <IconButton
                                                            onClick={() => handleToggleActive(discount)}
                                                            sx={{
                                                                background: discount.active
                                                                    ? 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)'
                                                                    : 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
                                                                color: 'white',
                                                                '&:hover': {
                                                                    background: discount.active
                                                                        ? 'linear-gradient(135deg, #c62828 0%, #e53935 100%)'
                                                                        : 'linear-gradient(135deg, #1b5e20 0%, #4caf50 100%)',
                                                                    transform: 'scale(1.1)',
                                                                },
                                                                transition: 'all 0.2s ease'
                                                            }}
                                                        >
                                                            <PowerSettingsNewIcon/>
                                                        </IconButton>
                                                    </Tooltip>

                                                    <Tooltip title="Edit coupon">
                                                        <IconButton
                                                            onClick={() => handleEdit(discount)}
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

                                                    <Tooltip title="Delete coupon">
                                                        <IconButton
                                                            onClick={() => handleDelete(discount.id)}
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
                        background: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
                        color: 'white',
                        py: 3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                    }}>
                        {isEditing ? <EditIcon/> : <AddIcon/>}
                        {isEditing ? 'Edit Coupon' : 'Create New Coupon'}
                    </DialogTitle>
                    <DialogContent sx={{mt: 3, pb: 2}}>
                        <Box sx={{mb: 2}}>
                            <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
                                {isEditing
                                    ? `Update the coupon details for coupon ID: ${selectedDiscount?.id}`
                                    : 'Create a new discount coupon for your customers'
                                }
                            </Typography>
                        </Box>
                        <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
                            <TextField
                                fullWidth
                                label="Coupon Code"
                                name="code"
                                value={formData.code}
                                onChange={handleInputChange}
                                required
                                autoFocus
                                error={!!formErrors.code}
                                helperText={formErrors.code}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#9c27b0',
                                            borderWidth: 2,
                                        }
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: '#9c27b0',
                                    }
                                }}
                                InputProps={{
                                    startAdornment: <LocalOfferIcon sx={{mr: 1, color: 'text.secondary'}}/>
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Discount Percentage"
                                name="discountPercentage"
                                type="number"
                                value={formData.discountPercentage}
                                onChange={handleInputChange}
                                required
                                error={!!formErrors.discountPercentage}
                                helperText={formErrors.discountPercentage || 'Enter a value between 0 and 100'}
                                inputProps={{min: "0", max: "100"}}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#9c27b0',
                                            borderWidth: 2,
                                        }
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: '#9c27b0',
                                    }
                                }}
                                InputProps={{
                                    startAdornment: <PercentIcon sx={{mr: 1, color: 'text.secondary'}}/>
                                }}
                            />
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
                                background: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
                                boxShadow: '0 6px 20px rgba(156, 39, 176, 0.3)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #8e24aa 0%, #ab47bc 100%)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 25px rgba(156, 39, 176, 0.4)',
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {isEditing ? 'Update Coupon' : 'Create Coupon'}
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

export default CouponManagement;