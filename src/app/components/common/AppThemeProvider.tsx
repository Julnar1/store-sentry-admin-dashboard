'use client';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export const DrawerWidth=250;
export const Colors={
    primary:'#F06292',
    secondary:'#0097A7',
    info:'#03A9F4',
    dark:'#212121',//dark gray for backgrounds, text, and borders
    light:'##FFFFFF',
    muted:'#9E9E9E',// neutral gray for subtle text or backgrounds
    border:'#EEEEEE',//light gray for subtle borders and dividers
    gray:'#EEEEEE',
    transparent:'#00000000',
    white:"#FFFFFF",
    black:'#000000',
    danger:'#d32f2f',
};
export default function AppThemeProvider(
    {children}: Readonly<{children: React.ReactNode;}>
) {
//create theme
const theme = createTheme({
    palette: {
      primary: {
          dark:'#a84466',
        main: Colors.primary,
        light:'#f381a7',
      },
      secondary: {
          dark:'#006974',
        main: Colors.secondary,
        light:'#33abb8',
      },
      info: {
          main: Colors.info,
        },
    },
    typography: {
      fontFamily: 'var(--font-roboto)',
    },
    components:{
      MuiDrawer:{
        styleOverrides:{
          paper:{
            width:DrawerWidth,
            background:Colors.transparent,
            color:Colors.muted,
          }
        }
      },
      MuiButton:{
        defaultProps:{
          disableRipple:true,
          disableElevation:true,
        }
      },
      MuiAppBar:{
        styleOverrides:{
          root:{
            background:Colors.white,
            color:Colors.black,
          }
        }
      }
    }
  });
    return (
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    );
  }
 


