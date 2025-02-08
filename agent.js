// agent.js
import { MemoryAccess } from './memoryAccess.js';

const runAgent = async () => {
  const dbAddress = process.argv[2];
  const onboardString = process.argv[3];

  // Create a MemoryAccess instance; it will create its own IPFS, persistent storage, and OrbitDB.
  const memory = await MemoryAccess.create({
    dbAddress,
    onboardString
  });

  // Example: Write an entry to the database using a timestamp-based _id.
  try{
    await memory.write({
      _id: new Date().toISOString(),
      content: 'Hello from agent!'
    });
  } catch (error){
    console.log(error)
  }

  // Fetch all data from the database.
  const allData = await memory.fetch();
  console.log('All data in database:', allData);

};

runAgent().catch(console.error);
