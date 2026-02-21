import { useQuery } from "@apollo/client";
import VendorForm from "./VendorForm";
import VendorList from "./VendorList";
import { GET_BUDGET, GET_VENDORS } from "../../graphql/queries";
import '../style.css'
const VendorPage = () => {
    const { data: budgetData } = useQuery(GET_BUDGET)
    const { data, loading, error } = useQuery(GET_VENDORS);


    if (loading) return <p>Loading vendors...</p>;
    if (error) return <p>Error loading vendors</p>;


    const categories = budgetData?.budget?.categories || [];
    const vendors = data?.vendors || [];

    return (
      <div className="vendor-page">
        <h2>Vendors</h2>
        <div className="vendor-grid">
          <VendorForm categories={categories} />
          <VendorList vendors={vendors} categories={categories} />
        </div>
      </div>
    );
    }

export default VendorPage
