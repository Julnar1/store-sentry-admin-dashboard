"use client";
import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Colors, DrawerWidth } from './AppThemeProvider';
import { MyListItemButton } from './ui/MyListItemButton';
import { usePathname, useRouter } from 'next/navigation';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AppsIcon from '@mui/icons-material/Apps';
import CategoryIcon from '@mui/icons-material/Category';
import { useAppSelector } from '../redux/store/store';
import { RoleBasedAccess } from './RoleBasedAccess';

interface NavDrawerProps {
  open: boolean;
  setOpen:React.Dispatch<React.SetStateAction<boolean>>;
}

export const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function NavDrawer({open,setOpen}: NavDrawerProps) {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname(); // Get current path
  const { isLoggedIn, user } = useAppSelector((state) => state.user); // Access isLoggedIn and user from Redux store
  
  const handleDrawerClose = () => {
    setOpen(false);
  };
  
  const handleNavbarItemClicked = (item: string) => { // Type the item parameter
    const href = item === 'dashboard' ? '/' : `/${item}`;
    router.push(href);
  };

  const isActive = (item: string) => {  // Helper function to check active state
    const href = item === 'dashboard' ? '/' : `/${item}`;
    return pathname === href;
  };

  return (
    <>
      <Drawer
        sx={{
          width: DrawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DrawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          {open && <Typography variant="h6" noWrap component="div" fontWeight={'bold'} color={Colors.black}>
            StoreSentry
          </Typography>}
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <MyListItemButton selected={isActive('dashboard')} icon={<DashboardIcon/>} text={"dashboard"} handleNavbarItemClicked={handleNavbarItemClicked}/>
          
          {/* Products menu item - visible to admin and manager roles */}
          <RoleBasedAccess allowedRoles={['admin', 'manager']} showAccessDenied={false}>
            <MyListItemButton selected={isActive('products')} icon={<AppsIcon/>} text={"products"} handleNavbarItemClicked={handleNavbarItemClicked}/>
          </RoleBasedAccess>
          
          {/* Categories menu item - visible only to admin role */}
          <RoleBasedAccess allowedRoles={['admin']} showAccessDenied={false}>
            <MyListItemButton selected={isActive('categories')} icon={<CategoryIcon/>} text={"categories"} handleNavbarItemClicked={handleNavbarItemClicked}/>
          </RoleBasedAccess>
        </List>
      </Drawer>
    </> 
  );
}

