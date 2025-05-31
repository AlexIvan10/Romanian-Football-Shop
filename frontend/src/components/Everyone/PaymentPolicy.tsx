import React, {JSX} from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Button,
    Box,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Card,
    CardContent,
    Divider,
    useTheme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PaymentIcon from '@mui/icons-material/Payment';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SecurityIcon from '@mui/icons-material/Security';
import ReceiptIcon from '@mui/icons-material/Receipt';
import EuroIcon from '@mui/icons-material/Euro';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';

function PaymentPolicy(): JSX.Element {
    const navigate = useNavigate();
    const theme = useTheme();

    const paymentMethods = [
        {
            icon: <CreditCardIcon />,
            text: 'Credit/debit cards (Visa, Mastercard, Maestro, etc.)'
        },
        {
            icon: <AccountBalanceIcon />,
            text: 'Payment by bank transfer - Bank account details will be provided when placing the order'
        },
        {
            icon: <LocalShippingIcon />,
            text: 'Cash on delivery - You can pay the order directly to the courier upon delivery'
        }
    ];

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            py: 8,
        }}>
            <Container maxWidth="md">
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mb: 4
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

                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/')}
                        variant="contained"
                        sx={{
                            mb: 3,
                            py: 1.5,
                            px: 4,
                            borderRadius: 2,
                            textTransform: 'none',
                            background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                            boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
                            transition: 'transform 0.2s',
                            '&:hover': {
                                transform: 'scale(1.05)',
                                background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                            }
                        }}
                    >
                        Back to main page
                    </Button>
                </Box>

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
                        variant="h3"
                        component="h1"
                        gutterBottom
                        align="center"
                        sx={{
                            mb: 6,
                            fontWeight: 700,
                            background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                        }}
                    >
                        Payment Policy
                    </Typography>

                    {/* Payment Methods Section */}
                    <Card sx={{ mb: 4, boxShadow: 3 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <PaymentIcon sx={{ fontSize: 40, color: '#1976d2', mr: 2 }} />
                                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                    Accepted Payment Methods
                                </Typography>
                            </Box>
                            <List>
                                {paymentMethods.map((method, index) => (
                                    <ListItem
                                        key={index}
                                        sx={{
                                            bgcolor: 'rgba(25, 118, 210, 0.04)',
                                            borderRadius: 1,
                                            mb: 1,
                                            transition: 'all 0.3s',
                                            '&:hover': {
                                                bgcolor: 'rgba(25, 118, 210, 0.08)',
                                            }
                                        }}
                                    >
                                        <ListItemIcon sx={{ color: '#1976d2' }}>
                                            {method.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={method.text} />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>

                    {/* Secure Payments Section */}
                    <Card sx={{ mb: 4, boxShadow: 3 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <SecurityIcon sx={{ fontSize: 40, color: '#1976d2', mr: 2 }} />
                                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                    Secure Online Payments
                                </Typography>
                            </Box>
                            <Box sx={{
                                p: 3,
                                bgcolor: 'rgba(25, 118, 210, 0.04)',
                                borderRadius: 1,
                                border: '1px solid rgba(25, 118, 210, 0.2)'
                            }}>
                                <Typography sx={{ color: '#555' }}>
                                    All online transactions are processed through a secure system that guarantees
                                    the protection of your personal data and banking information. We use SSL
                                    (Secure Socket Layer) technology to encrypt all transmitted data.
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Billing Policy Section */}
                    <Card sx={{ mb: 4, boxShadow: 3 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <ReceiptIcon sx={{ fontSize: 40, color: '#1976d2', mr: 2 }} />
                                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                    Billing Policy
                                </Typography>
                            </Box>
                            <Typography paragraph sx={{ color: '#555', mb: 3 }}>
                                After completing your order, you will receive the corresponding invoice:
                            </Typography>
                            <List>
                                {[
                                    'The invoice will be sent by email to the address specified in the order.',
                                    'Please verify the accuracy of the information entered when placing the order.'
                                ].map((text, index) => (
                                    <ListItem key={index} sx={{ py: 1 }}>
                                        <ListItemIcon>
                                            <CheckCircleIcon color="primary" />
                                        </ListItemIcon>
                                        <ListItemText primary={text} />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>

                    {/* Currency and Taxes Section */}
                    <Card sx={{ mb: 4, boxShadow: 3 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <EuroIcon sx={{ fontSize: 40, color: '#1976d2', mr: 2 }} />
                                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                    Currency and Taxes
                                </Typography>
                            </Box>
                            <List>
                                {[
                                    'All prices displayed on the website are in $ and include VAT, where applicable.',
                                    'For international orders, additional costs (customs duties or other fees) will be borne by the customer.'
                                ].map((text, index) => (
                                    <ListItem key={index} sx={{
                                        bgcolor: 'rgba(25, 118, 210, 0.04)',
                                        borderRadius: 1,
                                        mb: 1
                                    }}>
                                        <ListItemIcon>
                                            <CheckCircleIcon color="primary" />
                                        </ListItemIcon>
                                        <ListItemText primary={text} />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>

                    {/* Payment Issues Section */}
                    <Card sx={{ mb: 4, boxShadow: 3 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <HelpOutlineIcon sx={{ fontSize: 40, color: '#1976d2', mr: 2 }} />
                                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                    Payment Issues
                                </Typography>
                            </Box>
                            <Box sx={{
                                p: 3,
                                bgcolor: 'rgba(25, 118, 210, 0.04)',
                                borderRadius: 1,
                                border: '1px dashed #1976d2'
                            }}>
                                <Typography sx={{ color: '#555' }}>
                                    If you encounter difficulties processing your payment, please contact us immediately at{' '}
                                    <strong>romanianfootballstore@yahoo.com</strong> or <strong>+40 745 250 326</strong>.
                                    Our support team is available to resolve any issues
                                    as quickly as possible.
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>

                    <Divider sx={{ my: 4 }} />

                    <Typography
                        paragraph
                        sx={{
                            textAlign: 'center',
                            fontStyle: 'italic',
                            color: '#666',
                            bgcolor: 'rgba(25, 118, 210, 0.04)',
                            p: 2,
                            borderRadius: 1
                        }}
                    >
                        For additional assistance regarding payments, don't hesitate to contact us!
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
}

export default PaymentPolicy;