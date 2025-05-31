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
    useTheme,
} from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import EmailIcon from '@mui/icons-material/Email';
import LoginIcon from '@mui/icons-material/Login';
import LockResetIcon from '@mui/icons-material/LockReset';
import { useNavigate } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setStatus({
            type: 'success',
            message: 'If an account exists with this email, you will receive password reset instructions.'
        });
        setEmail('');
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

                    {/* Reset Password Form */}
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
                            <LockResetIcon sx={{ fontSize: 32, color: theme.palette.primary.main, mr: 1 }} />
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 600,
                                    color: theme.palette.primary.main
                                }}
                            >
                                Reset Password
                            </Typography>
                        </Box>

                        <Typography
                            variant="body1"
                            sx={{
                                mb: 4,
                                textAlign: 'center',
                                color: 'text.secondary',
                                px: 2
                            }}
                        >
                            Enter your email address and we'll send you instructions to reset your password.
                        </Typography>

                        {status && (
                            <Alert
                                severity={status.type}
                                sx={{
                                    mb: 3,
                                    borderRadius: 2,
                                    '& .MuiAlert-icon': {
                                        fontSize: '1.5rem'
                                    }
                                }}
                            >
                                {status.message}
                            </Alert>
                        )}

                        <Box component="form" onSubmit={handleSubmit}>
                            <Box sx={{ mb: 4 }}>
                                <TextField
                                    fullWidth
                                    required
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    autoComplete="email"
                                    autoFocus
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                startIcon={<LockResetIcon />}
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
                                Send Reset Instructions
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
                                Back to Login
                            </Button>
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </Box>
    );
};

export default ForgotPassword;