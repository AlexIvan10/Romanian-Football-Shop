import React, {useState, useEffect} from 'react';
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
    Card,
    CardContent,
    Chip,
    Avatar,
    Tooltip,
    Fade,
    Grid,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GroupIcon from '@mui/icons-material/Group';
import EmailIcon from '@mui/icons-material/Email';
import SecurityIcon from '@mui/icons-material/Security';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../../utils/AuthContext';

interface User {
    id: number;
    email: string;
    role: 'USER' | 'ADMIN';
    password?: string;
}

const ClientManagement: React.FC = () => {
    const {user} = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [newEmail, setNewEmail] = useState('');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

    useEffect(() => {
        if (!user || user.role !== 'ADMIN') {
            navigate('/');
            return;
        }
        fetchUsers();
    }, [user, navigate]);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/admin/user', {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            } else if (response.status === 401 || response.status === 403) {
                showSnackbar('Unauthorized. Please login again.', 'error');
                navigate('/login');
            } else {
                throw new Error('Failed to fetch users');
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
            showSnackbar('Failed to fetch users', 'error');
        }
    };

    const handleRoleToggle = async (user: User) => {
        try {
            const newRole = user.role === 'USER' ? 'ADMIN' : 'USER';
            const response = await fetch(`http://localhost:8080/api/admin/user/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    id: user.id,
                    email: user.email,
                    role: newRole
                }),
            });

            if (response.ok) {
                await fetchUsers();
                showSnackbar(`User role updated successfully to ${newRole}`, 'success');
            } else if (response.status === 401 || response.status === 403) {
                showSnackbar('Unauthorized. Please login again.', 'error');
                navigate('/login');
            } else {
                throw new Error('Failed to update user role');
            }
        } catch (error) {
            console.error('Error updating user role:', error);
            showSnackbar('Failed to update user role', 'error');
        }
    };

    const handleDelete = async (userId: number) => {
        try {
            const user = users.find(u => u.id === userId);
            if (user?.role === 'ADMIN') {
                showSnackbar('Cannot delete admin users', 'error');
                return;
            }

            const response = await fetch(`http://localhost:8080/api/admin/user/${userId}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                setUsers(users.filter(u => u.id !== userId));
                showSnackbar('User deleted successfully', 'success');
            } else if (response.status === 401 || response.status === 403) {
                showSnackbar('Unauthorized. Please login again.', 'error');
                navigate('/login');
            } else {
                const errorData = await response.text();
                throw new Error(errorData || 'Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            showSnackbar(error instanceof Error ? error.message : 'Failed to delete user', 'error');
        }
    };

    const handleEditClick = (user: User) => {
        setSelectedUser(user);
        setNewEmail(user.email);
        setOpenEditDialog(true);
    };

    const handleEmailUpdate = async () => {
        if (!selectedUser) return;

        try {
            const response = await fetch(`http://localhost:8080/api/admin/user/${selectedUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({...selectedUser, email: newEmail}),
            });

            if (response.ok) {
                await fetchUsers();
                setOpenEditDialog(false);
                showSnackbar('Email updated successfully', 'success');
            } else if (response.status === 401 || response.status === 403) {
                showSnackbar('Unauthorized. Please login again.', 'error');
                navigate('/login');
            } else {
                throw new Error('Failed to update email');
            }
        } catch (error) {
            console.error('Error updating email:', error);
            showSnackbar('Failed to update email', 'error');
        }
    };

    const showSnackbar = (message: string, severity: 'success' | 'error') => {
        setSnackbar({open: true, message, severity});
    };

    // Calculate statistics
    const totalUsers = users.length;
    const adminUsers = users.filter(u => u.role === 'ADMIN').length;
    const regularUsers = users.filter(u => u.role === 'USER').length;

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
                            label="Client Management"
                            icon={<GroupIcon/>}
                            sx={{
                                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                                color: 'white',
                                fontWeight: 'bold',
                                px: 2,
                                py: 1
                            }}
                        />
                    </Box>

                    <Box sx={{display: 'flex', alignItems: 'center', gap: 3, mb: 2}}>
                        <Box sx={{
                            position: 'relative',
                            p: 2,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                            boxShadow: '0 8px 24px rgba(25, 118, 210, 0.3)',
                        }}>
                            <PeopleAltIcon sx={{
                                fontSize: 40,
                                color: 'white'
                            }}/>
                        </Box>
                        <Box>
                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: 800,
                                    background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    color: 'transparent',
                                    mb: 0.5,
                                }}
                            >
                                Client Management
                            </Typography>
                            <Typography variant="h6" color="text.secondary" sx={{fontWeight: 400}}>
                                Manage user accounts, roles, and permissions
                            </Typography>
                        </Box>
                    </Box>
                </Paper>

                {/* Statistics Cards */}
                <Grid container spacing={3} sx={{mb: 4}}>
                    <Grid size={{xs: 12, md: 4}}>
                        <Card sx={{
                            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                            color: 'white',
                            borderRadius: 3,
                            height: '100%'
                        }}>
                            <CardContent sx={{p: 3}}>
                                <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <Box>
                                        <Typography variant="h4" sx={{fontWeight: 'bold', mb: 1}}>
                                            {totalUsers}
                                        </Typography>
                                        <Typography variant="body1" sx={{opacity: 0.9}}>
                                            Total Users
                                        </Typography>
                                    </Box>
                                    <Avatar sx={{bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56}}>
                                        <GroupIcon sx={{fontSize: 30}}/>
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
                                            {regularUsers}
                                        </Typography>
                                        <Typography variant="body1" sx={{opacity: 0.9}}>
                                            Regular Users
                                        </Typography>
                                    </Box>
                                    <Avatar sx={{bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56}}>
                                        <PersonIcon sx={{fontSize: 30}}/>
                                    </Avatar>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{xs: 12, md: 4}}>
                        <Card sx={{
                            background: 'linear-gradient(135deg, #ed6c02 0%, #ff9800 100%)',
                            color: 'white',
                            borderRadius: 3,
                            height: '100%'
                        }}>
                            <CardContent sx={{p: 3}}>
                                <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                    <Box>
                                        <Typography variant="h4" sx={{fontWeight: 'bold', mb: 1}}>
                                            {adminUsers}
                                        </Typography>
                                        <Typography variant="body1" sx={{opacity: 0.9}}>
                                            Admin Users
                                        </Typography>
                                    </Box>
                                    <Avatar sx={{bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56}}>
                                        <SecurityIcon sx={{fontSize: 30}}/>
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
                        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                        p: 3,
                        color: 'white'
                    }}>
                        <Typography variant="h5" sx={{fontWeight: 600, display: 'flex', alignItems: 'center', gap: 2}}>
                            <GroupIcon/>
                            User Management Table
                        </Typography>
                        <Typography variant="body2" sx={{opacity: 0.9, mt: 1}}>
                            View and manage all registered users in the system
                        </Typography>
                    </Box>

                    <TableContainer sx={{maxHeight: 600}}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{
                                        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: '1rem'
                                    }}>
                                        User ID
                                    </TableCell>
                                    <TableCell sx={{
                                        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: '1rem'
                                    }}>
                                        Email Address
                                    </TableCell>
                                    <TableCell sx={{
                                        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: '1rem'
                                    }}>
                                        User Role
                                    </TableCell>
                                    <TableCell align="center" sx={{
                                        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: '1rem'
                                    }}>
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((user, index) => (
                                    <Fade in timeout={300 + index * 100} key={user.id}>
                                        <TableRow
                                            sx={{
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
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
                                                        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                                                        fontSize: '0.9rem',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        #{user.id}
                                                    </Avatar>
                                                    <Typography variant="body1" sx={{fontWeight: 600}}>
                                                        {user.id}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                                                    <EmailIcon sx={{color: 'text.secondary', fontSize: 20}}/>
                                                    <Typography variant="body1" sx={{fontWeight: 500}}>
                                                        {user.email}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    icon={user.role === 'ADMIN' ? <SecurityIcon/> : <PersonIcon/>}
                                                    label={user.role}
                                                    sx={{
                                                        background: user.role === 'ADMIN'
                                                            ? 'linear-gradient(135deg, #ed6c02 0%, #ff9800 100%)'
                                                            : 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
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
                                                        title={`Change role to ${user.role === 'USER' ? 'ADMIN' : 'USER'}`}>
                                                        <IconButton
                                                            onClick={() => handleRoleToggle(user)}
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
                                                            {user.role === 'USER' ? <AdminPanelSettingsIcon/> :
                                                                <PersonIcon/>}
                                                        </IconButton>
                                                    </Tooltip>

                                                    <Tooltip title="Edit user email">
                                                        <IconButton
                                                            onClick={() => handleEditClick(user)}
                                                            sx={{
                                                                background: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
                                                                color: 'white',
                                                                '&:hover': {
                                                                    background: 'linear-gradient(135deg, #1b5e20 0%, #4caf50 100%)',
                                                                    transform: 'scale(1.1)',
                                                                },
                                                                transition: 'all 0.2s ease'
                                                            }}
                                                        >
                                                            <EditIcon/>
                                                        </IconButton>
                                                    </Tooltip>

                                                    <Tooltip
                                                        title={user.role === 'ADMIN' ? 'Cannot delete admin users' : 'Delete user'}>
                                                        <span>
                                                            <IconButton
                                                                onClick={() => handleDelete(user.id)}
                                                                disabled={user.role === 'ADMIN'}
                                                                sx={{
                                                                    background: user.role === 'ADMIN'
                                                                        ? 'rgba(0,0,0,0.12)'
                                                                        : 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)',
                                                                    color: user.role === 'ADMIN' ? 'rgba(0,0,0,0.26)' : 'white',
                                                                    '&:hover': {
                                                                        background: user.role === 'ADMIN'
                                                                            ? 'rgba(0,0,0,0.12)'
                                                                            : 'linear-gradient(135deg, #c62828 0%, #e53935 100%)',
                                                                        transform: user.role === 'ADMIN' ? 'none' : 'scale(1.1)',
                                                                    },
                                                                    transition: 'all 0.2s ease'
                                                                }}
                                                            >
                                                                <DeleteIcon/>
                                                            </IconButton>
                                                        </span>
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

                {/* Edit Dialog */}
                <Dialog
                    open={openEditDialog}
                    onClose={() => setOpenEditDialog(false)}
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
                        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                        color: 'white',
                        py: 3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                    }}>
                        <EditIcon/>
                        Edit User Email
                    </DialogTitle>
                    <DialogContent sx={{mt: 3, pb: 2}}>
                        <Box sx={{mb: 2}}>
                            <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
                                Update the email address for user ID: <strong>{selectedUser?.id}</strong>
                            </Typography>
                        </Box>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="New Email Address"
                            type="email"
                            fullWidth
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 3,
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#1976d2',
                                        borderWidth: 2,
                                    }
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#1976d2',
                                }
                            }}
                            InputProps={{
                                startAdornment: <EmailIcon sx={{mr: 1, color: 'text.secondary'}}/>
                            }}
                        />
                    </DialogContent>
                    <DialogActions sx={{p: 3, gap: 2}}>
                        <Button
                            onClick={() => setOpenEditDialog(false)}
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
                            onClick={handleEmailUpdate}
                            variant="contained"
                            sx={{
                                borderRadius: 3,
                                textTransform: 'none',
                                px: 4,
                                py: 1.5,
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
                            Update Email
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Snackbar */}
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

export default ClientManagement;