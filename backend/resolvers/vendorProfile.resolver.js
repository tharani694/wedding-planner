module.exports = (data) => ({
    Query: {
      vendorProfiles: () => {
        return data.vendorProfiles.map(p => {
          if (!p.categoryId) {
            const match = data.budget.categories.find(c =>
              p.categoryName?.toLowerCase() === c.name.toLowerCase()
            );
            return { ...p, categoryId: match?.id };
          }
          return p;
        });
      }
    },
  
    Mutation: {
      seedVendorProfiles: () => {
        data.vendorProfiles = data.vendorProfiles.map(p => ({
          ...p,
          categoryId: data.budget.categories.find(
            c => c.name === p.categoryName
          )?.id
        }));
  
        return data.vendorProfiles;
      },
  
      addVendorFromProfile: (_, { profileId }) => {
        const profile = data.vendorProfiles.find(
          p => p.id === Number(profileId)
        );
  
        if (!profile) {
          throw new Error("Profile not found");
        }
  
        const matchedCategory = data.budget.categories.find(
          c => c.name.toLowerCase() === profile.categoryName.toLowerCase()
        );
  
        const exists = data.vendors.find(v => v.name === profile.name);
        if (exists) {
          throw new Error("Vendor already added");
        }
  
        const vendor = {
          id: Date.now(),
          name: profile.name,
          categoryId: matchedCategory?.id,
          categoryName: profile.categoryName,
          price: profile.price,
          status: "lead"
        };
  
        data.vendors.push(vendor);
        return vendor;
      }
    }
  });
  