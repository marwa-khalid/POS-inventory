import RestrictedAccessMessage from "./components/sidebar/restrict";
import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar";
import Login from "./components/pages/Login";
import Inventory from "./components/pages/Inventory";
import Cashier from "./components/pages/Cart";
import Home from "./components/pages/Dashboard";
import Order from "./components/pages/OrderScreen";
import RegisterCashier from "./components/pages/RegisterCashier";
import Purchases from "./components/pages/Purchases";
import CashierSalary from "./components/pages/CashierSalary";
import './components/css/print.css';
import { useSelector, useDispatch } from "react-redux";
import { selectLoggedIn, login } from "./components/redux/UserSlice";
import { useEffect } from "react";
import './App.css'

function App() {
  const isLoggedIn = useSelector(selectLoggedIn);
  const user = JSON.parse(localStorage.getItem("userData"));
  const dispatch = useDispatch();

  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");

    if (storedIsLoggedIn === "true") {
      dispatch(login({ user }));
    }
  }, [user]);

  return (
    <>
      {(user && isLoggedIn) ? (
        <>
          <div className="app">
            <div id="print-hide">
              <Sidebar />
            </div>
            <div className="content">
              <Routes>
                <Route path="Dashboard" element={<Home />} />
                <Route path="Cart" element={<Cashier />} />
                <Route path="Order" element={<Order />} />

                <Route
                  path="Inventory"
                  element={
                    (user.userType === "Admin") ? (
                      <Inventory /> 
                      ): ( 
                        <RestrictedAccessMessage />
                      )
                    }
                />
                <Route
                  path="RegisterCashier"
                  element={
                    (user.userType === "Admin") ? (
                      <RegisterCashier />
                    ) : (
                      <RestrictedAccessMessage />
                    )
                  }
                />
                <Route
                  path="Purchases"
                  element={
                    (user.userType ===  "Admin") ? (
                      <Purchases /> 
                      ) : ( 
                        <RestrictedAccessMessage />
                    )
                  }
                />
                <Route
                  path="Salary"
                  element={
                    (user.userType === "Admin") ? (
                      <CashierSalary /> 
                      ) : ( 
                        <RestrictedAccessMessage />
                    )
                  }
                />
              </Routes>
            </div>
          </div>
        </>
      ) : (
        <Login />
      )}
    </>
  );
}

export default App;
