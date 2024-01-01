import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import InvoiceModal from "./Invoice";
import CustomerInfoForm from "../modals/CustomerInfoModal";
import '../css/print.css';
import axios from 'axios';
import { FaPlus } from "react-icons/fa";
// import useScanDetection from 'use-scan-detection'
import BarcodeReader from 'react-barcode-reader';
import {
  addToCart,
  decreaseCart,
  removeFromCart,
  incrementCart,
  getTotals,
  clearCart,
  updateSizeInCart
} from '../redux/CartSlice';


import MUIDataTable from "mui-datatables";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";

const Cart = () => {

  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const [scannedBarcode, setScannedBarcode] = useState('');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showCustomerInfoForm, setShowCustomerInfoForm] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const [selectedSize, setSelectedSize] = useState('XS');
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  // useScanDetection({
  //   onComplete: setScannedBarcode
  // })
  const handleScan = (data) => {
    console.log('Barcode scanned:', data);
    setScannedBarcode(data);
  };

  

  const handleCustomerInfo = (data) => {
    setCustomerData(data); 
    console.log(data)
  };

  const handleSizeChange = (productId, newSize) => {
    // Update the Redux store with the new size
    dispatch(updateSizeInCart({productId, newSize}));
    console.log(newSize);
  };

  const closeInvoiceModal = () => {
    setShowInvoiceModal(false);
    
  };

  const closeCustomerModal = () => {
    setShowCustomerInfoForm(false);
  };

  const printReceipt = () =>{
      window.print();
  }

  const handleInvoice = () =>{
    setShowInvoiceModal(true);
  }

  const handleCustomer = () =>{
    setShowCustomerInfoForm(true);
  }

  const handleRemoveFromCart = (product) => {
    console.log(product)
    dispatch(removeFromCart(product ));
  };

  useEffect(() => {

    const fetchData = async () => {
      try {
          if (scannedBarcode) {
            
            axios.get(`http://localhost:5002/api/product/barcode/${scannedBarcode}`)
              .then((response) => {

                const productData = response.data;
                
                const existingProduct = cart.cartItems.find((item) => item.barCodeNo === productData.barCodeNo);

              if (existingProduct) {
                dispatch(incrementCart(existingProduct._id));
              } else {
                setSelectedSize(productData.sizeQuantityPairs[0].size); // Set the default size
                setSelectedQuantity(1);

                const productToAdd = { ...productData, size: selectedSize, quantity: selectedQuantity };
                dispatch(addToCart(productToAdd));
              }

              console.log(productData);
              })
              .catch((error) => {
                console.error(error);
              });
          }
        
        }catch(err){

      }
    };
    fetchData();
  }, [scannedBarcode]);


  const columns = [
    {
      name: "rowNumber", 
      label: "Sr No", 
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => (
          <span>{tableMeta.rowIndex + 1}</span>
        ),
      },
    },
    {
        name: "barCodeNo",
        label:"Barcode No",
    },
    {
      name: "image",
      label: "Image",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value) => (
          <img
            src={`http://localhost:5002/${value}`}
            alt="Product"
            style={{ width: "50px", height: "50px" }}
          />
        ),
      },
    },
    {
      name: "name",
      label: "Product",
    },
    
    {
      name: "price",
      label: "Price",
    },
    {
      name: "size", // Add size column
      label: "Size",
    },
    {
      name: "quantity", // Add quantity column
      label: "Quantity",
    },
    {
      name: "total",
      label: "Total",
    },
    {
      name: "actions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
      },
    },
  ];

  const options = {
    customToolbar: () => {
      return ( 
          <FaPlus className="addClick" style={{':hover': {
              backgroundColor: 'gray'  }
          }} onClick={handleCustomer}/>          
      );
    },
    filter: false,
    search: false,
    print: false,
    selectableRows: "none",
    responsive: "standard",
  };

  useEffect(() => {
    dispatch(getTotals());
  }, [cart, dispatch]);

  const handleIncrementQuantity = (productId) => {
    dispatch(incrementCart(productId));
    
  };

  const handleDecrementQuantity = (productId) => {
    console.log(productId)
    dispatch(decreaseCart(productId));
    
  };

  return (
    <div>
      <BarcodeReader
      onScan={handleScan}
    />
      <div id="body">
        <MUIDataTable
          title={"Cart"}
          data={cart.cartItems.map((item) => ({
            barCodeNo: item.barCodeNo,
            name: item.name,
            image: item.image,
            title: item.title,
            price: `Rs ${item.price}`,
            size: item.sizeQuantityPairs ? (
              <select className="border-0"
                value={item.sizeQuantityPairs.size}
                onChange={(e) => handleSizeChange(item._id, e.target.value)}
              >
                {item.sizeQuantityPairs.map((pair) => (
                  <option key={pair.size} value={pair.size}>
                    {pair.size}
                  </option>
                ))}
              </select>
            ) : (
              <span>Size not available</span>
            ),
            quantity: (
              <div>
                <button
                  onClick={() => handleDecrementQuantity(item._id)}
                  style={{
                    fontSize: "14px",
                    padding: "3px 10px",
                    display: "inline-block",
                    marginRight: "5px",
                    borderRadius: "15px",
                  }}
                >
                  -
                </button>
                {item.quantity}
                <button
                  onClick={() => handleIncrementQuantity(item._id)}
                  style={{
                    fontSize: "14px",
                    padding: "3px 9px",
                    display: "inline-block",
                    marginLeft: "5px",
                    borderRadius: "15px",
                  }}
                >
                  +
                </button>
              </div>
            ),
            total: `Rs ${(item.price * item.quantity)}`,
            actions: (
              <Button
                variant="contained"
                color="secondary"
                startIcon={<DeleteIcon />}
                onClick={() => handleRemoveFromCart(item)}
              >
                Remove
              </Button>
            ),
          }))}
          columns={columns}
          options={options}
        />
        {cart.cartItems.length > 0 && (
          <div className="mt-4 text-right">
            <Button
              variant="contained"
              color="secondary"
              onClick={() => dispatch(clearCart())}
            >
              Clear Cart
            </Button>
            <Button className="btn btn-primary" onClick={handleInvoice} variant="contained">
              Generate Invoice
            </Button>
          </div>
        )}
      </div>
      <CustomerInfoForm show={showCustomerInfoForm} onHide={closeCustomerModal} onCustomerInfoSubmit={handleCustomerInfo} />
      <InvoiceModal show={showInvoiceModal} onHide={closeInvoiceModal} printReceipt={printReceipt} customerData={customerData}/>
    </div>
  );
  
};

export default Cart;
