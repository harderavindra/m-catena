import React, { useContext } from 'react'
import {AuthContext}  from '../../contexts/AuthContext'
const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div>
      <h2>Welcome, {user?.firstName} {user?.lastName}!</h2>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>

      <button onClick={logout} >
        Sign Out
      </button>
    </div>
  );
};


export default Dashboard