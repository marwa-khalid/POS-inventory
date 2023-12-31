import React, { useEffect, useState } from 'react';
import MUIDataTable from 'mui-datatables';
import axios from 'axios';
import { FaPlus } from "react-icons/fa";
import AddPurchaseModal from '../modals/AddPurchaseModal';

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    axios.get('https://pos-server-inventorysystem.up.railway.app/api/purchase')
      .then((response) => {
        setPurchases(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [purchases]);

  const [showAddModal, setShowAddModal] = useState(false);

  const closeAddModal =()=>{
    setShowAddModal(false);
  }
  const handleAdd =()=>{
    setShowAddModal(true);
  }

  const columns = [
    {
      name: '_id', 
      label: 'Purchase ID',
      options: {
        display: 'false',
      },
    },
    {
      name: 'warehouseName', 
      label: 'Warehouse Name', 
    },
    {
      name: 'sizeQuantityPairs',
      label: 'Product Barcode', 
      options: {
        customBodyRender: (sizeQuantityPairs) => (
          <div>
            {sizeQuantityPairs.map((pair, index) => (
              <div key={index}>
                 {pair.barCodeNo} 
              </div>
            ))}
          </div>
        ),
      },
    },
    {
      name: 'sizeQuantityPairs',
      label: 'Product Name', 
      options: {
        customBodyRender: (sizeQuantityPairs) => (
          <div>
            {sizeQuantityPairs.map((pair, index) => (
              <div key={index}>
                 {pair.name} 
              </div>
            ))}
          </div>
        ),
      },
    },
    {
      name: 'sizeQuantityPairs',
      label: 'Product Price', 
      options: {
        customBodyRender: (sizeQuantityPairs) => (
          <div>
            {sizeQuantityPairs.map((pair, index) => (
              <div key={index}>
                 {pair.unit} 
              </div>
            ))}
          </div>
        ),
      },
    },

    
    {
      name: 'sizeQuantityPairs', 
      label: 'Size ',
      options: {
        customBodyRender: (sizeQuantityPairs) => (
          <div>
            {sizeQuantityPairs.map((pair, index) => (
              <div key={index}>
               {pair.size} 
              </div>
            ))}
          </div>
        ),
      },
    },
    {
      name: 'sizeQuantityPairs', 
      label: 'Quantity',
      options: {
        customBodyRender: (sizeQuantityPairs) => (
          <div>
            {sizeQuantityPairs.map((pair, index) => (
              <div key={index}>
               {pair.quantity}
              </div>
            ))}
          </div>
        ),
      },
    },
    {
      name: 'sizeQuantityPairs', 
      label: 'Single Product Amount',
      options: {
        customBodyRender: (sizeQuantityPairs) => (
          <div>
            {sizeQuantityPairs.map((pair, index) => (
              <div key={index}>
               {pair.totalAmount}
              </div>
            ))}
          </div>
        ),
      },
    },
    {
      name: 'purchaseDate',
      label: 'Purchase Date', 
      options: {
        customBodyRender: (purchaseDate) => (
          <div>{new Date(purchaseDate).toLocaleDateString()}</div>
        ),
      },
    },

    {
      name: 'sizeQuantityPairs',
      label: 'Total Purchase', 
      options: {
        customBodyRender: (sizeQuantityPairs) => {
          // Calculate the sum of totalAmount values within sizeQuantityPairs
          const totalPurchase = sizeQuantityPairs.reduce((total, pair) => total + pair.totalAmount, 0);
    
          return <div>{totalPurchase}</div>;
        },
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
        title="Purchases List"
        data={purchases}
        columns={columns}
        options={options}
      />
      
      <AddPurchaseModal show={showAddModal} onHide={closeAddModal}/>

    </div>
  );
  
};

export default Purchases;

