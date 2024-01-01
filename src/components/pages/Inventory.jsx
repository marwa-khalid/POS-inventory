import React, { useEffect, useState } from 'react';
import MUIDataTable from 'mui-datatables';
import axios from 'axios';
import EditProductModal from '../modals/EditProductModal';
import AddProductModal from '../modals/AddProductModal';
import { FaPlus } from "react-icons/fa";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState('');

  useEffect(() => {
    // Fetch products data from your backend
    const getProducts = async()=>{
      axios.get('http://localhost:5002/api/product')
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    }
    getProducts();
  }, [products]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const closeEditModal = () => {
    setShowEditModal(false);
    
  };

  const closeAddModal =()=>{
    setShowAddModal(false);
  }

  const handleEdit = (id) => {
    // Implement the edit logic for the given product ID
    console.log(`Edit product with ID: ${id}`);
    setShowEditModal(true);
    setProductId(id);
    };
    const handleAdd = () =>{
      setShowAddModal(true);
    }

  const handleDelete = (id) => {
    // Implement the delete logic for the given product ID
    console.log(`Delete product with ID: ${id}`);
    axios.delete(`http://localhost:5002/api/product/${id}`)
    .then((res)=>{
      window.alert(res.data.message);
    }).catch((err)=>{
      window.alert(err);
    })
    
  };

  const columns = [
    {
      name: '_id',
      label: 'Product ID',
      options:{
        display: 'false',
      }
    },
    {
      name: 'barCodeNo',
      label: 'Product Barcode Number',
    },    
    {
      name: 'image',
      label: 'Image',
      options: {
        customBodyRender: (value, tableMeta, updateValue) => (
          <img alt='' src={`http://localhost:5002/${value}`} style={{ width: "50px" }} />
        ),
      },
    },    
    {
      name: 'name',
      label: 'Product Name',
    },
    {
      name: 'price',
      label: 'Product Price',
    },
    {
      name: 'category', 
      label: 'Category',
    },
    {
      name: 'sizeQuantityPairs',
      label: 'Size and Quantity',
      options: {
        customBodyRender: (sizeQuantityPairs) =>(
          <div>
          {sizeQuantityPairs.map((product,index)=>(
            <div key={index}>
              Size: {product.size} &
              Quantity: {product.quantity}
            </div>
          ))}
          </div>
        )
      }
    },
    {
      name: 'action',
      label: 'Actions',
      options: {
        customBodyRender: (value, tableMeta) => (
          <div>
            <EditIcon
              className="btn-icon"
              onClick={() => handleEdit(tableMeta.rowData[0])}
            />
            <DeleteIcon
              className="btn-icon"
              onClick={() => handleDelete(tableMeta.rowData[0])}
            />
          </div>
        ),
      },
    },
  ];
  
  const options = {
    filter: true,
    responsive: 'vertical',
    rowsPerPage: 10,
    selectableRows: 'none',
    customToolbar: () => {
      return ( 
          <FaPlus onClick={handleAdd}/>          
      );
    },
  };
  

  return (
    <div>
      <MUIDataTable
        title="Product List"
        data={products}
        columns={columns}
        options={options}
      />
      
      <EditProductModal show={showEditModal} onHide={closeEditModal} productId={productId}/>
      <AddProductModal show={showAddModal} onHide={closeAddModal} productId={productId}/>

    </div>
  );
  
};

export default Inventory;

