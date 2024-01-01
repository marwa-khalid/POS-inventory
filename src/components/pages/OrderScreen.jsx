import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import axios from 'axios';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Select, MenuItem } from "@mui/material";
import TableCell from "@mui/material/TableCell";

const OrderScreen = () => {

  const [orders, setOrders] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0); // 0 for Processing, 1 for Dispatched , 2 for returned, 3 for delivered

  useEffect(() => {
   fetchOrders();
  }, []);

  const fetchOrders = async()=>{
    
    axios.get("http://localhost:5002/api/order")
      .then(response => {
        setOrders(response.data);
      })
      .catch(error => {
        // Handle the error
      });
  }


  const handleChangeStatus = (status, productId) => {
    console.log(status);
    axios.put(`http://localhost:5002/api/order/${productId}`, { status: status }, {
  headers: {
    'Content-Type': 'application/json', 
  },
})
    .then((response)=>{
        fetchOrders();
       window.alert("updated")
    }).catch((error) =>{

    });
  };

const columns = [
  
    {
        name:"_id",
        label:"ID",
        options:{
            display:false
        }
    } , 
    
    {
        name: "rowNumber",
        label: "Order",
        options: {
          customBodyRender: (value, tableMeta) => (
            <span>{tableMeta.rowIndex + 1}</span>
          ),
        },
      },

      {
        name: "invoiceNumber",
        label: "Invoice",
      
      },
 
    {
      name: "products",
      label: "Products",
      options: {
        customBodyRender: (products) => (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {products.map((product, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={`http://localhost:5002/${product.image}`}
                    alt={product.name}
                    style={{ width: "40px", height: "40px" }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: -5,
                      right: -5,
                      width: '8px',
                      height: '8px',
                      background: '#3b3e41',
                      borderRadius: '50%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontSize: "10px",
                      color: '#fff',
                    }}
                    className="p-2">
                    {product.quantity}
                  </div>
                </div>
                <div style={{ marginLeft: '10px' }}>
                  {product.name}
                </div>
              </div>
            ))}
          </div>
        ),
      },
    },
    
    {
      name: 'products',
      label: 'Size',
      options: {
        customBodyRender: (products) =>(
          <div>
          {products.map((product,index)=>(
            <div key={index}>
              {product.size} 
             </div>
          ))}
          </div>
        )
      }
    },
    

  {
    name: "amount",
    label: "Amount",
  },
//   
{
    name: "status",
    label: "Status",
    options: {
      customBodyRender: (value, tableMeta, updateValue) => {
       
        let statusOptions;  
        if(value==="Processing"){
          statusOptions=["Processing","Dispatched","Cancelled"];
        }
        else if(value==="Dispatched"){
          statusOptions=["Dispatched","Delivered","Cancelled"];
        }
        else if(value==="Cancelled"){
          statusOptions=["Cancelled"];
        }
        else{
          statusOptions=["Delivered"]
        }
        

        return (
          <TableCell className="border-0 border-bottom">
            <Select
              value={value}
              onChange={(e) => handleChangeStatus(e.target.value, tableMeta.rowData[0])}
            >
              {statusOptions.map((options) =>(
                    <MenuItem key={options} value={options}> 
                    {options}
                    </MenuItem>
              ))}    
            </Select>
          </TableCell>
        );
      },
    },
  },
  {
    name: "address",
    label: "Address",
  },

  {
    name: "customerName",
    label: "Name",
  },

  {
    name: "contact",
    label: "Contact",
  },

  {
    name: "createdAt",
    label: "Order Date",
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
];

const options = {
  filter: true,
  search: true,
  responsive: 'vertical',
  selectableRows: "none",
  rowsPerPage: 10,
  rowsPerPageOptions: [10, 25, 50],
  
};

const filteredOrders = orders.filter(order => {
  if (selectedTab === 0) {
    return order.status === "Processing";
  } 
  if (selectedTab === 1) {
    return order.status === "Dispatched";
  }
  if (selectedTab === 2) {
    return order.status === "Cancelled";
  }
  if (selectedTab === 3){
    return order.status === "Delivered";
  }
  return 0;
});

return (
  <div >
    <Tabs
    
      value={selectedTab}
      onChange={(event, newValue) => setSelectedTab(newValue)}
      textColor="light"
      variant="fullWidth"
      classes={{ indicator: "bg-dark" }}
      style={{
        position: 'fixed',
        zIndex: 999, 
        width:"85%",
        top:0
      }}
    >
      <Tab
        label="Processing"
        style={{ backgroundColor: selectedTab === 0 ? "lightgray" : "white" }}
      />
      <Tab
        label="Dispatched"
        style={{ backgroundColor: selectedTab === 1 ? "lightgray" : "white" }}
      />
      <Tab
        label="Cancelled"
        style={{ backgroundColor: selectedTab === 2 ? "lightgray" : "white" }}
      />
      <Tab
        label="Delivered"
        style={{ backgroundColor: selectedTab === 3 ? "lightgray" : "white" }}
      />

    </Tabs>
    

    <div style={{marginTop:"48px"}}>
      <MUIDataTable 
      
        title="Orders"
        data={filteredOrders}
        columns={columns}
        options={options}
        
      />
      </div>
  </div>
);

}

export default OrderScreen;
