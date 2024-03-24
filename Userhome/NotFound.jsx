import { Player } from '@lottiefiles/react-lottie-player'
import React from 'react'
import notfound from '../../../imgs/noproductfound.json'
import { Button, Col, Row } from 'antd'
import { useNavigate } from 'react-router-dom'
import { Refresh } from '@mui/icons-material'

const NotFound = () => {
    const navigate = useNavigate()

    const handleClick = () => {
     navigate(-1)
    }

  return (
    <div style={{backgroundColor:'#FFF5F5', paddingTop:'4px'}}>
        <Row style={{textAlign: 'center', alignItems: 'center', justifyContent: 'center', height: '100vh',width:'100vw' }}>
            <Col span={24} >
        <Player
        style={{ height: '300px', width: '300px',marginTop: '25px', marginBottom: '-20px' }}
        autoplay
        src="https://lottie.host/070f29cc-5d37-490e-8daa-7cfce5658b5a/QWebwEn1oU.json"
        loop
        ></Player><h1 style={{color:'#ED5945'}}>No Results Found</h1></Col>
        <Button style={{marginTop: '-200px'}} type="primary" danger onClick={handleClick} >Go Back</Button>
        {/* onClick={() => navigate(-1)} */}
        </Row>
        </div>
  )
}

export default NotFound;