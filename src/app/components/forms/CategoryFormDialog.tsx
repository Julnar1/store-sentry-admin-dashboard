import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import { Category } from '../../categories/page';

interface CategoryFormDialogProps {
    open: boolean;
    setOpen:React.Dispatch<React.SetStateAction<boolean>>;
    selectedCategory:Category | null; 
    handleSubmit: (values: Category) => void; 
};

export const CategoryFormDialog = ({ open, setOpen, selectedCategory, handleSubmit }: CategoryFormDialogProps) => {
  const [initialValues, setInitialValues] = useState({
    id: 0, // 0 indicates a new category
    name: '',
    image: '',
  });
  useEffect(() => {
    if (selectedCategory) { // Editing: Populate with selectedCategory data
      setInitialValues({
          id: selectedCategory.id,
          name: selectedCategory.name,
          image: selectedCategory.image,
      });
  } else { // Adding: Clear the form
      setInitialValues({
          id: 0,
          name: '',
          image: '',
      });
  }
  }, [selectedCategory]);
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    image: Yup.string().required('Image URL is required'),
  });
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>{initialValues?.id === 0 ? 'Add Category' : 'Edit Category'}</DialogTitle>
      <Formik  initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
           {({ errors, touched, isValid, dirty }) => (
            <Form>
      <DialogContent>
              <Field
                as={TextField}
                autoFocus
                margin="dense"
                id="name"
                label="Name"
                type="text"
                fullWidth
                variant="standard"
                name="name"
                error={Boolean(touched.name && errors.name)}
                helperText={touched.name && errors.name}
              />
              <Field
                as={TextField}
                margin="dense"
                id="image"
                label="Image URL"
                type="text"
                fullWidth
                variant="standard"
                name="image"
                error={Boolean(touched.image && errors.image)}
                helperText={touched.image && errors.image}
              /> 
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button disabled={!(dirty && isValid)}  variant="contained" type="submit">
          {initialValues?.id === 0 ? 'Add Category' : 'Save Changes'}
        </Button>
      </DialogActions>
      </Form>
          )}
      </Formik>
    </Dialog>
  );
};
