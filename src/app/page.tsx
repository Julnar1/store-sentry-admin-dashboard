"use client";
import { useEffect, useState } from "react";
import { 
  Card, 
  Grid, 
  Typography, 
  Box, 
  CircularProgress, 
  Divider, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert
} from "@mui/material";
import { DrawerHeader } from "./components/layout/NavDrawer";
import { useAppDispatch, useAppSelector } from "./redux/store/store";
import { fetchProducts } from "./redux/features/products-slice";
import { fetchCategories } from "./redux/features/categories-slice";
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Colors } from "./components/common/AppThemeProvider";
import { RoleBasedAccess } from "./components/RoleBasedAccess";

export default function Home() {
  const dispatch = useAppDispatch();
  const { products, status: productsStatus } = useAppSelector((state) => state.products);
  const { categories, status: categoriesStatus } = useAppSelector((state) => state.categories);
  const { user, isLoggedIn } = useAppSelector((state) => state.user);
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [categoryDistribution, setCategoryDistribution] = useState<any[]>([]);

  useEffect(() => {
    // Fetch data when component mounts or when user navigates back to dashboard
    dispatch(fetchProducts({}));
    dispatch(fetchCategories());
  }, [dispatch]);

  // Add a second useEffect to refresh data when window regains focus
  useEffect(() => {
    const handleFocus = () => {
      // Refresh data when window regains focus
      dispatch(fetchProducts({}));
      dispatch(fetchCategories());
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [dispatch]);

  useEffect(() => {
    if (products.length > 0) {
      // Get the 5 most recent products
      const recent = [...products].sort((a, b) => b.id - a.id).slice(0, 5);
      setRecentProducts(recent);
      
      // Calculate category distribution
      const distribution = categories.map(category => {
        const count = products.filter(product => product.category.id === category.id).length;
        return {
          name: category.name,
          count,
          percentage: products.length > 0 ? (count / products.length * 100).toFixed(1) : 0
        };
      });
      setCategoryDistribution(distribution);
    }
  }, [products, categories]);

  const isLoading = productsStatus === 'loading' || categoriesStatus === 'loading';
  
  // Calculate average product price
  const averagePrice = products.length > 0 
    ? (products.reduce((sum, product) => sum + product.price, 0) / products.length).toFixed(2)
    : 0;
  
  // Calculate highest and lowest priced products
  const highestPricedProduct = products.length > 0 
    ? products.reduce((max, product) => product.price > max.price ? product : max)
    : null;
  
  const lowestPricedProduct = products.length > 0 
    ? products.reduce((min, product) => product.price < min.price ? product : min)
    : null;

  return (
    <>
      <DrawerHeader />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Welcome back, {isLoggedIn ? (user?.role === 'admin' ? 'Admin' : user?.name) : 'Guest'}
        </Typography>

        {!isLoggedIn && (
          <Alert severity="info" sx={{ mb: 3 }}>
            You are viewing the dashboard as a guest. Some features may be limited.
          </Alert>
        )}

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <InventoryIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h4" component="div">
                    {products.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Products
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <CategoryIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                  <Typography variant="h4" component="div">
                    {categories.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Categories
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <ShoppingCartIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                  <Typography variant="h4" component="div">
                    ${products.reduce((sum, product) => sum + product.price, 0).toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Product Value
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <PeopleIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                  <Typography variant="h4" component="div">
                    {user?.role || 'Guest'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    User Role
                  </Typography>
                </Card>
              </Grid>
            </Grid>

            {/* Admin and Manager Only Content */}
            <RoleBasedAccess allowedRoles={['admin', 'manager']} showAccessDenied={false}>
              {/* Additional Metrics */}
              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Product Price Analysis
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <TrendingUpIcon sx={{ color: 'success.main', mr: 1 }} />
                          <Typography variant="body1">
                            Average Price: ${averagePrice}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <TrendingUpIcon sx={{ color: 'primary.main', mr: 1 }} />
                          <Typography variant="body1">
                            Highest: ${highestPricedProduct?.price.toFixed(2) || 0}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <TrendingDownIcon sx={{ color: 'error.main', mr: 1 }} />
                          <Typography variant="body1">
                            Lowest: ${lowestPricedProduct?.price.toFixed(2) || 0}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <InventoryIcon sx={{ color: 'secondary.main', mr: 1 }} />
                          <Typography variant="body1">
                            Products with Images: {products.filter(p => p.images && p.images.length > 0).length}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Category Distribution
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
      <List>
                      {categoryDistribution.map((category, index) => (
                        <ListItem key={index} divider={index < categoryDistribution.length - 1}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: Colors.primary }}>
                              <CategoryIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText 
                            primary={category.name} 
                            secondary={`${category.count} products (${category.percentage}%)`} 
                          />
                          <Chip 
                            label={`${category.percentage}%`} 
                            color={index % 2 === 0 ? "primary" : "secondary"} 
                            size="small" 
                          />
        </ListItem>
                      ))}
        </List>
        </Card>
                </Grid>
              </Grid>
            </RoleBasedAccess>

            {/* Admin Only Content */}
            <RoleBasedAccess allowedRoles={['admin']} showAccessDenied={false}>
              {/* Recent Products */}
              <Card sx={{ p: 3, mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Recent Products
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="right">Added</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell component="th" scope="row">
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {product.images && product.images.length > 0 && (
                                <Avatar 
                                  src={product.images[0]} 
                                  alt={product.title} 
                                  sx={{ width: 32, height: 32, mr: 2 }}
                                />
                              )}
                              <Typography variant="body2">
                                {product.title}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>{product.category.name}</TableCell>
                          <TableCell align="right">${product.price.toFixed(2)}</TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                              <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary">
                                ID: {product.id}
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </RoleBasedAccess>
          </>
        )}
      </Box>
    </>
  );
}

