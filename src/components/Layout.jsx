import { NavLink, Outlet } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { NAV_STATS_QUERY } from "../graphql/queries";

function Layout() {
  const { data, loading, error } = useQuery(NAV_STATS_QUERY);

  const guestCount = data?.guests?.length || 0;
  const vendorCount = data?.vendors?.length || 0;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div style={{ padding: 20 }}>
      <nav style={{ marginBottom: 20 }}>
        <NavLink
          to="/"
          style={({ isActive }) => ({
            marginRight: 10,
            fontWeight: isActive ? "bold" : "normal",
          })}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="guests"
          style={({ isActive }) => ({
            marginRight: 10,
            fontWeight: isActive ? "bold" : "normal",
          })}
        >
          Guests ({guestCount})
        </NavLink>
        <NavLink
          to="budget"
          style={({ isActive }) => ({
            marginRight: 10,
            fontWeight: isActive ? "bold" : "normal",
          })}
        >
          Budget
        </NavLink>

        <NavLink
          to="marketplace"
          style={({ isActive }) => ({
            marginRight: 10,
            fontWeight: isActive ? "bold" : "normal",
          })}
        >
          Vendor Market
        </NavLink>

        <NavLink
          to="vendors"
          style={({ isActive }) => ({
            marginRight: 10,
            fontWeight: isActive ? "bold" : "normal",
          })}
        >
          Vendors ({vendorCount})
        </NavLink>
      </nav>

      <Outlet />
    </div>
  );
}

export default Layout