const { MongoClient } = require('mongodb');

const url = process.env.MONGO_URL || 'mongodb://localhost:27017';
const dbName = process.env.MONGO_DB_NAME || 'myproject';

let db = null;
const memoryUsers = [];

MongoClient.connect(url)
  .then((client) => {
    db = client.db(dbName);
    console.log(`connected to db server (${dbName})`);
  })
  .catch((error) => {
    console.warn(`mongodb unavailable, using in-memory store: ${error.message}`);
  });

function normalizeUser(doc) {
  return {
    ...doc,
    balance: Number(doc.balance) || 0,
  };
}

async function create(name, email, password, balance) {
  const user = normalizeUser({ name, email, password, balance });

  if (db) {
    const collection = db.collection('users');
    await collection.insertOne(user);
    return user;
  }

  memoryUsers.push(user);
  return user;
}

async function update(email, amount) {
  const parsedAmount = Number(amount) || 0;

  if (db) {
    const collection = db.collection('users');
    const result = await collection.findOneAndUpdate(
      { email },
      { $inc: { balance: parsedAmount } },
      { returnDocument: 'after' }
    );
    return result.value;
  }

  const user = memoryUsers.find((item) => item.email === email);
  if (!user) return null;

  user.balance += parsedAmount;
  return user;
}

async function all() {
  if (db) {
    return db.collection('users').find({}).toArray();
  }

  return memoryUsers;
}

async function findOne(email) {
  if (db) {
    return db.collection('users').findOne({ email });
  }

  return memoryUsers.find((user) => user.email === email) || null;
}

module.exports = { create, all, update, findOne };
