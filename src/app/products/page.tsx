"use client";
import { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import { useRouter } from 'next/navigation';
import { DrawerHeader } from "../components/NavDrawer";
import AddIcon from '@mui/icons-material/Add';
import React from "react";
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Colors } from "../components/AppThemeProvider";
import { ProductFormDialog } from '../components/ProductFormDialog';
import { ProductService } from '../services/product-service';
import { useAppDispatch, useAppSelector } from '../redux/store/store';
import { fetchProducts, addProduct, updateProduct, deleteProduct } from '../redux/features/products-slice';
import { RoleBasedAccess } from '../components/RoleBasedAccess';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[]; 
  category: { 
    id: number;
    name?: string;
    image?:string;
  }; 
}

function ProductsContent() {
  const dispatch = useAppDispatch();
  const { products, status, error } = useAppSelector((state) => state.products);
  const { user } = useAppSelector((state) => state.user);
  const [openAddProductDialog, setOpenAddProductDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch products on component mount and when dialog closes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Pass 0 as limit to get all products
        await dispatch(fetchProducts({ limit: 0, offset: 0 }));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setOpenAddProductDialog(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setOpenAddProductDialog(true);
  };

  const handleDeleteProduct = async (productId: number) => {
    setProductToDelete(productId);
    setOpenDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    if (productToDelete !== null) {
      setIsLoading(true);
      try {
        await ProductService.deleteProduct(productToDelete);
        dispatch(deleteProduct(productToDelete));
        await dispatch(fetchProducts({}));
      } catch (error) {
        console.error("Error deleting product:", error);
      } finally {
        setIsLoading(false);
        setOpenDeleteConfirmation(false);
        setProductToDelete(null);
      }
    }
  };

  const handleProductSubmit = async (values: Product) => {
    setIsLoading(true);
    try {
      if (values.id === 0) {
        const newProduct = await ProductService.createProduct({
          title: values.title,
          price: values.price,
          description: values.description,
          images: values.images,
          category: values.category,
          categoryId: values.category.id,
        });
        dispatch(addProduct(newProduct));
      } else {
        // Ensure we're sending the correct category data
        const updatedProduct = await ProductService.updateProduct({
          ...values,
          categoryId: values.category.id
        });
        
        // Update the Redux store with the complete product data from the server
        dispatch(updateProduct(updatedProduct));
        
        // Refresh the products list to ensure UI is in sync
        await dispatch(fetchProducts({}));
      }
      setOpenAddProductDialog(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error submitting product:", error);
      alert("Error updating product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePage = (event: any, newPage: React.SetStateAction<number>) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: { target: { value: string; }; }) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, products.length - page * rowsPerPage);
  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedProducts = products.slice(startIndex, endIndex);

  return (
    <>
      <DrawerHeader />
      <Typography component="h5" variant="h5" gutterBottom>
        Products
      </Typography>
      <Button 
        sx={{ mb: 1 }} 
        onClick={handleAddProduct} 
        startIcon={React.cloneElement(<AddIcon />)} 
        variant="contained"
        disabled={isLoading}
      >
        Add Product
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="products table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : paginatedProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              paginatedProducts.map((product: Product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.title}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>
                    {product.description.length > 50
                      ? `${product.description.substring(0, 50)}...`
                      : product.description
                    }
                  </TableCell>
                  <TableCell>
                    {product.images && product.images.length > 0 && (
                      <img src={product.images[0]} alt={product.title} width="50" />
                    )}
                  </TableCell>
                  <TableCell>{product.category.name}</TableCell>
                  <TableCell>
                    <IconButton 
                      onClick={() => handleEditProduct(product)}
                      disabled={isLoading}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleDeleteProduct(product.id)}
                      disabled={isLoading}
                    >
                      <DeleteForeverIcon sx={{ color: Colors.danger }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
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
        count={products.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <ProductFormDialog 
        open={openAddProductDialog} 
        setOpen={setOpenAddProductDialog} 
        selectedProduct={selectedProduct} 
        handleSubmit={handleProductSubmit}
      />
      <Dialog open={openDeleteConfirmation} onClose={() => setOpenDeleteConfirmation(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this product?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteConfirmation(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" disabled={isLoading}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default function Products() {
  return (
    <RoleBasedAccess allowedRoles={['admin', 'manager']} showAccessDenied={true}>
      <ProductsContent />
    </RoleBasedAccess>
  );
}

