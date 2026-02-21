import { useState, useEffect } from 'react'
import './App.css'
import GuestPage from './components/Guest/GuestPage';
import VendorPage from './components/Vendors/VendorPage'
import VendorProfilesPage from "./components/VendorProfiles/VendorProfilesPage";
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import BudgetPage from "./components/Budget/BudgetPage";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  CssBaseline,
} from "@mui/material";


const App = () => {
  const [guests, setGuests] = useState([]);
  const [vendors, setVendors] = useState([])
  const [budget, setBudget] = useState({
    total: 0,
    categories: []
  });

  useEffect(() => {
    localStorage.setItem("guests", JSON.stringify(guests));
  }, [guests]);

  useEffect(() => {
    fetch("http://localhost:4000/budget")
      .then(res => res.json())
      .then(setBudget)
      .catch(err => console.error("Failed to fetch budget", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:4000/guests")
      .then((res) => res.json())
      .then(setGuests)
      .catch((err) => console.error("Failed to fetch guests", err));
  }, []);


  useEffect(() => {
    fetch("http://localhost:4000/vendors")
      .then((res) => res.json())
      .then(setVendors)
      .catch((err) => console.error("Failed to fetch vendors", err))
  }, [])

  return (
    <BrowserRouter>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Wedding Planner
          </Typography>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route
                index
                element={
                  <Dashboard
                    guests={guests}
                    vendors={vendors}
                    budget={budget}
                  />
                }
              />
              <Route 
               path="guests"
               element={
                <GuestPage />
               }
               />
              <Route
                path="budget"
                element={<BudgetPage budget={budget} setBudget={setBudget} />}
              />
              <Route path="marketplace" element={<VendorProfilesPage />} />
              <Route path="vendors" element={<VendorPage />} />
            </Route>
          </Routes>
        </Box>
      </Container>
    </BrowserRouter>
  );
}

export default App
