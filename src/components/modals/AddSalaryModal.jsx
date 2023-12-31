import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker'; 
import axios from "axios";
import 'react-datepicker/dist/react-datepicker.css';

const AddSalaryModal = ({ show, onHide }) => {
  const [employeeName, setEmployeeName] = useState('');
  const [employeeRole, setEmployeeRole] = useState('');
  const [salary, setSalary] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [salaryDate, setSalaryDate] = useState(new Date()); 

  const handleAddPurchase = (event) => {
    event.preventDefault();
    const employeeData = {
      employeeName,
      salary,
      contactNumber,
      salaryDate,
      employeeRole
    };
    axios.post("https://pos-server-inventorysystem.up.railway.app/api/salary", employeeData)
    .then((response) => {
      onHide();
      setEmployeeName('');
      setEmployeeRole('');
      setSalary('');
      setContactNumber('');
      setSalaryDate(new Date());
    })
    .catch((error) => {
      window.alert(error);
    });
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add Employee</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Employee Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter employee name"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Employee Role</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter employee role"
              value={employeeRole}
              onChange={(e) => setEmployeeRole(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Salary</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter salary"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Contact Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter contact number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="date-picker-container">
              <Form.Label>Salary Date</Form.Label>
              <DatePicker
                selected={salaryDate}
                onChange={date => setSalaryDate(date)}
              />
            </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleAddPurchase}>
          Add Salary Record
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddSalaryModal;
