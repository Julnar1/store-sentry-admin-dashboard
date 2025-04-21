"use client";
import { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import { CategoryFormDialog } from '../components/forms/CategoryFormDialog';
import { DrawerHeader } from "../components/NavDrawer";
import AddIcon from '@mui/icons-material/Add';
import React from "react";
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Colors } from "../components/AppThemeProvider";
import { CategoryService } from '../services/category-service';
// Import Redux hooks
import { useAppDispatch, useAppSelector } from '../redux/store/store';
import { fetchCategories, addCategory, updateCategory, deleteCategory } from '../redux/features/categories-slice';
import { RoleBasedAccess } from '../components/RoleBasedAccess';

export interface Category {
  id: number;
  name: string;
  image: string;
}

function CategoriesContent() {
  const dispatch = useAppDispatch();
  // Access categories, status, and error from Redux store
  const { categories, status, error } = useAppSelector((state) => state.categories);
  const { user } = useAppSelector((state) => state.user);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  useEffect(() => {
    dispatch(fetchCategories()); // Dispatch the action to fetch categories
}, [dispatch]);
  const handleAddCategory = () => {
    setSelectedCategory(null); // Set selectedCategory to null for new category
    setOpenAddDialog(true);
  };
  const handleEditCategory = (category:Category)=>{
    setSelectedCategory(category);
    setOpenAddDialog(true);// Use the same dialog for edit
  };
  const handleDeleteCategory = (categoryId: number) => {
    setCategoryToDelete(categoryId);
    setOpenDeleteConfirmation(true);
};

const confirmDeleteCategory = async () => {
    if (categoryToDelete !== null) {
        try {
          await CategoryService.deleteCategory(categoryToDelete);
          dispatch(deleteCategory(categoryToDelete));
          // Refresh the categories list after successful deletion
          dispatch(fetchCategories());
        } catch (error: any) {
            console.error("Error deleting category:", error);
            
            // Provide a more informative error message
            let errorMessage = "Cannot delete this category.";
            
            if (error.message && error.message.includes("400")) {
                errorMessage = "This category cannot be deleted because it has associated products. Please remove or reassign all products in this category first.";
            } else if (error.message && error.message.includes("403")) {
                errorMessage = "You don't have permission to delete this category. Only admin users can delete categories.";
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            alert(errorMessage);
        } finally {
            setOpenDeleteConfirmation(false);
            setCategoryToDelete(null);
        }
    }
};
  const handleCategorySubmit = async (values: Category) => {
    try {
      if (values.id === 0) {
        // Add new category
        const newCategory = await CategoryService.createCategory(values); // Use CategoryService to create
        dispatch(addCategory(newCategory)); // Dispatch the add action
      } else {
        // Update existing category
        await CategoryService.updateCategory(values); // Use CategoryService to update
        dispatch(updateCategory(values)); // Dispatch the update action
      }
      setOpenAddDialog(false);
      setSelectedCategory(null);// Clear selected category after successful submission
  } catch (error) {
    console.error("Error submitting category:", error);
  }
};
  const handleChangePage = (event: any, newPage: React.SetStateAction<number>) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: { target: { value: string; }; }) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, categories.length - page * rowsPerPage);
  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedCategories=categories.slice(startIndex, endIndex);
 
  return (
    <>
    <DrawerHeader/>
        <Typography component="h5" variant="h5" gutterBottom>
          Categories
        </Typography>
        <Button sx={{mb:1}} onClick={handleAddCategory} startIcon={React.cloneElement(<AddIcon/>)} variant="contained">Add Category</Button>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 400 }} aria-label="categories table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedCategories.map((category:Category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell><img src={category.image} alt={category.name} width="50" /></TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditCategory(category)}><EditIcon/></IconButton>
                    <IconButton onClick={() => handleDeleteCategory(category.id)}><DeleteForeverIcon sx={{color:Colors.danger}}/></IconButton>
                  </TableCell>
                </TableRow>
                 ))}
                 {emptyRows > 0 && (
                   <TableRow style={{ height: 53 * emptyRows }}>
                     <TableCell colSpan={6} />
                   </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={categories.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
        <CategoryFormDialog open={openAddDialog} setOpen={setOpenAddDialog}  selectedCategory={selectedCategory} 
      handleSubmit={handleCategorySubmit}/>
       <Dialog open={openDeleteConfirmation} onClose={() => setOpenDeleteConfirmation(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this category?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteConfirmation(false)}>Cancel</Button>
                    <Button onClick={confirmDeleteCategory} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
    </>
  );
}

export default function Categories() {
  return (
    <RoleBasedAccess allowedRoles={['admin']} showAccessDenied={true}>
      <CategoriesContent />
    </RoleBasedAccess>
  );
}

