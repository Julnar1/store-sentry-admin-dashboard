'use client'; // This is the Client Component

import { useState } from 'react';

import { Box, useTheme } from '@mui/material';

import NavDrawer from './layout/NavDrawer';

import DrawerWidth from './common/AppThemeProvider';

import Appbar from './Appbar';

import { grey } from '@mui/material/colors';

interface ClientContentProps {

children: React.ReactNode;

isLoggedIn: boolean;

userRole: string | null;

handleLogout: () => void;

};

export default function ClientContent({ children, isLoggedIn, userRole,handleLogout }: ClientContentProps) {

const [open, setOpen] = useState(true);

const theme = useTheme();

return (

<Box sx={{ display: 'flex' }}>

<Appbar open ={open} handleDrawerOpen={() => setOpen(true)} isLoggedIn={isLoggedIn} userRole={userRole} handleLogout={handleLogout} />

<NavDrawer open={open} setOpen={setOpen} />

<Box component="main" sx={{

flexGrow: 1,

background:grey,

height:'100vh',

p:3,

// Use calc() to dynamically calculate width

width: `calc(100vw - ${open ? `${DrawerWidth}px` : 0})`,

marginLeft: open ? `${DrawerWidth}px` : -30,

transition: theme.transitions.create('margin', {

duration: theme.transitions.duration.shortest,

}),

}}>

{children}

</Box>

</Box>

);

};