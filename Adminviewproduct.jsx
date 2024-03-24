import React, { useState, useEffect } from 'react';
import Adminnav from '../Adminhome/Adminnav';
import './adminviewproduct.scss';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Button } from '@mui/material';
import { Buffer } from 'buffer';
import LoadingIcons from 'react-loading-icons';
import axios from 'axios'; // Import Axios
import baseUrl from '../../../Api';

const Adminviewproduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch('http://localhost:5000/product/adminproductview/')
      .then(response => response.json())
      .then(data => {
        // Handle the fetched data
        setProducts(data || []); // Ensure data is an array or initialize as an empty array
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      });
  };

  
  const handleRemoveProduct = async (id) => {
    try {
      // Ensure that productId is defined before making the request
    
      await axios.delete(`${baseUrl}/product/premove/${id}`);
      // If deletion is successful, remove the product from the state
      setProducts(prevProducts => prevProducts.filter(product => product._id !== id));
      // Optionally, you can show a success message or perform other actions upon successful removal
    } catch (error) {
      console.error('Error removing product:', error.response.data); // Log the specific error received from the server
      // Handle error if deletion fails
      // Optionally, you can show an error message or perform other actions
    }
  };
  

  return (
    <div className='adminprolist'>
      <div className="adminprolistContainer">
        <Adminnav />
        <div>
          <h2 className='adhead'> Product View</h2>
          {loading ? (
            <div className="loading-animation">
              <LoadingIcons.BallTriangle stroke="green" />
            </div>
          ) : (
              <div className='bb'>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Image</TableCell>
                        <TableCell>Product</TableCell>
                        <TableCell>Price ₹</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Seller</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {products.map((value, index) => (
                        <TableRow key={index}>
                          <TableCell className='imgad' >
                            {value.Photo && <img src={`data:image/jpeg;base64,${value.Photo.data}`} alt="Product" />}
                          </TableCell>
                          <TableCell>{value.Productname}</TableCell>
                          <TableCell>{value.Productprice}</TableCell>
                          <TableCell>{value.Description}</TableCell>
                          <TableCell>{value.category[0]?.Categoryname || 'No Category'}</TableCell>
                          <TableCell>{value.sellerId}</TableCell>
                          <TableCell>{value.Status}</TableCell>
                          <TableCell>
                            <button onClick={() => handleRemoveProduct(value._id)} className='pr'>Remove</button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Adminviewproduct;
