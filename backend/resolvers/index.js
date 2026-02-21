import guest from "./guest.resolver.js";
import vendor from "./vendor.resolver.js";
import budget from "./budget.resolver.js";
import vendorProfile from "./vendorProfile.resolver.js";
import event from "./event.resolver.js";

const mergeResolvers = (resolvers) => {
  const result = { Query: {}, Mutation: {} };

  for (const r of resolvers) {
    if (r.Query) Object.assign(result.Query, r.Query);
    if (r.Mutation) Object.assign(result.Mutation, r.Mutation);
    Object.keys(r).forEach(key => {
      if (!["Query", "Mutation"].includes(key)) {
        result[key] = {
          ...(result[key] || {}),
          ...r[key]
        };
      }
    });
  }
  return result;
};

export default mergeResolvers([
  event,
  guest,
  vendor,
  budget,
  vendorProfile
]);
