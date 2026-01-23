module.exports = (data) => ({
    Query: {
      guests: () => data.guests
    },

  
    Mutation: {

    addGuest: async (_, { input }) => {
        const guest = {
            id: Date.now(),
            name: input.name,
            phone: input.phone,
            rsvp: input.rsvp
        };
        
        console.log("RETURNING GUEST:", guest);
        
        data.guests.push(guest);
        return guest;
        },
      deleteGuest: (_, { id }) => {
        data.guests = data.guests.filter(g => g.id != id)
        return true
      },
  
      updateGuest: (_, { input }) => {
        const { id, ...updates } = input;
        let updatedGuest = null;
        data.guests = data.guests.map(g => {
          if (g.id == id) {
            updatedGuest = { ...g, ...updates };
            return updatedGuest;
          }
          return g;
        });
      
        if (!updatedGuest) {
          throw new Error("Guest not found");
        }
      
        return updatedGuest;
      }
      
    }
  })