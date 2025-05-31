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
    Divider,
    Card,
    CardContent,
    useTheme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EuroIcon from '@mui/icons-material/Euro';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import PublicIcon from '@mui/icons-material/Public';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';

function LogisticsPolicy(): JSX.Element {
    const navigate = useNavigate();
    const theme = useTheme();

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
                        Logistics Policy
                    </Typography>

                    {/* Delivery Section */}
                    <Card sx={{ mb: 4, boxShadow: 3 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <LocalShippingIcon sx={{ fontSize: 40, color: '#1976d2', mr: 2 }} />
                                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                    Delivery
                                </Typography>
                            </Box>
                            <Typography paragraph sx={{ color: '#555' }}>
                                We commit to delivering orders in the shortest time possible, so you can enjoy your favorite football jerseys. We collaborate with trusted couriers to ensure fast and secure delivery.
                            </Typography>
                            <List>
                                <ListItem sx={{ bgcolor: 'rgba(25, 118, 210, 0.04)', borderRadius: 1, mb: 1 }}>
                                    <ListItemIcon>
                                        <AccessTimeIcon color="primary" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={<Typography sx={{ fontWeight: 600 }}>Order processing time</Typography>}
                                        secondary="1-2 working days"
                                    />
                                </ListItem>
                                <ListItem sx={{ bgcolor: 'rgba(25, 118, 210, 0.04)', borderRadius: 1, mb: 1 }}>
                                    <ListItemIcon>
                                        <LocalShippingIcon color="primary" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={<Typography sx={{ fontWeight: 600 }}>Estimated delivery time</Typography>}
                                        secondary="2-5 working days, depending on destination"
                                    />
                                </ListItem>
                                <ListItem sx={{ bgcolor: 'rgba(25, 118, 210, 0.04)', borderRadius: 1 }}>
                                    <ListItemIcon>
                                        <EuroIcon color="primary" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={<Typography sx={{ fontWeight: 600 }}>Delivery costs</Typography>}
                                        secondary="These will be displayed when completing the order, depending on the delivery address and order value"
                                    />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>

                    {/* Free Shipping Section */}
                    <Card sx={{ mb: 4, boxShadow: 3 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <CardGiftcardIcon sx={{ fontSize: 40, color: '#1976d2', mr: 2 }} />
                                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                    Free Shipping
                                </Typography>
                            </Box>
                            <Box sx={{
                                p: 2,
                                bgcolor: 'rgba(25, 118, 210, 0.04)',
                                borderRadius: 1,
                                border: '1px dashed #1976d2'
                            }}>
                                <Typography sx={{ color: '#555' }}>
                                    We offer free shipping.
                                    This offer is valid only for domestic deliveries.
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Order Tracking Section */}
                    <Card sx={{ mb: 4, boxShadow: 3 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <TrackChangesIcon sx={{ fontSize: 40, color: '#1976d2', mr: 2 }} />
                                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                    Order Tracking
                                </Typography>
                            </Box>
                            <Typography paragraph sx={{ color: '#555' }}>
                                After shipping the order, you will receive a tracking number via email or SMS. You can use this number to check the delivery status on the courier's website.
                            </Typography>
                        </CardContent>
                    </Card>

                    {/* Returns Section */}
                    <Card sx={{ mb: 4, boxShadow: 3 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <AssignmentReturnIcon sx={{ fontSize: 40, color: '#1976d2', mr: 2 }} />
                                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                    Returns and Exchanges
                                </Typography>
                            </Box>
                            <Typography paragraph sx={{ color: '#555' }}>
                                If you are not completely satisfied with your purchase, we offer the possibility to return or exchange products, following these conditions:
                            </Typography>
                            <List>
                                {[
                                    'Products must be returned within 14 days of receipt.',
                                    'Jerseys must be in their original condition, unworn and with all labels attached.',
                                    'Return costs will be borne by the customer, except in cases where the product was delivered incorrectly or defective.'
                                ].map((text, index) => (
                                    <ListItem key={index} sx={{ py: 1 }}>
                                        <ListItemIcon>
                                            <CheckCircleIcon color="primary" />
                                        </ListItemIcon>
                                        <ListItemText primary={text} />
                                    </ListItem>
                                ))}
                            </List>
                            <Box sx={{
                                mt: 2,
                                p: 2,
                                bgcolor: 'rgba(25, 118, 210, 0.04)',
                                borderRadius: 1
                            }}>
                                <Typography sx={{ color: '#555' }}>
                                    To initiate a return or exchange process, please contact us at
                                    <strong> romanianfootballstore@yahoo.com</strong> or at <strong>+40 745 250 326</strong>.
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>

                    {/* Delivery Zones Section */}
                    <Card sx={{ mb: 4, boxShadow: 3 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <PublicIcon sx={{ fontSize: 40, color: '#1976d2', mr: 2 }} />
                                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                    Delivery Zones
                                </Typography>
                            </Box>
                            <Typography paragraph sx={{ color: '#555' }}>
                                We deliver throughout the country and, for certain destinations, we also offer international delivery. Please check the shipping rates for international deliveries before completing your order.
                            </Typography>
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
                        For any other information related to our logistics policy, please contact us. We are here to help you!
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
}

export default LogisticsPolicy;