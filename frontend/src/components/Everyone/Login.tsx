import React, {useState} from 'react';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Divider,
    IconButton,
    InputAdornment,
    useTheme,
} from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../../utils/AuthContext';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const {login} = useAuth();
    const theme = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

     const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        try {
            await login(email, password);

            const response = await fetch('http://localhost:8080/api/auth/status', {
                credentials: 'include'
            });

            if (response.ok) {
                const userData = await response.json();
                // Redirect based on user role
                if (userData.role === 'ADMIN') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            } else {
                // Fallback to home page if we can't get user data
                navigate('/');
            }
        } catch (error) {
            // Clean up the error message
            let errorMessage = 'Invalid email or password';
            if (error instanceof Error) {
                const cleanedMessage = error.message.replace(/^(Login failed: |Error: )/, '');
                // Map backend error messages to user-friendly messages
                if (cleanedMessage.toLowerCase().includes('bad credentials') ||
                    cleanedMessage.toLowerCase().includes('invalid') ||
                    cleanedMessage.toLowerCase().includes('unauthorized')) {
                    errorMessage = 'Invalid email or password';
                } else {
                    errorMessage = cleanedMessage;
                }
            }
            setError(errorMessage);
            console.error('Login failed:', error);
        } finally {
            setLoading(false);
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
                                    '0%': {transform: 'rotate(0deg)'},
                                    '100%': {transform: 'rotate(360deg)'}
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

                    {/* Login Form */}
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
                        <Typography
                            variant="h5"
                            align="center"
                            sx={{
                                mb: 4,
                                fontWeight: 600,
                                color: theme.palette.primary.main
                            }}
                        >
                            Welcome Back
                        </Typography>

                        <Box component="form" onSubmit={handleLogin}>
                            {error && (
                                <Typography
                                    color="error"
                                    sx={{
                                        mb: 2,
                                        p: 1.5,
                                        bgcolor: 'rgba(211, 47, 47, 0.1)',
                                        borderRadius: 1,
                                        textAlign: 'center'
                                    }}
                                >
                                    {error}
                                </Typography>
                            )}

                            <Box sx={{mb: 3}}>
                                <TextField
                                    fullWidth
                                    required
                                    id="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    autoComplete="email"
                                    autoFocus
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailIcon sx={{color: theme.palette.primary.main}}/>
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
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon sx={{color: theme.palette.primary.main}}/>
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff/> : <Visibility/>}
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

                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mt: 3
                            }}>
                                <Button
                                    startIcon={<HelpOutlineIcon/>}
                                    onClick={() => navigate('/forgot-password')}
                                    sx={{
                                        textTransform: 'none',
                                        '&:hover': {
                                            backgroundColor: 'rgba(25, 118, 210, 0.04)',
                                        },
                                    }}
                                >
                                    Forgot password?
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{
                                        width: '120px',
                                        textTransform: 'none',
                                        borderRadius: 2,
                                        py: 1.5,
                                        background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                                        boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
                                        transition: 'transform 0.2s',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                        },
                                    }}
                                >
                                    Login
                                </Button>
                            </Box>

                            <Box sx={{mt: 4, textAlign: 'center'}}>
                                <Divider sx={{
                                    my: 2,
                                    '&::before, &::after': {
                                        borderColor: 'rgba(0, 0, 0, 0.1)',
                                    },
                                }}>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: 'text.secondary',
                                            px: 2,
                                            bgcolor: 'transparent'
                                        }}
                                    >
                                        New to Romanian Football Store?
                                    </Typography>
                                </Divider>

                                <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<PersonAddIcon/>}
                                    sx={{
                                        textTransform: 'none',
                                        mt: 2,
                                        borderRadius: 2,
                                        py: 1.5,
                                        borderWidth: 2,
                                        '&:hover': {
                                            borderWidth: 2,
                                            bgcolor: 'rgba(25, 118, 210, 0.04)',
                                        },
                                    }}
                                    onClick={() => navigate('/register')}
                                >
                                    Create Account
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </Box>
    );
};

export default Login;