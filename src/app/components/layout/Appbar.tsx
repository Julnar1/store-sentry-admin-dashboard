"use client";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';

import Toolbar from '@mui/material/Toolbar';

import Typography from '@mui/material/Typography';

import IconButton from '@mui/material/IconButton';

import MenuIcon from '@mui/icons-material/Menu';

import { styled } from '@mui/material/styles';

import { Colors, DrawerWidth } from '../common/AppThemeProvider';

import SearchIcon from '@mui/icons-material/Search';

import InputBase from '@mui/material/InputBase';

import { Box, Button, Link } from '@mui/material';

import {useRouter} from 'next/navigation';

import Image from 'next/image';

interface AppBarProps extends MuiAppBarProps {

open?: boolean;

}

interface AppbarProps {

open: boolean;

isLoggedIn: boolean;

userRole: string | null;

handleDrawerOpen: () => void;

handleLogout: () => void; // Add handleLogout prop

}

const AppBar = styled(MuiAppBar, {

shouldForwardProp: (prop) => prop !== 'open',

})<AppBarProps>(({ theme }) => ({

transition: theme.transitions.create(['margin', 'width'], {

easing: theme.transitions.easing.sharp,

duration: theme.transitions.duration.leavingScreen,

}),

variants: [

{

props: ({ open }) => open,

style: {

width: `calc(100% - ${DrawerWidth}px)`,

marginLeft: `${DrawerWidth}px`,

transition: theme.transitions.create(['margin', 'width'], {

easing: theme.transitions.easing.easeOut,

duration: theme.transitions.duration.enteringScreen,

}),

},

},

],

}));

const Search = styled('div')(({ theme }) => ({

position: 'relative',

borderRadius: theme.shape.borderRadius,

backgroundColor: Colors.gray,

'&:hover': {
backgroundColor: Colors.muted,

},



marginLeft: 0,

width: '100%',

[theme.breakpoints.up('sm')]: {

marginLeft: theme.spacing(1),

width: 'auto',

},

}));
const SearchIconWrapper = styled('div')(({ theme }) => ({

padding: theme.spacing(0, 2),

height: '100%',

position: 'absolute',

pointerEvents: 'none',

display: 'flex',

alignItems: 'center',

justifyContent: 'center',

}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({

color: Colors.muted,

'&:hover': {

color: Colors.white,

 },

width: '100%',

'& .MuiInputBase-input': {

padding: theme.spacing(1, 1, 1, 0),

// vertical padding + font size from searchIcon

paddingLeft: `calc(1em + ${theme.spacing(4)})`,

transition: theme.transitions.create('width'),

[theme.breakpoints.up('sm')]: {

width: '20ch',

'&:focus': {

width: '50ch',

 },

},

},

}));

export default function Appbar({open, handleDrawerOpen, isLoggedIn, userRole, handleLogout}:AppbarProps) {

const router=useRouter();

return(

<>

<AppBar position="fixed" open={open}>

<Toolbar>

<Box sx={{ display: 'flex', alignItems: 'center' }}>

<IconButton

color="inherit"

aria-label="open drawer"

onClick={handleDrawerOpen}

edge="start"

sx={[

{mr: 2,},

open && { display: 'none' },// Hide MenuIcon when drawer is open

]}

>

<MenuIcon />

</IconButton>

{!open && (

<Box sx={{ display: 'flex', alignItems: 'center' }}>
  <Image 
    src="/images/store_sentry_logo.png" 
    alt="StoreSentry Logo" 
    width={100} 
    height={32} 
    style={{ objectFit: 'contain' }}
  />
</Box>

)}

</Box>

<Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>

<Search>

<SearchIconWrapper>

<SearchIcon />

</SearchIconWrapper>

<StyledInputBase

placeholder="Search…"

inputProps={{ 'aria-label': 'search' }}

/>

</Search>

{isLoggedIn ? (

<Button color="primary" variant="contained" onClick={handleLogout} sx={{

marginLeft: 2,

borderRadius: '20px',

}}>

Logout

</Button>

) : (

<Button 
  color="primary" 
  variant="contained" 
  onClick={() => router.push('/login')} 
  sx={{
    marginLeft: 2,
    borderRadius: '20px',
  }}
>
Login
</Button>

)}

</Box>

</Toolbar>

</AppBar>

</>

);
}