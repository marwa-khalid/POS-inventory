import React from 'react';
import { NavLink } from 'react-router-dom';
import { logout } from '../redux/UserSlice';
import { useDispatch } from 'react-redux';

const Sidebar = () => {

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('userData');
  }

  return (
    <div className="d-flex flex-column vh-100 flex-shrink-0 p-3 text-white bg-dark " style={{ width: '230px' }}>
      <a href="/" className=" text-white mb-3 mt-4 text-decoration-none">
        <svg className=" " width="40" height="20"></svg>
        <span className="fs-4 me-0">POS System </span>
      </a>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
      <li className="nav-item">
          <NavLink to="/Dashboard" className="nav-link text-white mb-3 mt-2" activeclassname="active">
            <i className="fa fa-home"></i><span className="ms-2">Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/RegisterCashier" className="nav-link text-white mb-3" activeclassname="active">
            <i className="fa fa-dashboard"></i><span className="ms-2">Register Cashier</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/Salary" className="nav-link text-white mb-3" activeclassname="active">
            <i className="fa fa-cog"></i><span className="ms-2">Employee Salaries</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/Order" className="nav-link text-white mb-3" activeclassname="active">
            <i className="fa fa-first-order"></i><span className="ms-2">My Orders</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/Inventory" className="nav-link text-white mb-3" activeclassname="active">
            <i className="fa fa-cog"></i><span className="ms-2">Inventory</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/Purchases" className="nav-link text-white mb-3" activeclassname="active">
            <i className="fa fa-cog"></i><span className="ms-2">Purchases</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/Cart" className="nav-link text-white mb-3" activeclassname="active">
            <i className="fa fa-bookmark"></i><span className="ms-2">Cashier</span>
          </NavLink>
        </li>
      </ul>
      <hr />
      <div >
        <button className="dropdown-item p-3" onClick={handleLogout}>Logout</button>
    </div>
    </div>
  );
};

export default Sidebar;
