import { useState, useEffect, useMemo } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import GuestForm from './components/Guest/GuestForm'
import GuestList from './components/Guest/GuestList'
import VendorPage from './components/Vendors/VendorPage'
import VendorProfilesPage from "./components/VendorProfiles/VendorProfilesPage";
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import BudgetPage from "./components/Budget/BudgetPage";
import { BrowserRouter, Routes, Route } from 'react-router-dom'


function App() {
  const [guests, setGuests] = useState(() => {
    const saved = localStorage.getItem("guests");
    return saved ? JSON.parse(saved) : [];
  });


  const [vendors, setVendors] = useState([])
  const [budget, setBudget] = useState({
    total: 0,
    categories: []
  });

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

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
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetch("http://localhost:4000/guests")
      .then((res) => res.json())
      .then((data) => setGuests(data))
      .catch((err) => console.error("Failed to fetch guests", err));
  }, []);


  useEffect(() => {
    fetch("http://localhost:4000/vendors")
      .then((res) => res.json())
      .then((data) => setVendors(data))
      .catch((err) => console.error("Failed to fetch vendors", err))
  }, [])

  // const filteredGuests = guests.filter((guest) =>
  //   guest.name.toLowerCase().includes(search.toLowerCase())
  // )

  const filteredGuests = useMemo(() => {
    return guests.filter((guest) =>
      guest.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [guests, debouncedSearch]);

  // function addGuest(guest) {
  //   setGuests([...guests, guest])
  // }

  const addGuest = async(guest) => {
    const res = await fetch("http://localhost:4000/guests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(guest),
    });

    const saved = await res.json();
    setGuests((prev) => [...prev, saved]);
  }

  // function deleteGuest(id) {
  //   setGuests((prev) => prev.filter((g) => g.id !== id))
  //   console.log(guests)
  // }

  const deleteGuest = async(id) => {
    await fetch(`http://localhost:4000/guests/${id}`, {
      method: "DELETE",
    });

    setGuests((prev) => prev.filter((g) => g.id !== id));
  }

  // function updateGuest(id, updateFields) {
  //   setGuests((prev) =>
  //     prev.map((guest) =>
  //       guest.id == id ? { ...guest , ...updateFields} : guest
  //     )
  //   )
  // }

  const updateGuest = async(id, updateFields) => {
    await fetch(`http://localhost:4000/guests/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateFields),
    });

    setGuests((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updateFields } : g))
    );
  }

  const addVendorFromProfile = async (profileId) => {
    const res = await fetch(`http://localhost:4000/vendors/from-profile/${profileId}`, {
      method: "POST"
    });
  
    const newVendor = await res.json();
    setVendors(prev => [...prev, newVendor]);
  };


  return (
    <BrowserRouter>
      <h1> Wedding Planner </h1>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard guests={guests} vendors={vendors}  budget={budget}/>} />
          <Route
            path="guests"
            element={
              <>
                <h2>Add Guests</h2>
                <GuestForm onAddGuest={addGuest} />
                <h2>Guest List</h2>
                <div style={{ marginBottom: 10 }}>
                  <input
                    placeholder="Search guest by name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <GuestList
                  guests={filteredGuests}
                  onDelete={deleteGuest}
                  onUpdate={updateGuest}
                  search={debouncedSearch}
                />
              </>
            }
          />
          <Route path="budget" element={<BudgetPage budget={budget} setBudget={setBudget} />} />
          <Route
            path="marketplace"
            element={<VendorProfilesPage onAdd={addVendorFromProfile} categories={budget.categories} />}
          />
          <Route 
            path="vendors" 
            element={
              <VendorPage categories={budget.categories} />
            } 
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App


// function App() {
//   const [guests, setGuests] = useState(() => {
//     const saved = localStorage.getItem('guests')
//     return saved ? JSON.parse(saved) : []
//   })
//   const [search, setSearch] = useState("")
//   const [debouncedSearch, setDebouncedSearch] = useState("")

//   useEffect(() => {
//     localStorage.setItem("guests", JSON.stringify(guests))
//   }, [guests])

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearch(search)
//     }, 300)
//     return () => clearTimeout(timer)
//   }, [search])

//   // const filteredGuests = guests.filter((guest) => 
//   //   guest.name.toLowerCase().includes(search.toLowerCase())
//   // )

//   const filteredGuests = useMemo(() => {
//     return guests.filter((guest) => 
//       guest.name.toLowerCase().includes(debouncedSearch.toLowerCase())
//     )
//   }, [guests, debouncedSearch])

//   function addGuest(guest) {
//     setGuests([...guests, guest])
//   }

//   function deleteGuest(id) {
//     setGuests((prev) => prev.filter((g) => g.id !== id))
//     console.log(guests)
//   }

//   function updateGuest(id, updateFields) {
//     setGuests((prev) => 
//       prev.map((guest) => 
//         guest.id == id ? { ...guest , ...updateFields} : guest
//       )
//     )
//   }


//   return (
//     <>
//       <div style={{ padding: 20 }}>
//         <h1> Wedding Planner </h1>
//         <Dashboard guests={guests}/>
//         <h2> Add Guests </h2>
//         <GuestForm onAddGuest={addGuest} />
//         <div style={{ marginBottom: 10 }}>
//           <input
//             placeholder="Search guest by name..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>
//         <h2> Guest List </h2>
//         <GuestList
//           guests={filteredGuests}
//           onDelete={deleteGuest}
//           onUpdate={updateGuest}
//           search={debouncedSearch}
//         />
//       </div>
//     </>
//   );
// }

// export default App
