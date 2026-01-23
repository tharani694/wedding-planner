module.exports = (data) => ({
    Query: {
        budget: () => data.budget
    },

    Mutation: {
        updateBudgetTotal: (_, {total}) => {
            data.budget.total = Number(total || 0)
            return data.budget
        },

        addBudgetCategory: (_, { name, allocated }) => {
            if(!name) throw new Error("Name cannot be Empty")
            
            const category = {
                id: Date.now(),
                name,
                allocated: Number(allocated || 0),
                spent: 0
            }

            data.budget.categories.push(category)
            return category
        },

        updateBudgetCategory: (_, { input }) => {
            const { id, name, allocated } = input
            const updated = data.budget.categories.map(c =>
                c.id == id
                    ? {
                        ...c,
                        allocated: Number(allocated),
                        name: name ? name : c.name,
                    }
                    : c
                )
            
            data.budget.categories = updated;
            return updated.find(c => c.id === id);
        },

        deleteBudgetCategory: (_, { id }) => {
            const index = data.budget.categories.findIndex(c => c.id == id);
            if (index === -1) return null;
            const deleted = data.budget.categories[index];
            data.budget.categories.splice(index, 1);
            return deleted;
        }
    }
})