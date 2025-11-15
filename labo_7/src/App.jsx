import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Protected from "./Protected";
import CustomerList from "./components/CustomerList";
import SaleForm from "./components/SaleForm";
import SalesList from "./components/SalesList";
import SalesReport from "./components/SalesReport";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/protected" element={<Protected />} />
        <Route path="/customers" element={<CustomerList />} />
        <Route path="/sales/new" element={<SaleForm />} />
        <Route path="/sales" element={<SalesList />} />
        <Route path="/sales/report" element={<SalesReport />} /> 
      </Routes>
    </Router>
  );
};

export default App;