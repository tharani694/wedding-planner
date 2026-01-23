import { useQuery, useMutation } from "@apollo/client";
import { GET_VENDORS } from "../../graphql/queries";
import { DELETE_VENDOR, UPDATE_VENDOR } from "../../graphql/mutations";

function VendorList({ categories }) {
  const { data, loading, error } = useQuery(GET_VENDORS);

  const [deleteVendor] = useMutation(DELETE_VENDOR, {
    refetchQueries: [{ query: GET_VENDORS, fetchPolicy: 'network-only' }],
  });

  const [updateVendor] = useMutation(UPDATE_VENDOR, {
    refetchQueries: [{ query: GET_VENDORS, fetchPolicy: 'network-only' }],
  });

  if (loading) return <p>Loading vendors...</p>;
  if (error) return <p>Error loading vendors</p>;

  const vendors = data?.vendors || [];

  const getCategoryName = (id) =>
    categories.find((c) => c.id === id)?.name || "Unknown";

  if (!vendors.length) return <p>No Vendors yet!</p>;

  return (
    <ul>
      {vendors.map((v) => (
        <li key={v.id}>
          <strong>{v.name}</strong> - {getCategoryName(v.categoryId)} - ₹{v.price}
          <select
            value={v.status || "lead"}
            onChange={(e) =>
              updateVendor({
                variables: {
                  input: {
                    id: v.id,
                    status: e.target.value,
                  },
                },
              })
            }
            style={{ marginLeft: 10 }}
          >
            <option value="lead">Lead</option>
            <option value="contacted">Contacted</option>
            <option value="booked">Booked</option>
            <option value="paid">Paid</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button
            onClick={() =>
              deleteVendor({
                variables: { id: v.id },
              })
            }
            style={{ marginLeft: 10 }}
          >
            DELETE
          </button>
        </li>
      ))}
    </ul>
  );
}

export default VendorList;