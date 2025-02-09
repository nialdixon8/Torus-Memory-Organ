// agent.js
import { MemoryAccess } from './memoryAccess.js';

const runAgent = async () => {
  const dbAddress = process.argv[2];
  const onboardString = process.argv[3];

  // Create a MemoryAccess instance
  const memory = await MemoryAccess.create({
    dbAddress,
    onboardString
  });

  // Fetch all data from the database.
  const allData = await memory.fetch();
  console.log('All data in database:', allData);
};

runAgent().catch(console.error);
