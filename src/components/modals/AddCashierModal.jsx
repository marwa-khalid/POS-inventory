import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import '../css/AddCashierModal.css';
import axios from 'axios';

function AddCashierModal( {onHide, show}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setfullName] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      email: email,
      password: password,
      fullName: fullName,
    };

    axios
      .post('http://localhost:5002/api/user/register', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        console.log(data);
        console.log('data entered Successful');
        window.alert(response.data.message);
        onHide();
        setEmail('');
        setPassword('');
        setfullName('');
        
      })
      .catch((error) => {
        window.alert(error);
      });
  };

  return (
    <div className="signup-container">
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton >
          <Modal.Title>Sign Up</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
           
          <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder='Enter name'
                value={fullName}
                onChange={(event) => setfullName(event.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email:</Form.Label>
              <Form.Control
                type="email"
                placeholder='Enter Email'
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                placeholder='Enter password'
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </Form.Group>
           
            <Button variant="primary" type="submit" className="mt-3 float-end">
              Add
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default AddCashierModal;
