import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, Form, InputGroup } from 'react-bootstrap';
import DatePicker from 'react-datepicker'; 
import axios from "axios";
import 'react-datepicker/dist/react-datepicker.css';

const AddPurchaseModal = ({ show, onHide}) => {

  const [warehouseName, setWarehouseName] = useState('');
  const [sizeQuantityPairs, setSizeQuantityPairs] = useState([]);
  const [purchaseDate, setPurchaseDate] = useState(new Date()); 
  const [currentSize, setCurrentSize] = useState('');
  const [currentQuantity, setCurrentQuantity] = useState('');
  const [barCodeNo, setBarCodeNo] = useState('');
  const [productName, setProductName] = useState('');
  const [unitPrice, setUnitPrice] = useState('');

  const handleAddPurchase = (event) => {
    event.preventDefault();
    const data = {
      warehouseName,
      sizeQuantityPairs,
      purchaseDate,
    };
    console.log(data);
    axios.post("https://pos-server-inventorysystem.up.railway.app/api/purchase", data)
    .then((response) => {
      onHide();
      setWarehouseName('');
      setSizeQuantityPairs([]);
      setPurchaseDate(new Date());
      setCurrentSize('');
      setCurrentQuantity('');
      setBarCodeNo('');
      setProductName('');
      setUnitPrice('');
    })
    .catch((error) => {
      window.alert(error);
    });
  }

  const handleAddSizeQuantity = () => {
    if (currentSize && currentQuantity && productName && unitPrice && barCodeNo) {
      const pair = { name: productName, unit: unitPrice, barCodeNo: barCodeNo, size: currentSize, quantity: currentQuantity ,totalAmount: (unitPrice*currentQuantity)};
      setSizeQuantityPairs([...sizeQuantityPairs, pair]);
      setCurrentSize('');
      setCurrentQuantity('');
      setBarCodeNo('');
      setProductName('');
      setUnitPrice('');
    }
  };
  
  
  return (
    <div className="container-fluid mt-5">
    
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Add Purchase</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Warehouse Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter warehouse name"
                value={warehouseName}
                onChange={(e) => setWarehouseName(e.target.value)}
              />
            </Form.Group>
            
            <Form.Group className="date-picker-container">
              <Form.Label>Purchase Date</Form.Label>
              <DatePicker
                selected={purchaseDate}
                onChange={date => setPurchaseDate(date)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Product Details</Form.Label>

              {sizeQuantityPairs.map((pair, index) => (
                <div key={index}>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Barcode No"
                      value={pair.barCodeNo}
                      onChange={(e) => {
                        const updatedSizeQuantityPairs = [...sizeQuantityPairs];
                        updatedSizeQuantityPairs[index].barCodeNo = e.target.value;
                        setSizeQuantityPairs(updatedSizeQuantityPairs);
                      }}
                    />
                    <Form.Control
                      type="text"
                      placeholder="Product Name"
                      value={pair.name}
                      onChange={(e) => {
                        const updatedSizeQuantityPairs = [...sizeQuantityPairs];
                        updatedSizeQuantityPairs[index].name = e.target.value;
                        setSizeQuantityPairs(updatedSizeQuantityPairs);
                      }}
                    />
                    <Form.Control
                      type="text"
                      placeholder="Unit Price"
                      value={pair.unit}
                      onChange={(e) => {
                        const updatedSizeQuantityPairs = [...sizeQuantityPairs];
                        updatedSizeQuantityPairs[index].unit = e.target.value;
                        setSizeQuantityPairs(updatedSizeQuantityPairs);
                      }}
                    />
                    <Form.Control
                      type="text"
                      placeholder="Size"
                      value={pair.size}
                      onChange={(e) => {
                        const updatedSizeQuantityPairs = [...sizeQuantityPairs];
                        updatedSizeQuantityPairs[index].size = e.target.value;
                        setSizeQuantityPairs(updatedSizeQuantityPairs);
                      }}
                    />
                    <Form.Control
                      type="number"
                      placeholder="Quantity"
                      value={pair.quantity}
                      onChange={(e) => {
                        const updatedSizeQuantityPairs = [...sizeQuantityPairs];
                        updatedSizeQuantityPairs[index].quantity = e.target.value;
                        setSizeQuantityPairs(updatedSizeQuantityPairs);
                      }}
                    />
                  </InputGroup>
                </div>
              ))}

            </Form.Group>
            <Form.Group>
            
              <Form.Label>Barcode No</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product barcode"
                value={barCodeNo}
                onChange={(e) => setBarCodeNo(e.target.value)}
              />

              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product Name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />                        
            
              <Form.Label>unit Price</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Unit price"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
              />

              <Form.Label>Size</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter size"
                value={currentSize}
                onChange={(e) => setCurrentSize(e.target.value)}
              />
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter quantity"
                value={currentQuantity}
                onChange={(e) => setCurrentQuantity(e.target.value)}
              />
              <Button onClick={handleAddSizeQuantity}>Add</Button>
            </Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddPurchase}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddPurchaseModal;
