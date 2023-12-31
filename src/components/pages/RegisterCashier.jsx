import React, { useEffect, useState } from 'react';
import MUIDataTable from 'mui-datatables';
import axios from 'axios';
import AddCashierModal from '../modals/AddCashierModal';
import { FaPlus } from "react-icons/fa";
import DeleteIcon from '@mui/icons-material/Delete';

const RegisterCashier = () => {
  const [cashiers, setCashiers] = useState([]);

  useEffect(() => {
    // Fetch products data from your backend
    axios.get('https://pos-server-inventorysystem.up.railway.app/api/user') // Update the URL
      .then((response) => {
        setCashiers(response.data);
        //updateProducts(response.data); 
      })
      .catch((error) => {
        console.error(error);
      });
  }, [cashiers]);

  const [showAddModal, setShowAddModal] = useState(false);

  const closeAddModal =()=>{
    setShowAddModal(false);
  }

    const handleAdd = () =>{
      setShowAddModal(true);
    }

  const handleDelete = (id) => {
    axios.delete(`https://pos-server-inventorysystem.up.railway.app/api/user/${id}`)
    .then((res)=>{
      window.alert(res.data.message);
    }).catch((err)=>{
      window.alert(err);
    })
    
  };

  const columns = [
   {
    name:"_id",
    label:"User Id",
    options:{
        display:"false"
    }
   },
   
   
   
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
      name: 'fullName',
      label: 'Name',
    },
    {
        name: 'email',
        label: 'Email',
      },
    
    {
      name: 'action',
      label: 'Actions',
      options: {
        customBodyRender: (value, tableMeta) => (
          <div>
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
        title="Cashier List"
        data={cashiers}
        columns={columns}
        options={options}
      />
      
      <AddCashierModal show={showAddModal} onHide={closeAddModal} />
      
    </div>
  );
  
};

export default RegisterCashier;