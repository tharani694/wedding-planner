import { NavLink, Outlet, Link } from "react-router-dom"

// function Layout() {
//     return (
//         <div style={{padding: 20 }}>
//             <nav style={{marginBottom: 20 }}>
//                 <Link to='/' style={{marginRight: 10}} >DashBoard</Link>
//                 <Link to='/guests' style={{marginRight: 10}}>Guests</Link>
//             </nav>

//             <Outlet />
//         </div>
//     )
// }

function Layout() {
    return (
        <>
        <NavLink 
            to="/" 
            style={({ isActive }) => ({ 
                marginRight: 10, 
                fontWeight: isActive ? "bold" : "normal" 
            })}
            >
            Dashboard
        </NavLink>
        <NavLink
            to="guests" 
            style={({ isActive }) => ({ 
                marginRight: 10, 
                fontWeight: isActive ? "bold" : "normal" 
            })}
            >
            Guests
        </NavLink>
        <Link to="/budget" style={{ marginRight: 10 }}>Budget</Link>
        <NavLink
            to="marketplace"
            style={({ isActive }) => ({
                marginRight: 10,
                fontWeight: isActive ? 'bold' : 'normal',
            })}>
        Vendor Market
        </NavLink>
        <NavLink
            to="vendors" 
            style={({ isActive }) => ({ 
                marginRight: 10, 
                fontWeight: isActive ? "bold" : "normal" 
            })}
            >
            Vendors
        </NavLink>
        <Outlet />
        </>
    )
}

export default Layout