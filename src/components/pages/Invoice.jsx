import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Button, Modal, Table, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import {  clearCart } from '../redux/CartSlice';
import { useDispatch } from 'react-redux';
import swipe from '../../imgs/swipe.png';  
import '../css/print.css';

function Invoice({show, onHide, customerData, printReceipt}) {

  const [deliveryCharges,setDeliveryCharges] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [customerAddress,setCustomerAddress] = useState('');
  const [customerContact,setCustomerContact] = useState('');
  const [invoiceNumber,setInvoiceNumber] = useState('');
  
  const POS = 1;

  const cart = useSelector((state)=>
    state.cart
  );
  const dispatch = useDispatch();

  useEffect(()=>{
    if (customerData) {
    setCustomerName(customerData.customerName);
    setCustomerContact(customerData.customerContact);
    setCustomerAddress(customerData.customerAddress);
    }
    axios.get("https://pos-server-inventorysystem.up.railway.app/api/order")
      .then((response) => {
        const orders = response.data;
        let maxInvoiceNumber = 0;

        // Iterate through existing orders to find the highest invoice number
        orders.forEach((order) => {
          const invoiceNumber = order.invoiceNumber;
          const match = invoiceNumber.match(/swipe-(\d+)/);
          if (match) {
            const currentNumber = parseInt(match[1], 10);
            if (currentNumber > maxInvoiceNumber) {
              maxInvoiceNumber = currentNumber;
            }
          }
        });

        // Increment the invoice number
        const nextInvoiceNumber = `swipestore-${String(maxInvoiceNumber + 1).padStart(3, '0')}`;
        setInvoiceNumber(nextInvoiceNumber);
      })
  },[customerData])

  const handleSubmit = async (e) =>{
    e.preventDefault(); 
    const data = {
      customerName: customerName,
      address : customerAddress,
      contact: customerContact,
      products: cart.cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        image: item.image,
        size: item.size,
        productId : item._id
      })),
      amount: cart.cartItems.reduce((total,item)=>total + item.price*item.quantity, 0),
      invoiceNumber:invoiceNumber
    }
    
    axios.post("https://pos-server-inventorysystem.up.railway.app/api/order",data
    , {
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response)=>{
    
      printReceipt();
      window.alert("order placed");
      onHide();
      dispatch(clearCart());
    }).catch((error)=>{
     // window.alert("Failed to place order")
     window.alert(error.response.data.message)

    })
  }
   console.log(cart.cartItems);

  return (
    
      <Modal  show={show} onHide={onHide}>
        <Modal.Header closeButton className="modal-header">
          <Modal.Title>Billing Details</Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          <Form>
            <div id='invoice'>
              <div className="container" >
                <div className="row">
                  <div className="col">
                  <div className="d-flex justify-content-center">
                    <img src={swipe} alt="Swipe Store" className="img-fluid" style={{ width: 90, height: 80 }} />
                  </div>
                    {/* <h5 className="text-center">Swipe Store</h5> */}
                    <p>Invoice Number: {invoiceNumber} </p>
                    <p>Customer Name: {customerName} </p>
                    <p>Customer Contact: {customerContact} </p>
                    <p>Customer Address: {customerAddress} </p>
                    
                      <p className="col-6 mt-2 " htmlFor="deliveryCharges" >Delivery Charges</p>
                      <input
                        type="number"
                        className="col-3 p-0 border-0 border-bottom"
                        id="deliveryCharges"
                        value={deliveryCharges}
                        onChange={(e)=>setDeliveryCharges(e.target.value)}
                      />
                  </div>
                </div>

                <Table bordered className="mt-4">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Size</th>
                      <th>Unit Price</th>
                      <th>Qty</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.cartItems.map((item, index) => (
                      <tr key={index}>
                        <td>{item.name}</td>
                        <td>{item.size}</td>
                        <td>{item.price}</td>
                        <td>{item.quantity}</td>
                        <td>{(item.quantity * item.price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                <div className="row">
                  <div className='col-6'  style={{marginLeft:233}}>
                  <Table bordered className="mt-2">
                    <tbody>
                      <tr>
                        <td>Sub Total</td>
                        <td>{cart.cartItems.reduce((total, item) => total + item.price * item.quantity, 0)}</td>
                      </tr>
                      <tr>
                        <td>Shipping Charges</td>
                        <td>{deliveryCharges}</td>
                      </tr>
                      <tr>
                        <td>POS Service Fee</td>
                        <td>{POS}</td>
                      </tr>
                      <tr>
                        <td>Payable</td>
                        <td>
                          {cart.cartItems.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0) + parseFloat(deliveryCharges) + parseFloat(POS)}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                  </div>
                </div>
                <div className="row">
                  <div className='mt-4'>
                    <p>Mode of Payment: Cash on Delivery (COD)</p>
                    <p className='text-center'>THANK YOU FOR SHOPPING</p>
                    <p className='text-center'>Customer Care Contact</p>
                    <p className='text-center'>042-1234567</p>
                  </div>
                </div>
                
              </div>
            </div>
          </Form>
        </Modal.Body>
        
        <Modal.Footer className="modal-footer">
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
  );
}

export default Invoice;
