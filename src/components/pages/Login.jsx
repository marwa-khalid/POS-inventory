import React, { useState } from 'react';
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBCheckbox
} from 'mdb-react-ui-kit';
import '../css/login.css';
import { useDispatch } from 'react-redux';
import { login } from '../redux/UserSlice';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';

const App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  const navigate= useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if (!email) {
      window.alert('Email is required.');
      return;
    }
    if (!password) {
      window.alert('Password is required.');
      return;
    }

      const payload = {
        email,
        password,
        userType
      };
    
      await axios.post('https://pos-server-inventorysystem.up.railway.app/api/user/login', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) =>{
        localStorage.setItem("userData", JSON.stringify(response.data.user));
        dispatch(login(response.data.user));
        navigate('/Dashboard');
        console.log('Login successful');

      }).catch((err)=>{
        console.error('Login failed');
        window.alert(err);
      }); 
    }
  
  return (
    <MDBContainer className='my-5'>
      <MDBCard>
        <MDBRow className='g-0 d-flex align-items-center'>
          <MDBCol md='4'>
            <MDBCardImage src='/cart2.jpg' alt='phone' className='rounded-t-5 rounded-tr-lg-0' fluid />
          </MDBCol>
          <MDBCol md='8'>
            <h3 className="p-4 text-center">Login</h3>
            <MDBCardBody>
              <MDBInput
                wrapperClass='mb-4'
                placeholder='Email address'
                id='form1'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <MDBInput
                wrapperClass='mb-4'
                placeholder='Password'
                id='form2'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

                <div className="mb-4 d-flex float-end space-evenly ">
                <MDBCheckbox
                  name='isAdmin'
                  id='isAdminCheckbox'
                  label = "Admin"
                  value='Admin'
                  checked={userType==="Admin"}
                  onChange={(e) => setUserType(e.target.value)}
                />
                <MDBCheckbox 
                  name='isCashier'
                  id='isCashierCheckbox'
                  label = "Cashier"
                  value='Cashier'
                  checked={userType==="Cashier"}
                  onChange={(e) => setUserType(e.target.value)}
                />
              </div>

              <div className="d-flex justify-content-between mx-4 mb-4 clear-after-float">
                <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' />
                <a href="!#">Forgot password?</a>
              </div>
              <button className="mb-4 w-100" onClick={handleLogin}>
                Login
              </button>
            </MDBCardBody>
          </MDBCol>
        </MDBRow>
      </MDBCard>
    </MDBContainer>
  );
}

export default App;
