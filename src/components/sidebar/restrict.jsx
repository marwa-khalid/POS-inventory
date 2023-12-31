import React from "react";
import '../css/restrict.css';

const RestrictedAccessMessage = () => {
  return (
    <div className="overlay">
      <div className="message">
        <h2>Access Denied</h2>
        <p>Only administrators have access to this page.</p>
      </div>
    </div>
  );
};

export default RestrictedAccessMessage;
