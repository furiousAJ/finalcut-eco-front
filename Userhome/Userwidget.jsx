import React, { useEffect, useState } from 'react';
import "../../Sellerside/Sellerhome/widget.scss";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { Link } from 'react-router-dom';
import baseUrl from '../../../Api';
import axios from 'axios';

const Userwidget = () => {
    const [cart, setCart] = useState([]); 
    const [orders, setOrders] = useState([]);
    
    useEffect(() => {
        fetchCart();
        fetchOrders();
    }, []);

    const fetchCart = async () => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            try {
                const response = await axios.get(`${baseUrl}/cart/viewcart?userId=${userId}`);
                setCart(response.data);
            } catch (error) {
                console.error('Error fetching cart:', error);
            }
        } else {
            console.error('User ID not found in localStorage');
        }
    };

    const fetchOrders = async () => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            try {
                const response = await axios.get(`${baseUrl}/sellerview/myorder?userId=${userId}`);
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        } else {
            console.error('User ID not found in localStorage');
        }
    };

    const totalProductsInCart = cart.length;
    const totalOrders = orders.length;

    return (
        <div>
            <div className='widget'>
                <div className="widgetleft">
                    <span className="title">Cart</span>
                    <span className="counter">Total Products: {totalProductsInCart}</span>
                    <span className="link"><Link to="/cart">View All Cart<KeyboardArrowUpIcon /></Link></span>
                </div>
                <div className="widgetright">
                    <ShoppingCartOutlinedIcon className='icon34'/>
                </div>
            </div>

            <br />

            <div className='widget'>
                <div className="widgetleft">
                    <span className="title">Orders</span>
                    <span className="counter">Total Orders: {totalOrders}</span>
                    <span className="link"><Link to='/order'>My Orders<KeyboardArrowUpIcon /></Link></span>
                </div>
                <div className="widgetright">
                    <CurrencyRupeeIcon className='icon44' />
                </div>
            </div>
        </div>
    );
}

export default Userwidget;
