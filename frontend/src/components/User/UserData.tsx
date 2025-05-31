import React, {useState} from 'react';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Alert,
    InputAdornment,
    IconButton,
    useTheme,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {useAuth} from '../../utils/AuthContext';
import {useNavigate} from 'react-router-dom';

const UserData: React.FC = () => {
    const {user, logout} = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        repeatPassword: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
        setSuccess('');
    };

    const handlePasswordChange = async (event: React.FormEvent) => {
        event.preventDefault();

        if (formData.newPassword !== formData.repeatPassword) {
            setError('New passwords do not match');
            return;
        }

        if (formData.newPassword.length < 6) {
            setError('New password must be at least 6 characters long');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/user', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // Remove the Authorization header - session handles auth
                },
                credentials: 'include',  // This handles authentication via session
                body: JSON.stringify({
                    email: user?.email,
                    password: formData.newPassword
                })
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    setError('Current password is incorrect or session expired');
                    // Optionally redirect to login
                    // navigate('/login');
                    return;
                }
                const errorData = await response.text();
                throw new Error(errorData);
            }

            setSuccess('Password changed successfully');
            setFormData({
                currentPassword: '',
                newPassword: '',
                repeatPassword: ''
            });
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Password change failed');
            console.error('Password change error:', error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleGoBack = () => {
        navigate('/');
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                py: 8,
            }}
        >
            <Container component="main" maxWidth="sm">
                <Paper
                    elevation={24}
                    sx={{
                        p: 4,
                        width: '100%',
                        borderRadius: 3,
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
                    }}
                >
                    {/* Back Button */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                        <Button
                            startIcon={<ArrowBackIcon />}
                            onClick={handleGoBack}
                            variant="outlined"
                            sx={{
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600,
                                px: 3,
                                py: 1,
                                borderColor: theme.palette.primary.main,
                                color: theme.palette.primary.main,
                                '&:hover': {
                                    backgroundColor: theme.palette.primary.main,
                                    color: 'white',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            Back
                        </Button>
                    </Box>

                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3}}>
                        <AccountCircleIcon sx={{fontSize: 32, color: theme.palette.primary.main, mr: 1}}/>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 600,
                                color: theme.palette.primary.main
                            }}
                        >
                            User Profile
                        </Typography>
                    </Box>

                    <Typography variant="h6" sx={{mb: 3, textAlign: 'center'}}>
                        Email: {user?.email}
                    </Typography>

                    {error && (
                        <Alert
                            severity="error"
                            sx={{
                                mb: 3,
                                borderRadius: 2,
                                '& .MuiAlert-icon': {
                                    fontSize: '1.5rem'
                                }
                            }}
                        >
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert
                            severity="success"
                            sx={{
                                mb: 3,
                                borderRadius: 2,
                                '& .MuiAlert-icon': {
                                    fontSize: '1.5rem'
                                }
                            }}
                        >
                            {success}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handlePasswordChange}>
                        <Box sx={{mb: 3}}>
                            <TextField
                                fullWidth
                                required
                                name="currentPassword"
                                type={showCurrentPassword ? 'text' : 'password'}
                                placeholder="Enter current password"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockIcon sx={{color: theme.palette.primary.main}}/>
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                edge="end"
                                            >
                                                {showCurrentPassword ? <VisibilityOff/> : <Visibility/>}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        '&:hover fieldset': {
                                            borderColor: theme.palette.primary.main,
                                        },
                                    },
                                }}
                            />
                        </Box>

                        <Box sx={{mb: 3}}>
                            <TextField
                                fullWidth
                                required
                                name="newPassword"
                                type={showNewPassword ? 'text' : 'password'}
                                placeholder="Enter new password"
                                value={formData.newPassword}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockIcon sx={{color: theme.palette.primary.main}}/>
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                edge="end"
                                            >
                                                {showNewPassword ? <VisibilityOff/> : <Visibility/>}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        '&:hover fieldset': {
                                            borderColor: theme.palette.primary.main,
                                        },
                                    },
                                }}
                            />
                        </Box>

                        <Box sx={{mb: 4}}>
                            <TextField
                                fullWidth
                                required
                                name="repeatPassword"
                                type={showRepeatPassword ? 'text' : 'password'}
                                placeholder="Repeat new password"
                                value={formData.repeatPassword}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockIcon sx={{color: theme.palette.primary.main}}/>
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                                                edge="end"
                                            >
                                                {showRepeatPassword ? <VisibilityOff/> : <Visibility/>}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        '&:hover fieldset': {
                                            borderColor: theme.palette.primary.main,
                                        },
                                    },
                                }}
                            />
                        </Box>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                py: 1.5,
                                mb: 2,
                                borderRadius: 2,
                                textTransform: 'none',
                                background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                                boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                },
                            }}
                        >
                            Change Password
                        </Button>

                        <Button
                            fullWidth
                            variant="contained"
                            startIcon={<ShoppingCartIcon/>}
                            onClick={() => navigate('/user-orders')}
                            sx={{
                                py: 1.5,
                                mb: 2,
                                borderRadius: 2,
                                textTransform: 'none',
                                background: 'linear-gradient(45deg, #2e7d32 30%, #66bb6a 90%)',
                                boxShadow: '0 3px 5px 2px rgba(46, 125, 50, .3)',
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                },
                            }}
                        >
                            View My Orders
                        </Button>

                        <Button
                            fullWidth
                            variant="outlined"
                            color="error"
                            startIcon={<LogoutIcon/>}
                            onClick={handleLogout}
                            sx={{
                                py: 1.5,
                                borderRadius: 2,
                                textTransform: 'none',
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                },
                            }}
                        >
                            Logout
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default UserData;