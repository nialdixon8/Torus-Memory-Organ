import readline from 'readline'

// Define a CLI class to handle terminal commands
export class CLI {
  constructor(db) {
    this.db = db;
    // Create a readline interface for terminal input
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: '> '
    });
  }

  start() {
    console.log('CLI started. Type "write <your message>" to add an entry, or "exit" to quit.');
    this.rl.prompt();

    this.rl.on('line', async (line) => {
      const command = line.trim();
      
      // If the command starts with "write ", write the rest of the text to the database.
      if (command.startsWith('write ')) {
        // Extract the text after "write "
        const text = command.slice(6);
        try {
          // Use a timestamp as a unique _id; you could also provide your own ID if desired.
          const entry = { _id: new Date().toISOString(), content: text };
          await this.db.put(entry);
          console.log(`Wrote entry: ${text}`);
        } catch (err) {
          console.error('Error writing entry:', err);
        }
      } else if (command === 'fetch') {
        const data = await this.db.all()
        console.log('Data:\n', data)
      } else if (command === 'exit') {
        console.log('Exiting...');
        process.exit(0);
      } else {
        console.log(`Unknown command: ${command}`);
      }
      this.rl.prompt();
    }).on('close', () => {
      console.log('CLI closed.');
      process.exit(0);
    });
  }
}