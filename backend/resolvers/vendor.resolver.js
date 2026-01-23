module.exports = (data) => ({
    Query: {
        vendors: () => data.vendors
    },

    Mutation: {
        addVendor: (_, { input }) => {
            if (!input.name) throw new Error("Vendor name is required");
      
            const vendor = {
              id: Date.now(),
              ...input,
              status: "lead"
            };
      
            data.vendors.push(vendor);
            return vendor;
        },

        updateVendor: (_, { input }) => {
            const id = input.id
            const status = input.status
            const vendor = data.vendors.find(v => v.id == id)
            if (!vendor) throw new Error("Vendor not found")
            const oldStatus = vendor.status
            const newStatus = status

            vendor.status = newStatus
            const category = data.budget.categories.find(c => c.id ? c.id == vendor.categoryId : c.name == vendor.categoryName)

            if (category) {
                if (oldStatus === "lead" && ["booked", "paid"].includes(newStatus)) {
                    category.spent += Number(vendor.price || 0)
                }
        
                if (oldStatus === "booked" && newStatus === "cancelled") {
                    category.spent -= Number(vendor.price || 0)
                }
            }

            return vendor
        },

        deleteVendor: (_, {id}) => {
            const vendor = data.vendors.find(v => v.id == id)
            if(!vendor) throw new Error("Vendor not found")
            console.log("Vendor", vendor)
            const index = data.vendors.findIndex(v => v.id == id)
            if(index === -1) return null
            const deleted = data.vendors[index]
            console.log("deleted", deleted)
            // data.vendor.splice(index, 1)
            console.log("Categories", data.budget.categories)

            const category = data.budget.categories.find(c => c.name == vendor.categoryName)

            console.log("Category", category)
            if(category) {
                if (["booked", "paid"].includes(vendor.status)) {
                    category.spent -= Number(vendor.price || 0)
                }
            }

            data.vendors = data.vendors.filter(v => v.id != id)
            return data.vendors
            
        }
    }
})