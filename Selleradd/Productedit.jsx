import axios from 'axios';
import React, { useEffect, useState } from 'react';
import baseUrl from '../../../Api';
import './product.scss';
import { Box, Button, TextField, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Buffer } from 'buffer';
const Productedit = (props) => {
  const [inputs, setInputs] = useState(props.data);
  const [category, setCategory] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const inputHandler = (e) => {
    const { name, value } = e.target;
    const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1); // Capitalize the first letter
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: capitalizedValue,
    }));
  };

  const handleImage = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

 // Productedit.js
const savedata = () => {
  setLoading(true);

  const formdata = new FormData();
  formdata.append('Productname', inputs.Productname);
  formdata.append('Productprice', inputs.Productprice);
  formdata.append('Cid', inputs.Cid);
  formdata.append('Status', inputs.Status);
  formdata.append('Description', inputs.Description);
 
  // Check if a new image is selected
  if (selectedImage) {
    formdata.append('Photo', selectedImage);
  }

  axios
    .put(baseUrl + `/product/editproduct/${inputs._id}`, formdata)
    .then((response) => {
      alert('Record saved');
      navigate('/products');
    })
    .catch((err) => {
      console.log('Error:', err); // Log the error to the console
      alert('Failed to update product. Please try again.'); // Show a generic error message
    })
    .finally(() => {
      setLoading(false);
    });
};

  useEffect(() => {
    axios
      .get(baseUrl + '/category/categoryview')
      .then((response) => {
        console.log(response.data);
        setCategory(response.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <div className='new'>
        <div className='newContainer'>
          <div className='top3'>
            <h1 className='tophead'>Product Edit</h1>
          </div>
          <div className='bottom'>
            <div className='left'>
              {selectedImage ? (
                <img src={URL.createObjectURL(selectedImage)} alt='Selected' className='imgupload' />
              ) : (
                <img src={inputs.Photo ? `data:image/jpeg;base64,${Buffer.from(inputs.Photo.data).toString('base64')}` : ''} alt='Product' className='imgupload' />
              )}
            </div>
            <div className='right'>
              <div className='alignform'>
                <Box
                  component='form'
                  sx={{
                    '& .MuiTextField-root': { m: 1.6, width: '30ch' },
                  }}
                  noValidate
                  autoComplete='off'
                >
                  <div className='filephoto'>
                  &nbsp;&nbsp;&nbsp;Product Name with quantity kg / g / L :
                  <br />
                  <TextField
                    placeholder='eg:Apple 500g'
                    type='text'
                    name='Productname'
                    value={inputs.Productname}
                    onChange={inputHandler}
                  />
                  <br />
                  <br /> &nbsp;&nbsp;&nbsp;Category:
                  <br /> &nbsp;&nbsp;&nbsp;
                  <select className='boxcategory' name='Cid' value={inputs.Cid} onChange={inputHandler}>
  {category.map((value, index) => {
    return (
      <option key={index} value={value._id}>
        {value.Categoryname}
      </option>
    );
  })}
</select>

                  <br />
                  <br></br> &nbsp;&nbsp;&nbsp;Price ₹:
                  <br />
                  <TextField
                    id='Price'
                    placeholder='eg:100'
                    type='number'
                    name='Productprice'
                    value={inputs.Productprice}
                    onChange={inputHandler}
                  />
                  
                  <br></br> &nbsp;&nbsp;&nbsp;Description:
                  <br /> &nbsp;&nbsp;&nbsp;
                  <textarea
                    id='Description'
                    label='Three ore four word'
                    className='boxcategory'
                    type='text'
                    name='Description'
                    rows='3'
                    value={inputs.Description}
                    onChange={inputHandler}
                  />
                    <br /> &nbsp;&nbsp;&nbsp;
                    <label htmlFor='file'>Image: </label>
                    <br /> &nbsp;&nbsp;&nbsp;
                    <input type='file' className='icon' onChange={handleImage} />
                    <br />
                    <br /> &nbsp;&nbsp;&nbsp;Status:<br /> &nbsp;&nbsp;&nbsp;
                    <select className='boxact' name='Status' value={inputs.Status} onChange={inputHandler}>
                      <option value='Active'>Active</option>
                      <option value='InActive'>InActive</option>
                    </select>
                    <br />
                    <br />
                    <div className='button'>
                      {loading ? (
                        <CircularProgress />
                      ) : (
                        <>
                          <Button type='submit' variant='contained' color='success' onClick={savedata}>
                            Submit
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </Box>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Productedit;
