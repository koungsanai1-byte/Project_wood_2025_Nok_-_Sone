import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import Contentt from '../components/Contentt';
// Import Material
// List
import Name_list from '../pages/Materials/Materials-name/List'
import Type_list from '../pages/Materials/Materials-type/List'
import Size_list from '../pages/Materials/Materials-size/List';
import Volume_list from '../pages/Materials/Materials-volume/List';
import Purchase_list from '../pages/Materials/Materials-purchase/List';
import Inventory_list from '../pages/Materials/Materials-inventory/List'
import Storages_list from '../pages/Materials/Materials-storages/List'
// Create
import Name_create from '../pages/Materials/Materials-name/Create';
import Type_create from '../pages/Materials/Materials-type/Create'
import Size_create from '../pages/Materials/Materials-size/Create'
import Volume_create from '../pages/Materials/Materials-volume/Create'
import Purchase_create from '../pages/Materials/Materials-purchase/Create'
import Inventory_create from '../pages/Materials/Materials-inventory/Create'
import Storages_create from '../pages/Materials/Materials-storages/Create'
// Update
import Name_update from '../pages/Materials/Materials-name/Update'
import Type_update from '../pages/Materials/Materials-type/Update'
import Size_update from '../pages/Materials/Materials-size/Update'
import Volume_update from '../pages/Materials/Materials-volume/Update'
import Purchase_update from '../pages/Materials/Materials-purchase/Update'
import Inventory_update from '../pages/Materials/Materials-inventory/Update'
import Storages_update from '../pages/Materials/Materials-storages/Update'

// Import Production
// List 
import Amount from '../pages/Production/Production-process/Create_amount'
import Requisition_list from '../pages/Production/Production-requisition/List'
import Process_list from '../pages/Production/Production-process/List'
import Drying_list from '../pages/Production/Production-drying/List'
import Inspection_list from '../pages/Production/Production-inspection/List'
import Improvement_list from '../pages/Production/Production-improvenment/List'
// Create
import Requisition_create from '../pages/Production/Production-requisition/Create'
import Process_create from '../pages/Production/Production-process/Create'
import Drying_create from '../pages/Production/Production-drying/Create'
import Inspection_create from '../pages/Production/Production-inspection/Create'
import Improvement_create from '../pages/Production/Production-improvenment/Create'
// Update
import Requisition_update from '../pages/Production/Production-requisition/Update'
import Process_update from '../pages/Production/Production-process/Update'
import Drying_update from '../pages/Production/Production-drying/Update'
import Inspection_update from '../pages/Production/Production-inspection/Update'
import Improvement_update from '../pages/Production/Production-improvenment/Update'
// Inventory-products
// List
import Type_products_list from '../pages/Inventory/Inventory-type/List'
import Size_products_list from '../pages/Inventory/Inventory-size/List'
import Storage_products_list from '../pages/Inventory/Inventory-storage/List'
import Products_list from '../pages/Inventory/Inventory-products/List'
// Create
import Type_products_create from '../pages/Inventory/Inventory-type/Create'
import Size_products_create from '../pages/Inventory/Inventory-size/Create'
import Storage_products_create from '../pages/Inventory/Inventory-storage/Create'
import Products_create from '../pages/Inventory/Inventory-products/Create'
// Update
import Type_products_update from '../pages/Inventory/Inventory-type/Update'
import Size_products_update from '../pages/Inventory/Inventory-size/Update'
import Storage_products_update from '../pages/Inventory/Inventory-storage/Update'
import Products_update from '../pages/Inventory/Inventory-products/Update'
// Sales
// List 
import Shop_list from '../pages/Sales/Sales-shop/List'
import Invoice_list from '../pages/Sales/Sales-invoice/List'
import Debt_list from '../pages/Sales/Sales-debt/List'

// User
// List 
import User_list from '../pages/Users/List'

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route Dasboard */}
        <Route path="/" element={<Dashboard />}>
          <Route index element={<Navigate to="/dashboard" />} />

          <Route path="dashboard" element={<Contentt />} />

          {/* Materials */}
          {/* List */}
          <Route path="materials-name" element={<Name_list />} />
          <Route path="materials-type" element={<Type_list />} />
          <Route path="materials-size" element={<Size_list />} />
          <Route path="materials-volume" element={<Volume_list />} />
          <Route path="materials-purchase" element={<Purchase_list />} />
          <Route path="materials-inventory" element={<Inventory_list />} />
          <Route path="materials-storages" element={<Storages_list />} />
          {/* Create */}
          <Route path="/name_create" element={<Name_create />} />
          <Route path='/type_create' element={<Type_create />} />
          <Route path='/size_create' element={<Size_create />} />
          <Route path='/volume_create' element={<Volume_create />} />
          <Route path='/purchase_create' element={<Purchase_create />} />
          <Route path='/Inventory_create' element={<Inventory_create />} />
          <Route path='/Inventory_create/:id' element={<Inventory_create />} />
          <Route path='/storages_create' element={<Storages_create />} />
          {/* Update */}
          <Route path='/name_update/:id' element={<Name_update />} />
          <Route path='/type_update/:id' element={<Type_update />} />
          <Route path='/size_update/:id' element={<Size_update />} />
          <Route path='/volume_update/:id' element={<Volume_update />} />
          <Route path='/purchase_update/:id' element={<Purchase_update />} />
          <Route path='/inventory_update/:id' element={<Inventory_update />} />
          <Route path='/storages_update/:id' element={<Storages_update />} />
          {/* Production */}
          {/* List */}
          <Route path='production-requisition' element={<Requisition_list />} />
          <Route path='production-process' element={<Process_list />} />
          <Route path='production-drying' element={<Drying_list />} />
          <Route path='production-inspection' element={<Inspection_list />} />
          <Route path='production-improvement' element={<Improvement_list />} />
          {/* Create */}
          <Route path='/amount' element={<Amount />} />
          <Route path='/production-requisition_create' element={<Requisition_create />} />
          <Route path='/production-process_create' element={<Process_create />} />
          <Route path='/production-process_create/:id' element={<Process_create />} />
          <Route path='/production-drying_create' element={<Drying_create />} />
          <Route path='/production-inspection_create' element={<Inspection_create />} />
          <Route path='/production-inspection_create/:id' element={<Inspection_create />} />
          <Route path='/production-improvement_create' element={<Improvement_create />} />
          <Route path='/production-improvement_create/:id' element={<Improvement_create />} />
          {/* Update */}
          <Route path='/production-requisition_update/:id' element={<Requisition_update />} />
          <Route path='/production-process_update/:id' element={<Process_update />} />
          <Route path='/production-drying_update/:id' element={<Drying_update />} />
          <Route path='/production-inspection_update/:id' element={<Inspection_update />} />
          <Route path='/production-improvement_update/:id' element={<Improvement_update />} />
          {/* Inventory */}
          {/* List */}
          <Route path='inventory-type' element={<Type_products_list />} />
          <Route path='inventory-size' element={<Size_products_list />} />
          <Route path='inventory-storage' element={<Storage_products_list />} />
          <Route path='inventory-products' element={<Products_list />} />
          {/* Create */}
          <Route path='/inventory-type_create' element={<Type_products_create />} />
          <Route path='/inventory-size_create' element={<Size_products_create />} />
          <Route path='/inventory-storage_create' element={<Storage_products_create />} />
          <Route path='/inventory-products_create' element={<Products_create />} />
          {/* Update */}
          <Route path='/inventory-type_update/:id' element={<Type_products_update />} />
          <Route path='/inventory-size_update/:id' element={<Size_products_update />} />
          <Route path='/inventory-storage_update/:id' element={<Storage_products_update />} />
          <Route path='/inventory-products_update/:id' element={<Products_update />} />
          {/* Sales */}
          {/* List */}
          <Route path='sales-shop' element={<Shop_list />} />
          <Route path='sales-invoice' element={<Invoice_list />} />
          <Route path='sales-debt' element={<Debt_list />} />
          {/* User */}
          {/* List */}
          <Route path='user' element={<User_list />} />

          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
