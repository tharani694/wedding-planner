const express = require("express");
const cors = require("cors");

const app = express();
const { ApolloServer } = require("apollo-server-express");
const createResolvers = require('./resolvers/index')
const typeDef = require('./schema')
const data = require('./dataStore')

app.use(cors());


const startGraphQL = async() => {
    const server = new ApolloServer({
      typeDefs: typeDef,
      resolvers: createResolvers(data),
    });
  
    await server.start();
    server.applyMiddleware({ app })
    console.log(`GraphQL ready at http://localhost:4000${server.graphqlPath}`);
  }
  
  startGraphQL();

app.listen(4000, () => {
    console.log("Backend running on http://localhost:4000");
  })



// BUDGET BLOCK

// app.get("/budget", (req, res) => {
//     res.json(budget);
//   });

// app.put("/budget/total", (req, res) => {
//     const { total } = req.body
//     budget.total = Number(total || 0)
//     res.json(budget)
// })

// app.post("/budget/categories", (req, res) => {
//     const { name, allocated } = req.body
//     if(!name) {
//         return res.status(400).json({ error: "Name cannot be empty"})
//     }

//     const category = {
//         id: Date.now(),
//         name,
//         allocated: Number(allocated || 0),
//         spent: 0
//     }

//     budget.categories.push(category)
//     res.status(201).json(category)
// }) 


// app.put("/budget/categories/:id", (req, res) => {
//     const id = Number(req.params.id)
//     budget.categories = budget.categories.map(c =>
//         c.id === id ? { ...c, ...req.body } : c
//       );
    
//     res.json({ success: true });
// })

// app.delete("/budget/categories/:id", (req, res) => {
//     const id = Number(req.params.id);
//     budget.categories = budget.categories.filter(c => c.id !== id);
//     res.sendStatus(204);
// });

// VENDOR PROFILES

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

app.get("/vendor-profiles", (req, res) => {
    const enriched = vendorProfiles.map(p => {
      if (!p.categoryId) {
        const match = budget.categories.find(c =>
          p.name.toLowerCase().includes(c.name.toLowerCase())
        );
        return { ...p, categoryId: match?.id };
      }
      return p;
    });
  
    res.json(enriched);
  })

app.post("/vendors/from-profile/:profileId", (req, res) => {
    const profileId = Number(req.params.profileId)
    const profile = vendorProfiles.find(p => p.id === profileId)

    if(!profile) return res.status(404).json({ error: "Profile not found" });

    const matchedCategory = budget.categories.find(
        c => c.name.toLowerCase() === profile.categoryName.toLowerCase()
      );    

    const vendor = {
        id: Date.now(),
        name: profile.name,
        categoryId: matchedCategory?.id,
        price: profile.price,
        status: "lead"
    }

    const exists = vendors.find(v => v.name === profile.name);
    if (exists) return res.status(400).json({ error: "Already added" });

    vendors.push(vendor)
    res.status(201).json(vendor)
})

app.post("/seed-profiles", (req, res) => {
    vendorProfiles = [
      {
        id: 1,
        name: "Elite Photography",
        categoryName: "Photography",
        categoryId: budget.categories.find(c => c.name === "Photography")?.id,
        price: 25000,
        rating: 4.8,
        tags: ["premium"],
        description: "Luxury photography"
      },
      {
        id: 2,
        name: "Royal Caterers",
        categoryName: "Food",
        categoryId: budget.categories.find(c => c.name === "Food")?.id,
        price: 500,
        rating: 4.4,
        tags: ["veg", "buffet"],
        description: "Affordable catering"
      },
      {
        id: 3,
        name: "Dream Decorators",
        categoryId: budget.categories.find(c => c.name === "Decor")?.id,
        categoryName: "Decor",
        price: 15000,
        rating: 4.6,
        tags: ["stage", "mandap", "floral"],
        description: "Beautiful wedding stage and decor setups"
      }
    ];
  
    res.json(vendorProfiles);
});


app.put("/vendors/:id", (req, res) => {
    const id = Number(req.params.id);
    const vendor = data.vendors.find(v => v.id === id);
  
    if (!vendor) return res.status(404).json({ error: "Vendor not found" });
  
    const oldStatus = vendor.status;
    const newStatus = req.body.status;

    Object.assign(vendor, req.body);
    if (oldStatus !== newStatus) {
      const category = budget.categories.find(c => c.id === vendor.categoryId);
  
      if (category) {
        if (oldStatus !== "booked" && newStatus === "booked") {
          category.spent += vendor.price;
        }
  
        if (oldStatus === "booked" && newStatus !== "booked") {
          category.spent -= vendor.price;
        }
      }
    }
  
    res.json(vendor);
  });
  