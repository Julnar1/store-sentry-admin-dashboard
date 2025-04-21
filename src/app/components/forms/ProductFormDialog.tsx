"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  MenuItem,
  Select,
} from "@mui/material";
import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import { Category } from "../../categories/page";
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store/store';
import { fetchCategories } from '../../redux/features/categories-slice';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
  category: { 
    id: number;
    name?: string;
    image?: string;
};
}
interface ProductFormDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedProduct: Product | null;
  handleSubmit: (values:  any) => void;
}

export const ProductFormDialog = ({
  open,
  setOpen,
  selectedProduct,
  handleSubmit,
}: ProductFormDialogProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, status, error } = useSelector((state: RootState) => state.categories);

  useEffect(() => {
      dispatch(fetchCategories());
  }, [dispatch]);

  const getInitialValues = (): Product => { // Explicit return type for clarity
    const initial: Product = { // Type the initial object
        id: 0,
        title: "",
        price: 0,
        description: "",
        images: [""],
        category:{ id: 0, name: "", image: "" }, 
    };

    if (selectedProduct) {
        return {
            ...initial, // Spread the initial values first
            id: selectedProduct.id,
            title: selectedProduct.title,
            price: selectedProduct.price,
            description: selectedProduct.description,
            images: selectedProduct.images || [""],
            category: selectedProduct.category 
                ? {
                      id: selectedProduct.category.id,
                      name: selectedProduct.category.name,
                      image: selectedProduct.category.image,
                  }
                : { id: 0, name: "", image: "" },
        };
    }
    return initial;
};

  const [initialValues, setInitialValues] = useState<Product>(getInitialValues());
  useEffect(() => {
    setInitialValues(getInitialValues()); 
  }, [selectedProduct]);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    price: Yup.number().min(0).required("Price is required"),
    description: Yup.string().required("Description is required"),
    images: Yup.array()
        .of(
            Yup.string()
                .url('Must be a valid URL')
                .required('Image URL is required')
        )
        .min(1, 'At least one image is required'),
    category: Yup.object().shape({ // Validate the category object
      id: Yup.number().required("Category is required"),
  }),
  });
  const handleSubmitLocal = async (values: any) => {
    try {
      // Find the selected category from the categories list
      const selectedCategory = categories.find(cat => cat.id === values.category.id);
      
      // Create a complete product object with all necessary fields
      const productData = {
        ...values,
        category: {
          id: values.category.id,
          name: selectedCategory?.name || '',
          image: selectedCategory?.image || ''
        },
        categoryId: values.category.id
      };
      
      console.log('Submitting product with data:', productData);
      await handleSubmit(productData);
    } catch (error) {
      console.error('Error submitting product:', error);
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>
        {initialValues.id === 0 ? "Add Product" : "Edit Product"}
      </DialogTitle>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmitLocal}
        enableReinitialize
      >
        {({ errors,
                    touched,
                    isValid,
                    dirty,
                    isSubmitting,
                    handleChange,
                    handleBlur,
                    setFieldValue,
                    resetForm,
                    values}) => (
          <Form>
            <DialogContent>
              <Field
                as={TextField}
                autoFocus
                margin="dense"
                id="title"
                label="Title"
                type="text"
                fullWidth
                variant="standard"
                name="title"
                error={Boolean(touched.title && errors.title)}
                helperText={touched.title && errors.title}
              />
              <Field
                as={TextField}
                margin="dense"
                id="price"
                label="Price"
                type="number"
                fullWidth
                variant="standard"
                name="price"
                error={Boolean(touched.price && errors.price)}
                helperText={touched.price && errors.price}
              />
              <Field
                as={TextField}
                margin="dense"
                id="description"
                label="Description"
                type="text"
                fullWidth
                variant="standard"
                name="description"
                multiline
                rows={4}
                error={Boolean(touched.description && errors.description)}
                helperText={touched.description && errors.description}
              />
              <Field
                as={TextField}
                margin="dense"
                id="images"
                label="Images (comma-separated)"
                type="text"
                fullWidth
                variant="standard"
                name="images"
                error={Boolean(touched.images && errors.images)}
                helperText={touched.images && errors.images}
                onChange={(event: any) => {
                  console.log(event.target.value);
                  const imagesArray = event.target.value
                      .split(',')
                      .map((url: string) => url.trim())
                      .filter((url: string) => url !== '');
                  setFieldValue('images', imagesArray);
                  console.log(imagesArray);
              }}
              />
              <Field
                as={Select}
                fullWidth
                label="Category"
                name="category.id"
                id="category.id"
                error={Boolean(touched.category?.id && errors.category?.id)}
                helperText={touched.category?.id && errors.category?.id}
                onChange={(event: any) => {
                  const categoryId = parseInt(event.target.value);
                  const selectedCategory = categories.find(cat => cat.id === categoryId);
                  console.log('Selected category:', selectedCategory);
                  setFieldValue("category", {
                    id: categoryId,
                    name: selectedCategory?.name || '',
                    image: selectedCategory?.image || ''
                  });
                  // Also set the categoryId field directly
                  setFieldValue("categoryId", categoryId);
                }}
                onBlur={handleBlur}
                value={values.category.id || ""}
              >
                <MenuItem value="">Select Category</MenuItem>
                {categories.map((category:Category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Field>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button
                disabled={!(dirty && isValid) || isSubmitting}
                variant="contained"
                type="submit"
              >
                {initialValues.id === 0 ? "Add Product" : "Save Changes"}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
