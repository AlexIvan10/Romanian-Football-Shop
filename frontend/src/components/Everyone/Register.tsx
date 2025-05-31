import React, { useState } from 'react';
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
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [error, setError] = useState<string>('');
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        repeatPassword: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return;
        }

        if (formData.password !== formData.repeatPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    role: 'USER'
                }),
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData);
            }

            navigate('/login');
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Registration failed');
            console.error('Registration error:', error);
        }
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
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    {/* Logo Section */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            mb: 4,
                            cursor: 'pointer',
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                                transform: 'scale(1.05)'
                            }
                        }}
                        onClick={() => navigate('/')}
                    >
                        <SportsSoccerIcon
                            sx={{
                                fontSize: 48,
                                color: '#1976d2',
                                animation: 'spin 4s linear infinite',
                                '@keyframes spin': {
                                    '0%': { transform: 'rotate(0deg)' },
                                    '100%': { transform: 'rotate(360deg)' }
                                }
                            }}
                        />
                        <Box>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 'bold',
                                    background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    color: 'transparent',
                                }}
                            >
                                Romanian Football Store
                            </Typography>
                        </Box>
                    </Box>

                    {/* Registration Form */}
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
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                            <PersonAddIcon sx={{ fontSize: 32, color: theme.palette.primary.main, mr: 1 }} />
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 600,
                                    color: theme.palette.primary.main
                                }}
                            >
                                Create Account
                            </Typography>
                        </Box>

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

                        <Box component="form" onSubmit={handleSubmit}>
                            <Box sx={{ mb: 3 }}>
                                <TextField
                                    fullWidth
                                    required
                                    id="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    type="email"
                                    autoComplete="email"
                                    autoFocus
                                    value={formData.email}
                                    onChange={handleChange}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailIcon sx={{ color: theme.palette.primary.main }} />
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

                            <Box sx={{ mb: 3 }}>
                                <TextField
                                    fullWidth
                                    required
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon sx={{ color: theme.palette.primary.main }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
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

                            <Box sx={{ mb: 4 }}>
                                <TextField
                                    fullWidth
                                    required
                                    name="repeatPassword"
                                    type={showRepeatPassword ? 'text' : 'password'}
                                    id="repeatPassword"
                                    placeholder="Repeat your password"
                                    value={formData.repeatPassword}
                                    onChange={handleChange}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon sx={{ color: theme.palette.primary.main }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                                                    edge="end"
                                                >
                                                    {showRepeatPassword ? <VisibilityOff /> : <Visibility />}
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
                                startIcon={<PersonAddIcon />}
                                sx={{
                                    py: 1.5,
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
                                Create Account
                            </Button>

                            <Button
                                fullWidth
                                startIcon={<LoginIcon />}
                                sx={{
                                    mt: 2,
                                    py: 1.5,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    color: theme.palette.primary.main,
                                    '&:hover': {
                                        backgroundColor: 'rgba(25, 118, 210, 0.04)',
                                    },
                                }}
                                onClick={() => navigate('/login')}
                            >
                                Already have an account? Login
                            </Button>
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </Box>
    );
};

export default Register;