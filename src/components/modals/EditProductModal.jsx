import React, { useState ,useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal, Form, InputGroup } from 'react-bootstrap';
import axios from "axios";

const EditProductModal = ({ show, onHide, productId }) => {

  const [productName, setProductName] = useState(' '); 
  const [productPrice, setProductPrice] = useState(0); 
  const [productDescription, setProductDescription] = useState(' ');
  const [productImage, setProductImage] = useState(' ');
  const [productCategory, setProductCategory] = useState(' '); 
  const [productBarCodeNo, setProductBarCodeNo] = useState(' ');
  const [sizeQuantityPairs, setSizeQuantityPairs] = useState([ ]);
  const [newSize, setNewSize] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);


  useEffect(() => {
    fetchData();
  }, [productId]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`https://pos-server-inventorysystem.up.railway.app/api/product/${productId}`);
      const product = response.data;
  
      setProductName(product.name);
      setProductPrice(product.price);
      setProductDescription(product.description);
      setProductImage(product.image ? `https://pos-server-inventorysystem.up.railway.app/${product.image}` : '');
      setProductCategory(product.category);
      setProductBarCodeNo(product.barCodeNo);
      setSizeQuantityPairs(product.sizeQuantityPairs);
    } catch (error) {
      console.error(error);
    }
  };
  
  
  const handleEditProduct = (event) => {
    event.preventDefault();

    const data = {
      name: productName,
      price: productPrice,
      description: productDescription,
      image: selectedFile,
      category: productCategory, 
      barCodeNo:productBarCodeNo,
      sizeQuantityPairs: sizeQuantityPairs,
    };
    console.log(data)
    axios.put(`https://pos-server-inventorysystem.up.railway.app/api/product/${productId}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
    .then((response) => {
      window.alert(response.data.message);
      fetchData();
      onHide(); 
    })
    .catch((error) => {
      window.alert(error);
    });
  }


    const handleSizeChange = (index, newSize) => {
    const updatedPairs = [...sizeQuantityPairs];
    updatedPairs[index].size = newSize;
    setSizeQuantityPairs(updatedPairs);
  };

  const handleQuantityChange = (index, newQuantity) => {
    const updatedPairs = [...sizeQuantityPairs];
    updatedPairs[index].quantity = newQuantity;
    setSizeQuantityPairs(updatedPairs);
  };

  const handleAddNewPair = () => {
    if (newSize && newQuantity) {
      const newPair = { size: newSize, quantity: newQuantity };
      setSizeQuantityPairs([...sizeQuantityPairs, newPair]);
      setNewSize(''); 
      setNewQuantity('');
    }
  };
  

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>

        <Form.Group>
            <Form.Label>Product Barcode</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter product Barcode"
              value={productBarCodeNo}
              onChange={(e) => setProductBarCodeNo(e.target.value)}
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
          
          <Form.Group className="mb-3">
            <Form.Label>Product Image</Form.Label>
            <div className="input-group">
              <div className="custom-file">
              <input
                  type="file"
                  className="custom-file-input"
                  id="inputGroupFile"
                  onChange={(e) => {
                    setSelectedFile(e.target.files[0]); // Set for sending to the server
                    setProductImage(URL.createObjectURL(e.target.files[0])); // Set for preview
                  }}
                />

                <label className="custom-file-label" htmlFor="inputGroupFile">
                  {productImage ? (
                    <>
                      Selected file:
                      <img
                        src={productImage}
                        alt="Selected Image"
                        style={{ maxWidth: '50px', maxHeight: '50px' }}
                      />
                    </>
                  ) : (
                    'Choose file'
                  )}
                </label>

              </div>
            </div>
          </Form.Group>
          
          {sizeQuantityPairs ? (
            <Form.Group>
              <Form.Label>Sizes and Quantities</Form.Label>
              {sizeQuantityPairs.map((pair, index) => (
                <div key={index}>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Size"
                      value={pair.size}
                      onChange={(e) => handleSizeChange(index, e.target.value)}
                    />
                    <Form.Control
                      type="number"
                      placeholder="Quantity"
                      value={pair.quantity}
                      onChange={(e) => handleQuantityChange(index, e.target.value)}
                    />
                  </InputGroup>
                </div>
              ))}
            </Form.Group>
          ):null}

          <Form.Group>
            <Form.Label>Add New Size and Quantity</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Size"
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
              />
              <Form.Control
                type="number"
                placeholder="Quantity"
                value={newQuantity}
                onChange={(e) => setNewQuantity(e.target.value)}
              />
              <Button variant="primary" onClick={handleAddNewPair}>
                Add
              </Button>
            </InputGroup>
          </Form.Group>

          <Form.Group>
            <Form.Label>Product Category</Form.Label>
            <InputGroup >
              <Form.Check
               className='me-3'
                type="radio"
                label="Pants"
                name="productCategory"
                id="pants"
                value="pants"
                checked={productCategory === "pants"}
                onChange={(e) => setProductCategory(e.target.value)}
              />
              <Form.Check
               className='me-3'
                type="radio"
                label="Casual Shirts"
                name="productCategory"
                id="casualShirts"
                value="casual shirts"
                checked={productCategory === "casual shirts"}
                onChange={(e) => setProductCategory(e.target.value)}
              />
              <Form.Check
               className='me-3'
                type="radio"
                label="T-Shirts"
                name="productCategory"
                id="tshirts"
                value="t-shirts"
                checked={productCategory === "t-shirts"}
                onChange={(e) => setProductCategory(e.target.value)}
              />
              <Form.Check
               className='me-3'
                type="radio"
                label="Hoodie"
                name="productCategory"
                id="hoodie"
                value="hoodie"
                checked={productCategory === "hoodie"}
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
        <Button variant="primary" onClick={handleEditProduct}>
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditProductModal;
