import React, {JSX} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    Container,
    Typography,
    Button,
    Box,
    Paper,
    Card,
    CardContent,
    Grid,
    Divider,
    useTheme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';

function ContactPage(): JSX.Element {
    const navigate = useNavigate();
    const theme = useTheme();

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            py: 8,
        }}>
            <Container maxWidth="lg">
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

                    <Button
                        startIcon={<ArrowBackIcon/>}
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
                    {/* Header Section */}
                    <Box sx={{textAlign: 'center', mb: 6}}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mb: 2
                        }}>
                            <SupportAgentIcon sx={{
                                fontSize: 60,
                                background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                color: 'transparent',
                            }}/>
                        </Box>
                        <Typography
                            variant="h3"
                            component="h1"
                            gutterBottom
                            sx={{
                                fontWeight: 700,
                                background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                color: 'transparent',
                            }}
                        >
                            Contact Us
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                color: '#666',
                                maxWidth: '600px',
                                margin: '0 auto'
                            }}
                        >
                            We're here for you! If you have questions, suggestions, or need help,
                            don't hesitate to contact us. Our team is ready to respond to you
                            as quickly as possible.
                        </Typography>
                    </Box>

                    {/* Contact Information */}
                    <Card
                        sx={{
                            boxShadow: 3,
                            maxWidth: 600,
                            margin: '0 auto',
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        <CardContent>
                            <Typography
                                variant="h5"
                                sx={{
                                    mb: 3,
                                    fontWeight: 600,
                                    background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    color: 'transparent',
                                }}
                            >
                                Contact Information
                            </Typography>

                            <Box sx={{mb: 3}}>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 2,
                                    p: 2,
                                    bgcolor: 'rgba(25, 118, 210, 0.04)',
                                    borderRadius: 1,
                                    transition: 'transform 0.2s ease',
                                    '&:hover': {
                                        transform: 'translateX(8px)',
                                        bgcolor: 'rgba(25, 118, 210, 0.08)',
                                    }
                                }}>
                                    <EmailIcon sx={{
                                        color: '#1976d2',
                                        mr: 2,
                                        fontSize: 28
                                    }}/>
                                    <Box>
                                        <Typography variant="subtitle1" sx={{fontWeight: 600}}>
                                            Email
                                        </Typography>
                                        <Typography sx={{color: '#666'}}>
                                            romanianfootballstore@yahoo.com
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 2,
                                    p: 2,
                                    bgcolor: 'rgba(25, 118, 210, 0.04)',
                                    borderRadius: 1,
                                    transition: 'transform 0.2s ease',
                                    '&:hover': {
                                        transform: 'translateX(8px)',
                                        bgcolor: 'rgba(25, 118, 210, 0.08)',
                                    }
                                }}>
                                    <PhoneIcon sx={{
                                        color: '#1976d2',
                                        mr: 2,
                                        fontSize: 28
                                    }}/>
                                    <Box>
                                        <Typography variant="subtitle1" sx={{fontWeight: 600}}>
                                            Phone
                                        </Typography>
                                        <Typography sx={{color: '#666'}}>
                                            +40 769 250 326
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 2,
                                    p: 2,
                                    bgcolor: 'rgba(25, 118, 210, 0.04)',
                                    borderRadius: 1,
                                    transition: 'transform 0.2s ease',
                                    '&:hover': {
                                        transform: 'translateX(8px)',
                                        bgcolor: 'rgba(25, 118, 210, 0.08)',
                                    }
                                }}>
                                    <AccessTimeIcon sx={{
                                        color: '#1976d2',
                                        mr: 2,
                                        fontSize: 28
                                    }}/>
                                    <Box>
                                        <Typography variant="subtitle1" sx={{fontWeight: 600}}>
                                            Business Hours
                                        </Typography>
                                        <Typography sx={{color: '#666'}}>
                                            Monday - Friday, 09:00 - 18:00
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    p: 2,
                                    bgcolor: 'rgba(25, 118, 210, 0.04)',
                                    borderRadius: 1,
                                    transition: 'transform 0.2s ease',
                                    '&:hover': {
                                        transform: 'translateX(8px)',
                                        bgcolor: 'rgba(25, 118, 210, 0.08)',
                                    }
                                }}>
                                    <LocationOnIcon sx={{
                                        color: '#1976d2',
                                        mr: 2,
                                        fontSize: 28
                                    }}/>
                                    <Box>
                                        <Typography variant="subtitle1" sx={{fontWeight: 600}}>
                                            Address
                                        </Typography>
                                        <Typography sx={{color: '#666'}}>
                                            Cluj-Napoca, Memorandumului Street, No. 28
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            <Divider sx={{
                                my: 3,
                                background: 'linear-gradient(90deg, transparent, rgba(25, 118, 210, 0.2), transparent)'
                            }}/>

                            {/* Social Media Section */}
                            <Typography
                                variant="h6"
                                sx={{
                                    mb: 3,
                                    fontWeight: 600,
                                    textAlign: 'center',
                                    background: 'linear-gradient(45deg, #1976d2, #64b5f6)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    color: 'transparent',
                                }}
                            >
                                Social Media
                            </Typography>
                            <Box sx={{
                                display: 'flex',
                                gap: 3,
                                justifyContent: 'center'
                            }}>
                                <Box
                                    component="a"
                                    href="[Facebook URL]"
                                    target="_blank"
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 60,
                                        height: 60,
                                        borderRadius: '50%',
                                        bgcolor: 'rgba(25, 118, 210, 0.04)',
                                        transition: 'all 0.3s',
                                        '&:hover': {
                                            bgcolor: 'rgba(25, 118, 210, 0.08)',
                                            transform: 'scale(1.1) rotate(8deg)'
                                        }
                                    }}
                                >
                                    <FacebookIcon sx={{
                                        fontSize: 28,
                                        color: '#1976d2'
                                    }}/>
                                </Box>
                                <Box
                                    component="a"
                                    href="[Instagram URL]"
                                    target="_blank"
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 60,
                                        height: 60,
                                        borderRadius: '50%',
                                        bgcolor: 'rgba(25, 118, 210, 0.04)',
                                        transition: 'all 0.3s',
                                        '&:hover': {
                                            bgcolor: 'rgba(25, 118, 210, 0.08)',
                                            transform: 'scale(1.1) rotate(8deg)'
                                        }
                                    }}
                                >
                                    <InstagramIcon sx={{
                                        fontSize: 28,
                                        color: '#1976d2'
                                    }}/>
                                </Box>
                                <Box
                                    component="a"
                                    href="[Twitter URL]"
                                    target="_blank"
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 60,
                                        height: 60,
                                        borderRadius: '50%',
                                        bgcolor: 'rgba(25, 118, 210, 0.04)',
                                        transition: 'all 0.3s',
                                        '&:hover': {
                                            bgcolor: 'rgba(25, 118, 210, 0.08)',
                                            transform: 'scale(1.1) rotate(8deg)'
                                        }
                                    }}
                                >
                                    <XIcon sx={{
                                        fontSize: 28,
                                        color: '#1976d2'
                                    }}/>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>

                    <Box
                        sx={{
                            mt: 4,
                            p: 3,
                            bgcolor: 'rgba(25, 118, 210, 0.04)',
                            borderRadius: 2,
                            border: '1px dashed rgba(25, 118, 210, 0.2)',
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                                transform: 'scale(1.01)',
                            }
                        }}
                    >
                        <Typography
                            sx={{
                                textAlign: 'center',
                                fontStyle: 'italic',
                                color: '#666',
                                fontSize: '1.1rem',
                                lineHeight: 1.6
                            }}
                        >
                            We look forward to hearing from you and providing the assistance you need!
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}

export default ContactPage;