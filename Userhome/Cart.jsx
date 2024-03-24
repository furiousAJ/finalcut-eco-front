import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import baseUrl from '../../../Api';
import Footer from '../Userfooter/Footer';
import { notification, Button } from 'antd';
import './cart.scss';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';

const Cart = () => {
  const [orders, setOrders] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (userId) {
        const response = await axios.get(`${baseUrl}/cart/viewcart?userId=${userId}`);
        const fetchedOrders = response.data.map(item => ({
          ...item,
          productQuantity: isNaN(item.productQuantity) || item.productQuantity < 1 ? 1 : item.productQuantity
        }));
        setOrders(fetchedOrders);
        calculateTotalAmount(fetchedOrders);
      } else {
        console.error('User ID not found in localStorage');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const calculateTotalAmount = (orders) => {
    const total = orders.reduce((acc, item) => acc + (item.productPrice * item.productQuantity), 0);
    setTotalAmount(total);
  };

  const removeFromCart = async (id) => {
    try {
      await axios.delete(`${baseUrl}/cart/remove/${id}`);
      const updatedOrders = orders.filter(item => item._id !== id);
      setOrders(updatedOrders);
      calculateTotalAmount(updatedOrders);
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const handleIncrement = async (id) => {
    try {
      await axios.put(`${baseUrl}/cart/increment/${id}`);
      updateOrderQuantity(id, 1);
    } catch (error) {
      console.error('Error incrementing item quantity:', error);
    }
  };

  const handleDecrement = async (id) => {
    try {
      await axios.put(`${baseUrl}/cart/decrement/${id}`);
      updateOrderQuantity(id, -1);
    } catch (error) {
      console.error('Error decrementing item quantity:', error);
    }
  };

  const updateOrderQuantity = (id, change) => {
    const updatedOrders = orders.map(order => {
      if (order._id === id) {
        const newQuantity = Math.max(Math.round(order.productQuantity + change), 1);
        return { ...order, productQuantity: newQuantity };
      }
      return order;
    });
    setOrders(updatedOrders);
    calculateTotalAmount(updatedOrders);
  };

  const sendToSellerProfile = async () => {
    try {
      for (const item of orders) {
        const requestData = { ...item };
        await axios.post(baseUrl + '/sellerview/orderseller', requestData);
        console.log('Sending order to seller:', requestData);
        notification.success({ message: 'Order placed successfully' });
      }
      await axios.delete(baseUrl + '/cart/clear');
      setOrders([]);
      setTotalAmount(0);
    } catch (error) {
      console.error('Error sending order to seller:', error);
    }
  };

  return (
    <div className="midall">
      <h2 className="hd">Cart</h2>
      {Array.isArray(orders) && orders.length === 0 ? (
        <p className='nocart'>No items in the cart...!</p>
      ) : (
        <div className="cart-box">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price ₹</th>
                <th>Quantity</th>
                <th>Description</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((item, index) => (
                <tr key={index}>
                  <td>
                    <Link to={`/products/${item.productId}`}>
                      {item.productName}
                    </Link>
                  </td>
                  <td>{item.productPrice}</td>
                  <td>
                    <div className="quantity-control">
                      <MinusOutlined onClick={() => handleDecrement(item._id)} style={{ cursor: 'pointer' }} />
                      <span>{item.productQuantity}</span>
                      <PlusOutlined onClick={() => handleIncrement(item._id)} style={{ cursor: 'pointer' }} />
                    </div>
                  </td>
                  <td>{item.productDescription}</td>
                  <td>{item.status}</td>
                  <td>
                    <button className='removebutton' onClick={() => removeFromCart(item._id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="total-amount">
        Total Amount: ₹{totalAmount}
      </div>
      <Button className="proceed-button" onClick={sendToSellerProfile}>
        Proceed to Order
      </Button>
      <Footer />
    </div>
  );
};

export default Cart;
