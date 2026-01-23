const guest = require('./guest.resolver')
const vendor = require('./vendor.resolver')
const budget = require('./budget.resolver')
const vendorProfile = require('./vendorProfile.resolver')

function mergeResolvers(resolvers) {
    const result = { Query: {}, Mutation: {} }
  
    for (const r of resolvers) {
      if (r.Query) Object.assign(result.Query, r.Query)
      if (r.Mutation) Object.assign(result.Mutation, r.Mutation)
    }
  
    return result
  }
  
  module.exports = (data) => mergeResolvers([
    guest(data),
    vendor(data),
    budget(data),
    vendorProfile(data)
])