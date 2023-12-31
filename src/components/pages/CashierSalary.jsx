import React, { useEffect, useState } from 'react';
import MUIDataTable from 'mui-datatables';
import axios from 'axios';
import { FaPlus } from "react-icons/fa";
import AddSalaryModal from '../modals/AddSalaryModal';

const CashierSalary = () => {
  const [salariesRecord, setSalariesRecord] = useState([]);

  useEffect(() => {
    axios.get('https://pos-server-inventorysystem.up.railway.app/api/salary')
      .then((response) => {
        setSalariesRecord(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [salariesRecord]);

  const [showAddModal, setShowAddModal] = useState(false);

  const closeAddModal =()=>{
    setShowAddModal(false);
  }
  const handleAdd =()=>{
    setShowAddModal(true);
  }

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
        name:"employeeName",
        label:"Employee Name"
    },
    {
        name:"employeeRole",
        label:"Role"
    },
    {
        name:"salary",
        label:"Salary"
    },
    {
        name:"salaryDate",
        label:"Salary Date",
        options: {
            filter: true,
            sort: true,
            customBodyRender: (value) => {
             
              const date = new Date(value);
        
            
              const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        
              return formattedDate;
            },
          },
    },
    {
        name:"contactNumber",
        label:"Contact Number"
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
        title="Cashier Salary Record"
        data={salariesRecord}
        columns={columns}
        options={options}
      />
      
      <AddSalaryModal show={showAddModal} onHide={closeAddModal}/>

    </div>
  );
  
};

export default CashierSalary;

