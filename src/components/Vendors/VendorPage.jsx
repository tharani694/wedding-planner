import { useQuery } from "@apollo/client";
import VendorForm from "./VendorForm";
import VendorList from "./VendorList";
import { GET_BUDGET, GET_VENDORS } from "../../graphql/queries";

function VendorPage() {
    const { data: budgetData, loading: budgetLoading, error: budgetError } = useQuery(GET_BUDGET)
    const { data, loading, error } = useQuery(GET_VENDORS);
    if (loading) return <p>Loading vendors...</p>;
    if (error) return <p>Error loading vendors</p>;
    const budget = budgetData?.budget;
    const categories = budget?.categories || [];
    const vendors = data?.vendors || [];
    return (
        <>
        <h2>Vendors</h2>
        <VendorForm
            categories={categories}
        />
        <VendorList
            vendors={vendors}
            categories={categories}
        />
        </>
    );
    }

export default VendorPage