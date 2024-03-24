import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Box, CircularProgress } from '@mui/material';

import './addproduct.scss';
import { useNavigate } from 'react-router-dom';
import baseUrl from '../../../Api';
import Sellernavbar from '../Sellerhome/Sellernavbar';
import Footer from '../../Userside/Userfooter/Footer';

const Addproduct = (props) => {
  const [category, setCategory] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [inputs, setInputs] = useState({
    Productname: '',
    Productprice: '',
    Cid: '',
    Status: 'Active',
    Description: '',
    Photo: '',
    sellerId:'',
  });

  const navigate = useNavigate();


  

  useEffect(() => {
    if (props.method === 'put' && props.data) {
      setInputs(props.data);
    }
  }, [props.method, props.data]);

  const inputHandler = (e) => {
    const { name, value } = e.target;
    const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1); // Capitalize the first letter
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: capitalizedValue,
    }));
  };


  const getSellerIdFromLocalStorage = () => {
    // Retrieve seller ID from local storage
    const sellerId = localStorage.getItem('sellerId');
    
    // Check if seller ID exists
    if (!sellerId) {
      console.error('Seller ID not found in localStorage');
      return null;
    }
    
    // Return the seller ID
    return sellerId;
  };
  

  const addHandler = () => {
    setLoading(true); // Set loading to true when submitting form
  
    setLoading(true); // Set loading to true when submitting form

  // Retrieve seller ID from local storage
  const sellerId = getSellerIdFromLocalStorage();

  // Check if sellerId is available
  if (!sellerId) {
    return; // Exit function if sellerId is not available
  }

  console.log('Seller ID retrieved from localStorage:', sellerId);
  
  
    // Set the sellerId in the FormData object
    const formData = new FormData();
    formData.append('sellerId', sellerId); // Ensure 'SellerId' matches server's expected field name
    formData.append('Productname', inputs.Productname);
    formData.append('Productprice', inputs.Productprice);
    formData.append('Cid', inputs.Cid);
    formData.append('Status', inputs.Status);
    formData.append('Description', inputs.Description);
    formData.append('Photo', selectedImage);
  
    console.log('Form Data:', formData); // Log FormData object to check the contents
  
    axios
      .post(baseUrl + '/product/productnew', formData)
      .then((response) => {
        setLoading(false); // Set loading to false after response
        alert('Record saved');
        console.log('saved', response);
        navigate('/products');
      })
      .catch((err) => {
        setLoading(false); // Set loading to false if there's an error
        console.error('Error adding product:', err);
        console.log('Error Response:', err.response.data); // Log error response
      });
  };
  

  const handleImage = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  useEffect(() => {
    axios
      .get(baseUrl + '/category/categoryview')
      .then((response) => {
        setCategory(response.data);
      })
      .catch((err) => console.error('Error fetching categories:', err));
  }, []);

  return (
    <div>
    <Sellernavbar />
    <div className="new">
      <div className="newContainer">
        <div className="top">
          <h1>Add product</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={selectedImage ? URL.createObjectURL(selectedImage) : 'https://i.ibb.co/KW8tBB8/img1.jpg'}
              alt="Not Found"
              className="imgupload"
            />
          </div>
          <div className="right">
            <div className="alignform">
              <Box
                component="form"
                sx={{
                  '& .MuiTextField-root': { m: 1.6, width: '30ch' },
                }}
                noValidate
                autoComplete="off"
              >
                <div className="filephoto">
                  &nbsp;&nbsp;&nbsp;Product Name with Quantity kg / g / L:
                  <br />
                  <TextField
                    placeholder="eg:Apple 500g"
                    type="text"
                    name="Productname"
                    value={inputs.Productname}
                    onChange={inputHandler}
                  />
                  <br />
                  <br />
                  &nbsp;&nbsp;&nbsp;Category:
                  <br />
                  &nbsp;&nbsp;&nbsp;
                  <select
                    className="boxcategory"
                    name="Cid"
                    value={inputs.Cid}
                    onChange={inputHandler}
                  >
                    {category.map((value, index) => (
                      <option key={index} value={value._id}>
                        {value.Categoryname}
                      </option>
                    ))}
                  </select>
                  <br />
                  <br />
                  &nbsp;&nbsp;&nbsp;Price ₹:
                  <br />
                  <TextField
                    id="Price"
                    placeholder="eg:100"
                    type="number"
                    name="Productprice"
                    value={inputs.Productprice}
                    onChange={inputHandler}
                  />
                  <br />
                  <br />
                  &nbsp;&nbsp;&nbsp;Description:
                  <br />
                  &nbsp;&nbsp;&nbsp;
                  <textarea
                    id="Description"
                    className="boxcategory"
                    label="Three ore four word"
                    type="text"
                    name="Description"
                    rows="3"
                    value={inputs.Description}
                    onChange={inputHandler}
                  />
                  <br />
                  <br />
                  &nbsp;&nbsp;&nbsp;<label htmlFor="file">Image: </label>
                  <br />
                  &nbsp;&nbsp;&nbsp;<input type="file" className="icon" onChange={handleImage} />
                  <br />
                  <br />
                  &nbsp;&nbsp;&nbsp;Status:
                  <br />
                  &nbsp;&nbsp;&nbsp;
                  <select
                    className="boxact"
                    name="Status"
                    value={inputs.Status}
                    onChange={inputHandler}
                  >
                    <option value="Active">Active</option>
                    <option value="InActive">InActive</option>
                  </select>
                  <br />
                  <br />
                  <div className="button">
                    &nbsp;&nbsp;&nbsp;
                    <Button variant="contained" color="success" onClick={addHandler}>
                      {loading ? <CircularProgress size={24} /> : 'Submit'}
                    </Button>
                  </div>
                </div>
              </Box>
            </div>
          </div>
        </div>
      </div>
    </div><Footer/>
  </div>
);
};

export default Addproduct;
