import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, Form, InputGroup } from 'react-bootstrap';
import axios from "axios";

const AddProductModal = ({ show, onHide}) => {

  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState(0);
  const [productDescription, setProductDescription] = useState('');
  const [productImage, setProductImage] = useState('');
  const [productCategory, setProductCategory] = useState(''); 
  const [barCodeNo, setBarCodeNo] = useState('');
  const [sizeQuantityPairs, setSizeQuantityPairs] = useState([]);
  const [currentSize, setCurrentSize] = useState('');
  const [currentQuantity, setCurrentQuantity] = useState('');

  const [productImageSrc,setProductImageSrc] = useState(''); 

  const handleAddProduct = (event) => {
    event.preventDefault();
    
    const data = {
      name: productName,
      price: productPrice,
      description: productDescription,
      image: productImage,
      category: productCategory,
      barCodeNo: barCodeNo,
      sizeQuantityPairs: sizeQuantityPairs,
    };
    console.log(data);
    axios.post("http://localhost:5002/api/product/AddProduct", data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
    .then((response) => {
      onHide();
      setProductName('');
      setProductPrice(0);
      setProductDescription('');
      setProductImage('');
      setProductCategory('');
      setBarCodeNo('');
      setSizeQuantityPairs([]);
      setCurrentSize('');
      setCurrentQuantity('');
      setProductImageSrc('');
    })
    .catch((error) => {
      window.alert(error);
    });
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProductImage(file);

    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        setProductImageSrc(event.target.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleAddSizeQuantity = () => {
    if (currentSize && currentQuantity) {
      const pair = { size: currentSize, quantity: currentQuantity };
      setSizeQuantityPairs([...sizeQuantityPairs, pair]);
      setCurrentSize('');
      setCurrentQuantity('');
    }
  };
  

  return (
    <div className="container-fluid mt-5">
    
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Add Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
          
          <Form.Group>
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product barcode Number"
                value={barCodeNo}
                onChange={(e) => setBarCodeNo(e.target.value)}
              />
            </Form.Group>


            <Form.Group>
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Product Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter product price"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Product Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product description"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Product Image</Form.Label>
              <Form.Control
                type="file"
                onChange={handleImageChange}
              />
            </Form.Group>

            {productImage && (
              <div>
                <Form.Label>Selected Image Preview:</Form.Label>
                <img src={productImageSrc} alt="Selected Image" style={{ maxWidth: '50px', maxHeight: '50px' }} />
              </div>
            )}

            <Form.Group>
              <Form.Label>Sizes and Quantities</Form.Label>
              {sizeQuantityPairs.map((pair, index) => (
                <div key={index}>
                  <InputGroup>
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

            <Form.Group>
              <Form.Label>Product Category</Form.Label>
              <InputGroup >
                <Form.Check
                  type="radio"
                  label="Pants"
                  name="productCategory"
                  className='me-3'
                  id="pants"
                  value="pants"
                  onChange={(e) => setProductCategory(e.target.value)}
                />
                <Form.Check
                  type="radio"
                  className='me-3'
                  label="Casual Shirts"
                  name="productCategory"
                  id="casualShirts"
                  value="casual shirts"
                  onChange={(e) => setProductCategory(e.target.value)}
                />
                <Form.Check
                  type="radio"
                  label="T-Shirts"
                  className='me-3'
                  name="productCategory"
                  id="tshirts"
                  value="t-shirts"
                  onChange={(e) => setProductCategory(e.target.value)}
                />
                <Form.Check
                  type="radio"
                  label="Hoodie"
                  name="productCategory"
                  className='me-3'
                  id="hoodie"
                  value="hoodie"
                  onChange={(e) => setProductCategory(e.target.value)}
                />
              </InputGroup>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddProduct}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddProductModal;
