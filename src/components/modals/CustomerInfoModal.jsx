import React from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { useState } from 'react';

const CustomerInfoModal = ({ show,  onHide, onCustomerInfoSubmit }) => {
    const [customerName, setCustomerName] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [customerContact, setCustomerContact] = useState('');
      
    const handleSubmit = (e) =>{
        e.preventDefault(); 
       
        const data = {
            customerName,
            customerContact,
            customerAddress
        }
        onCustomerInfoSubmit(data);
        console.log(data)
        onHide();
        
    };

    return (
    <>
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header>
          <Modal.Title>Customer Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form >
            <div className="form-group">
              <label htmlFor="customerName">Customer Name</label>
              <input
                type="text"
                className="form-control"
                id="customerName"
                placeholder="Enter customer name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="customerAddress">Customer Address</label>
              <input
                type="text"
                className="form-control"
                id="customerAddress"
                placeholder="Enter customer address"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="customerContact">Customer Phone Number</label>
              <input
                type="text"
                className="form-control"
                id="customerContact"
                placeholder="Enter phone number"
                value={customerContact}
                onChange={(e) => setCustomerContact(e.target.value)}
              />
            </div>
            <Button variant="dark" onClick={onHide}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" onClick={handleSubmit}>
              Add Details
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
    );
  }

export default CustomerInfoModal;
