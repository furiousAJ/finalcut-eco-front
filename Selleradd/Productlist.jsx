import React from 'react'
import './productlist.scss'



import Sellernavbar from '../Sellerhome/Sellernavbar'
import Productview from './Productview'
import Footer from '../../Userside/Userfooter/Footer'

const Productlist = () => {
  return (
    <div>
    <div className='list'>
     
      <div className="listContainer">
        <Sellernavbar/>
        
        <Productview/>

      </div>
    </div><br></br><br></br><br></br><br></br><br></br><br></br>
    <Footer/>
    </div>
  )
}

export default Productlist