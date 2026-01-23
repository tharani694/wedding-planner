let guests = []
let vendors = []


let budget = {
    total: 0,
    categories: []
  };

const category = {
    id: Date.now(),
    name: '',
    allocated: '',
    spent: 0
}

let vendorProfiles = [
    {
      id: 1,
      name: "Elite Photography",
      categoryName: "Photography",
      price: 25000,
      rating: 4.8,
      tags: ["premium", "outdoor", "cinematic"],
      description: "Luxury wedding photography with cinematic films"
    },
    {
      id: 2,
      name: "Royal Caterers",
      categoryName: "Food",
      price: 500,
      rating: 4.3,
      tags: ["veg", "buffet", "budget"],
      description: "Affordable catering for large weddings"
    },
    {
      id: 3,
      name: "Dream Decorators",
      categoryName: "Decor",
      price: 15000,
      rating: 4.6,
      tags: ["stage", "mandap", "floral"],
      description: "Beautiful wedding stage and decor setups"
    }
];

const data = {
    guests,
    vendors,
    budget,
    vendorProfiles
}


module.exports = data;
