// IncomingOrder.js

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import baseUrl from '../../../Api';
import moment from 'moment'; 
import Sellernavbar from '../Sellerhome/Sellernavbar';
import './product.scss'
import Footer from '../../Userside/Userfooter/Footer';

const Incomingorder = () => {
  const { productId } = useParams(); 
  const [orders, setOrders] = useState([]); 

  const [acceptLoading, setAcceptLoading] = useState(false);
  const [shipLoading, setShipLoading] = useState(false);
  const [completeLoading, setCompleteLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);
  
  const fetchOrders = async () => {
    const sellerId = localStorage.getItem('sellerId');
    if (sellerId) {
      try {
        const response = await axios.get(`${baseUrl}/sellerview/sellervieworder?sellerId=${sellerId}`);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    } else {
      console.error('seller ID not found in localStorage');
    }
  };
  



  const acceptOrder = async (orderId) => {
    try {
      await axios.put(baseUrl + `/sellerview/acceptorder/${orderId}`);
      fetchOrders(); // Refetch orders after accepting
    } catch (error) {
      console.error('Error accepting order:', error);
    }
  };

  const markAsShipped = async (orderId) => {
    try {
      await axios.put(baseUrl + `/sellerview/markasshipped/${orderId}`);
      fetchOrders(); // Refetch orders after marking as shipped
    } catch (error) {
      console.error('Error marking order as shipped:', error);
    }
  };

  const markAsCompleted = async (orderId) => {
    try {
      await axios.put(baseUrl + `/sellerview/markascompleted/${orderId}`);
      fetchOrders(); // Refetch orders after marking as delivered
    } catch (error) {
      console.error('Error marking order as delivered:', error);
    }
  };


  return (
  <div>
    <div className="midall">
      <Sellernavbar/>
      <br />
      <h2 className="hd">Orders</h2>
      {orders.length === 0 ? (
        <p className='nocart'>No items in the orders...!</p>
      ) : (
        <div className="cart-box">
          <table>
            <thead>
              <tr>
                {/* <th>Product Id</th> */}
                <th>User Name</th>
                <th>Product</th>
                <th>Price</th>
                <th>Needed Quantity</th>
                <th>Description</th>
                <th>Status</th>
                <th>Date</th>
                <th>User Address</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((item, index) => (
                <tr key={index}>
                  {/* <td>{item.productId}</td> */}
                  <td>{item.user.name}</td>
                  <td>{item.productName}</td>
                  <td>{item.productPrice}</td>
                  <td>{item.productQuantity}</td>
                  <td>{item.productDescription}</td>
                  <td>{item.status}</td>
                  <td>{item.orderDate}</td> 
                  <td>{item.user.address}</td> 
                  <td>


{acceptLoading && <span>Pending...</span>}
                    {!acceptLoading && item.status !== 'Accepted' && item.status !== 'Shipped' && item.status !== 'Delivered' && (
                      <button onClick={() => acceptOrder(item._id)} className='buttonseller1' >Accept</button>
                    )}

{shipLoading && <span>Pending...</span>}
                    {!shipLoading && item.status === 'Accepted' && (
                      <button onClick={() => markAsShipped(item._id)}  className='buttonseller2' >Shipped</button>
                    )}



{completeLoading && <span>Pending...</span>}
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    {item.status === 'Delivered' && (
                      <button onClick={() => markAsCompleted(item._id)}  className='buttonseller4' >Completed</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
   
    <br></br><br></br><br></br>
    <div className="bottom">
          
          </div><br></br>
    
<Footer/>
    </div>
  );
};

export default Incomingorder;
