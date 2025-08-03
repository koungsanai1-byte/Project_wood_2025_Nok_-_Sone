import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import Contentt from '../components/Contentt';

// Production
import Amount from '../pages/Production/Production-process/Create_amount';
import Requisition_list from '../pages/Production/Production-requisition/List';
import Process_list from '../pages/Production/Production-process/List';
import Drying_list from '../pages/Production/Production-drying/List';
import Inspection_list from '../pages/Production/Production-inspection/List';
import Improvement_list from '../pages/Production/Production-improvenment/List';

import Requisition_create from '../pages/Production/Production-requisition/Create';
import Process_create from '../pages/Production/Production-process/Create';
import Drying_create from '../pages/Production/Production-drying/Create';
import Inspection_create from '../pages/Production/Production-inspection/Create';
import Improvement_create from '../pages/Production/Production-improvenment/Create';

import Requisition_update from '../pages/Production/Production-requisition/Update';
import Process_update from '../pages/Production/Production-process/Update';
import Drying_update from '../pages/Production/Production-drying/Update';
import Inspection_update from '../pages/Production/Production-inspection/Update';
import Improvement_update from '../pages/Production/Production-improvenment/Update';

// Inventory
import Type_products_list from '../pages/Inventory/Inventory-type/List';
import Size_products_list from '../pages/Inventory/Inventory-size/List';
import Storage_products_list from '../pages/Inventory/Inventory-storage/List';
import Products_list from '../pages/Inventory/Inventory-products/List';

import Type_products_create from '../pages/Inventory/Inventory-type/Create';
import Size_products_create from '../pages/Inventory/Inventory-size/Create';
import Storage_products_create from '../pages/Inventory/Inventory-storage/Create';
import Products_create from '../pages/Inventory/Inventory-products/Create';

import Type_products_update from '../pages/Inventory/Inventory-type/Update';
import Size_products_update from '../pages/Inventory/Inventory-size/Update';
import Storage_products_update from '../pages/Inventory/Inventory-storage/Update';
import Products_update from '../pages/Inventory/Inventory-products/Update';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Contentt />} />

          {/* Production */}
          {/* List */}
          <Route path="production-requisition" element={<Requisition_list />} />
          <Route path="production-process" element={<Process_list />} />
          <Route path="production-drying" element={<Drying_list />} />
          <Route path="production-inspection" element={<Inspection_list />} />
          <Route path="production-improvement" element={<Improvement_list />} />
          
          {/* Create */}
          <Route path="amount" element={<Amount />} />
          <Route path="production-requisition_create" element={<Requisition_create />} />
          <Route path="production-process_create" element={<Process_create />} />
          <Route path="production-process_create/:id" element={<Process_create />} />
          <Route path="production-drying_create" element={<Drying_create />} />
          <Route path="production-inspection_create" element={<Inspection_create />} />
          <Route path="production-inspection_create/:id" element={<Inspection_create />} />
          <Route path="production-improvement_create" element={<Improvement_create />} />
          <Route path="production-improvement_create/:id" element={<Improvement_create />} />

          {/* Update */}
          <Route path="production-requisition_update/:id" element={<Requisition_update />} />
          <Route path="production-process_update/:id" element={<Process_update />} />
          <Route path="production-drying_update/:id" element={<Drying_update />} />
          <Route path="production-inspection_update/:id" element={<Inspection_update />} />
          <Route path="production-improvement_update/:id" element={<Improvement_update />} />

          {/* Inventory */}
          {/* List */}
          <Route path="inventory-type" element={<Type_products_list />} />
          <Route path="inventory-size" element={<Size_products_list />} />
          <Route path="inventory-storage" element={<Storage_products_list />} />
          <Route path="inventory-products" element={<Products_list />} />

          {/* Create */}
          <Route path="inventory-type_create" element={<Type_products_create />} />
          <Route path="inventory-size_create" element={<Size_products_create />} />
          <Route path="inventory-storage_create" element={<Storage_products_create />} />
          <Route path="inventory-products_create" element={<Products_create />} />

          {/* Update */}
          <Route path="inventory-type_update/:id" element={<Type_products_update />} />
          <Route path="inventory-size_update/:id" element={<Size_products_update />} />
          <Route path="inventory-storage_update/:id" element={<Storage_products_update />} />
          <Route path="inventory-products_update/:id" element={<Products_update />} />

          {/* Redirect unknown paths */}
          <Route path="*" element={<Navigate to="dashboard" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
