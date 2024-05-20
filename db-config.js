const { MongoClient } = require('mongodb');

async function main() {
  const uri = 'add-your-mongodb-url-for-test-the-conecction';

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected successfully to server");
    const database = client.db("Querer_Nestjs");
    const collection = database.collection("users");

    const user = await collection.findOne({});
    console.log("Found user:", user);
  } catch (err) {
    console.error("An error occurred:", err);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
