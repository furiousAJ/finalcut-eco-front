import React, { useState, useEffect } from 'react';
import axios from 'axios';
import baseUrl from '../../../Api';
import Footer from '../Userfooter/Footer';
import { Link } from 'react-router-dom';
import Flexdraw from './Flexdraw';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';

const Order = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${baseUrl}/ordered/vieworder`);
      const lastOrder = response.data[response.data.length - 1];
      if (lastOrder) {
        // Initialize productQuantity to 1 if it's not a valid number
        if (isNaN(lastOrder.productQuantity) || lastOrder.productQuantity < 1) {
          lastOrder.productQuantity = 1;
        }
        setSelectedOrder(lastOrder);
        calculateTotalAmount(lastOrder);
      } else {
        setSelectedOrder(null); // Set selectedOrder to null if no order is fetched
        setTotalAmount(0); // Set totalAmount to 0 if no order is fetched
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };
  

  const calculateTotalAmount = (order) => {
    if (order && typeof order.productQuantity === 'number' && !isNaN(order.productQuantity)) {
      const total = order.productPrice * order.productQuantity;
      setTotalAmount(total);
    } else {
      setTotalAmount(0);
    }
  };

  const handleIncrement = async () => {
    try {
      const updatedOrder = { ...selectedOrder };
      updatedOrder.productQuantity++;
      setSelectedOrder(updatedOrder);
      calculateTotalAmount(updatedOrder);
      // Update the order in the database
      await axios.put(`${baseUrl}/ordered/increment/${selectedOrder._id}`);
    } catch (error) {
      console.error('Error incrementing item quantity:', error);
    }
  };

  const handleDecrement = async () => {
    try {
      const updatedOrder = { ...selectedOrder };
      if (updatedOrder.productQuantity > 1) {
        updatedOrder.productQuantity--;
        setSelectedOrder(updatedOrder);
        calculateTotalAmount(updatedOrder);
        // Update the order in the database
        await axios.put(`${baseUrl}/ordered/decrement/${selectedOrder._id}`);
      }
    } catch (error) {
      console.error('Error decrementing item quantity:', error);
    }
  };

  const sendToSellerProfile = async () => {
    try {
      if (selectedOrder) {
        const requestData = { ...selectedOrder };
        await axios.post(`${baseUrl}/sellerview/orderseller`, requestData);
        console.log('Sending order to seller:', requestData);
        alert('Order placed successfully!');
        setSelectedOrder(null);
        setTotalAmount(0);
      }
    } catch (error) {
      console.error('Error sending order to seller:', error);
    }
  };

  return (
    <div className="midall">
      <Flexdraw />
      <br />
      <h2 className="hd">Orders</h2>
      {selectedOrder ? (
        <div className="cart-box">
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Description</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Link to={`/products/${selectedOrder.productId}`}>
                    {selectedOrder.productName}
                  </Link>
                </td>
                <td>{selectedOrder.productPrice}</td>
                <td>
                  <div className="quantity-control">
                    <MinusOutlined onClick={handleDecrement} style={{ cursor: 'pointer' }} />
                    <span>{selectedOrder.productQuantity}</span>
                    <PlusOutlined onClick={handleIncrement} style={{ cursor: 'pointer' }} />
                  </div>
                </td>
                <td>{selectedOrder.productDescription}</td>
                <td>{selectedOrder.status}</td>
                <td>
                  <button className="send-to-seller-button" onClick={sendToSellerProfile}>
                    Order
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="total-amount">Total Amount: ₹{totalAmount}</div>
        </div>
      ) : (
        <p className='nocart'>No items in the orders...!<br /><br /><br /></p>
      )}
      <br /><div className="homefooterbottom"></div>
      <div><br /><br /></div>
      <Footer />
    </div>
  );
};

export default Order;
