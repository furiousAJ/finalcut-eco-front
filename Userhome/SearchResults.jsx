import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingIcons from 'react-loading-icons';
import { MdOutlineFavorite } from 'react-icons/md';
import { FaCartPlus } from 'react-icons/fa';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import Flexdraw from './Flexdraw';
import Footer from './../Userfooter/Footer'; 
import baseUrl from '../../../Api';
import { Buffer } from 'buffer';
import NotFound from './NotFound';

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const location = useLocation();
  const [nothingFound, setNothingFound] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search).get('query');
    setSearchQuery(query);
    if (query) {
      fetchData(query);
    }
  }, [location.search]);

  const fetchData = (query) => {
    // Perform fetch operation based on the search query
    fetch(`http://localhost:5000/product/search?query=${encodeURIComponent(query)}`)
      .then(response => response.json())
      .then(data => {
        setSearchResults(data || []);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
      
  if(nothingFound){
    return (
      <div>
        <Flexdraw/>
        <NotFound/>
        <Footer/>
      </div>
    )
  }
  };
  const addToCart = (product) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found in localStorage');
      return;
    }
  
    const productDetails = {
      userId: userId,
      productId: product._id,
      sellerId:product.sellerId,
      productName: product.Productname,
      productPrice: product.Productprice,
      productDescription: product.Description,
    };
  
    axios.post(`${baseUrl}/cart/cartnew`, productDetails)
      .then(response => {
        console.log('Item added to cart:', productDetails);
        alert('Adding ...');
        navigate('/cart');
      })
      .catch(error => {
        console.error('Error adding item to cart:', error);
      });
  };
  

  const buyNow = (product) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found in localStorage');
      return;
    }
  
    const productDetails = {
      userId: userId,
      productId: product._id,
      sellerId:product.sellerId,
      productName: product.Productname,
      productPrice: product.Productprice,
      productDescription: product.Description
    };
    
    axios.post(`${baseUrl}/ordered/neworder`, productDetails)
    .then(response => {
      console.log('Ordering:', response.data);
      navigate('/oview');
    })
    .catch(error => {
      console.error('Error in Ordering', error);
    });
};
  
  return (
    
    <div>
      <Flexdraw />
      <h2>Search Results for "{searchQuery}"</h2>
      
      <div className="bodyproduct">
        <div className="grid">
          {searchResults.map((value, index) => (
            <div className="cardproduct" key={index}>
              <div className="image-container">
              {value.Photo && <img src={`data:image/jpeg;base64,${Buffer.from(value.Photo.data).toString('base64')}`} alt="Product" />}
              </div>
              <div className="content">
                <h2 className="profile-name">{value.Productname} <span> </span>
                  <span className='price'>
                    <br/>
                    Price ₹:{value.Productprice}</span> </h2>
                <p className='description'style={{ marginTop: '0.5rem' }}>
                  Description :  {value.Description}
                  <br/>
                </p>
              </div>
              <div className="cart">
                <a className="favour">
                  <MdOutlineFavorite />
                </a>
                <a className="tocart" onClick={() => addToCart(value)}>
                  <FaCartPlus />
                </a>
                <a className="buynow" onClick={() => buyNow(value)}>
                  <AiOutlineShoppingCart />
                  <br/>
                </a>
              </div>
            </div>
          ))}
        </div>
        <br/>
      </div>
      <Footer />
    </div>
  );
};

export default SearchResults;
