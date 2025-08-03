import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import Contentt from '../components/Contentt';
// List 
import Shop_list from '../pages/Sales/Sales-shop/List'
import Invoice_list from '../pages/Sales/Sales-invoice/List'
import Debt_list from '../pages/Sales/Sales-debt/List'

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route Dashboard */}
        <Route path="/" element={<Dashboard />}>
          <Route index element={<Navigate to="dashboard" />} />

          <Route path="dashboard" element={<Contentt />} />
          {/* Sales */}
          {/* List */}
          <Route path='sales-shop' element={<Shop_list />} />
          <Route path='sales-invoice' element={<Invoice_list />} />
          <Route path='sales-debt' element={<Debt_list />} />

          <Route path="*" element={<Navigate to="dashboard" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
