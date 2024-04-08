const { User, Thought, Reaction } = require('../models');

const db = require('../config/connection');

db.once('open', async () => {
    try {
        // Delete existing data
        await User.deleteMany({});
        await Thought.deleteMany({});
        await Reaction.deleteMany({});

        // Create users
        const users = await User.create([
            { username: 'user1', email: 'user1@example.com' },
            { username: 'user2', email: 'user2@example.com' }
        ]);

        // Create thoughts
        const thoughts = await Thought.create([
            { thoughtText: 'Thought 1', username: users[0].username },
            { thoughtText: 'Thought 2', username: users[1].username }
        ]);

        // Create reactions
        const reactions = await Reaction.create([
            { reactionBody: 'Reaction 1', username: users[0].username },
            { reactionBody: 'Reaction 2', username: users[1].username }
        ]);

        // Associate reactions with thoughts
        await Thought.updateOne({ thoughtText: 'Thought 1' }, { $push: { reactions: reactions[0]._id } });
        await Thought.updateOne({ thoughtText: 'Thought 2' }, { $push: { reactions: reactions[1]._id } });

        // Update users with thoughts
        await User.updateOne({ username: users[0].username }, { $push: { thoughts: thoughts[0]._id } });
        await User.updateOne({ username: users[1].username }, { $push: { thoughts: thoughts[1]._id } });

        console.log('Seed data successfully added to database.');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
});
