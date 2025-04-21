'use client';
import { ListItemButton, ListItemButtonProps, ListItemIcon, ListItemText } from "@mui/material";
import { Colors } from "../common/AppThemeProvider";
import { useTheme } from '@mui/material/styles';

interface MyListItemButtonProps extends ListItemButtonProps {
  selected: boolean;
  icon: React.ReactNode;
  text: string;
  handleNavbarItemClicked: (item: string) => void;
}

export const MyListItemButton: React.FC<MyListItemButtonProps> =({selected,icon,text,handleNavbarItemClicked})=>{
  const theme = useTheme();
    return(
    <ListItemButton onClick={()=>handleNavbarItemClicked(text)} sx={()=>({...(selected&&{background:Colors.white,borderRadius:2,fontWeight:'bold',color:Colors.black})})}>
      <ListItemIcon 
          sx={(theme) => ({ 
            ...(selected&&{color:theme.palette.primary.main})})} 
        >
    {icon}
      </ListItemIcon>
      <ListItemText primary={text}/>
    </ListItemButton>
    );
          };
