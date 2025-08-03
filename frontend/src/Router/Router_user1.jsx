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

          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
