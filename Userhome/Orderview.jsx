import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Link } from 'react-router-dom';
import baseUrl from '../../../Api';
import Flexdraw from './Flexdraw';
import Footer from '../Userfooter/Footer';

const Orderview = () => {
  const [orders, setOrders] = useState([]);
  const [deliveredLoading, setDeliveredLoading] = useState(false);

  useEffect(() => {
    fetchOrders(); // Fetch orders once on component mount
  }, []);

  const fetchOrders = async () => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      try {
        const response = await axios.get(`${baseUrl}/sellerview/myorder?userId=${userId}`);
        setOrders(response.data); // Update orders state with fetched data
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    } else {
      console.error('userID not found in localStorage');
    }
  };

  const markAsDelivered = async (orderId) => {
    try {
      await axios.put(baseUrl + `/sellerview/markasdelivered/${orderId}`);
      fetchOrders(); // Refetch orders after marking as delivered
    } catch (error) {
      console.error('Error marking order as delivered:', error);
    }
  };

  const markAsCompleted = async (orderId) => {
    try {
      await axios.put(baseUrl + `/sellerview/markascompleted/${orderId}`);
      fetchOrders(); // Refetch orders after marking as completed
    } catch (error) {
      console.error('Error marking order as completed:', error);
    }
  };

  return (
    <div className="midall">
      <Flexdraw />
      <br />
      <h2 className="hd">My Orders</h2>
      {orders.length === 0 ? (
        <p className='nocart'>No items in the orders...!</p>
      ) : (
        <div className="cart-box">
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Description</th>
                <th>Status</th>
                <th>Date</th>
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
                  <td>{item.productQuantity}</td>
                  <td>{item.productDescription}</td>
                  <td>{item.status}</td>
                  <td>{moment(item.orderDate).format('MMMM Do YYYY, h:mm:ss a')}</td>

                  <td>
                    {deliveredLoading && <span>Pending...</span>}
                    {item.status === 'Shipped' && (
                      <button onClick={() => markAsDelivered(item._id)} className='buttonseller3'>Delivered</button>
                    )}
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    {item.status === 'Delivered' && (
                      <button onClick={() => markAsCompleted(item._id)} className='buttonseller4'>Completed</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="homefooterbottom"></div>
      <br></br> <br></br> <br></br> <br></br> <br></br> <br></br> 
      <Footer />
    </div>
  );
};

export default Orderview;
