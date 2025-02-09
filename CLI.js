import readline from 'readline'

// Define a CLI class to handle terminal commands
export class CLI {
  constructor(db, libp2p, identity) {
    this.db = db;
    this.libp2p = libp2p;
    // Create a readline interface for terminal input
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: '> '  
    });
    this.identity = identity
  }

  start() {
    console.log('CLI started. Type "help" to see available commands.')
    this.rl.prompt();

    this.rl.on('line', async (line) => {
      const command = line.trim();
      //---HELP---
      if (command === 'help') {
        this.help();
      //---WRITE---
      } else if (command.startsWith('write ')) {
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
      //---CAPABILITIES---
      } else if (command === 'capabilities') {
        try {
          const cap = await this.db.access.capabilities()
          console.log('Capabilities:', cap);
        } catch (err) {
          console.error('Error getting capabilities:', err);
        }
      //---GRANT---
      } else if (command.startsWith('grant ')) {
        // Command format: grant write <identity_id>
        const parts = command.split(' ');
        if (parts.length < 3) {
          console.log('Usage: grant <permission> <identity_id>');
        } else {
          const permission = parts[1]
          const identityId = parts.slice(2).join(' ')
          try {
            await this.db.access.grant(permission, identityId);
            console.log(`Granted ${permission} access to ${identityId}`);
          } catch (err) {
            console.error('Error granting access:', err);
          }
        }
      //---REVOKE---
      } else if (command.startsWith('revoke ')) {
        // Command format: revoke write <identity_id>
        const parts = command.split(' ');
        if (parts.length < 3) {
          console.log('Usage: revoke <permission> <identity_id>');
        } else {
          const permission = parts[1]; // For now, expecting 'write'
          const identityId = parts.slice(2).join(' ');
          try {
            await this.db.access.revoke(permission, identityId);
            console.log(`Revoked ${permission} access from ${identityId}`);
          } catch (err) {
            console.error('Error revoking access:', err);
          }
        }
      //---FETCH---
      } else if (command === 'fetch') {
        const data = await this.db.all()
        console.log('Data:\n', data)
      //---ID---
      } else if (command === 'id') {
        console.log('ID:\n', this.identity.id)
      //---INFO---
      } else if (command === 'info') {
        console.log('Database Address:', this.db.address.toString())
        console.log('Network Addresses:', this.libp2p.getMultiaddrs().map(ma => ma.toString()))
      }
      //---EXIT---
       else if (command === 'exit') {
        console.log('Exiting...');
        process.exit(0);
      }
      //---CON---
      else if (command === 'con') {
        console.log('node node.js', this.db.address.toString(), this.libp2p.getMultiaddrs().map(ma => ma.toString())[0])
      }
      else {
        console.log(`Unknown command: ${command}`);
      }
      this.rl.prompt();
    }).on('close', () => {
      console.log('CLI closed.');
      process.exit(0);
    });
  }
  help() {
    console.log(`
  Available Commands:
    Admin:
    - grant <permission> <identity>  : Grant write access to the specified identity.
    - revoke <permission> <identity> : Revoke write access from the specified identity.
    Write:
    - write <your message>    : Add a new entry to the database.
    Read:
    - capabilities            : Show the database capabilities.
    - fetch                   : Retrieve all entries from the database.
    - info                    : Display the database address and network addresses.
    - con                     : Print the connection string.
    - help                    : Display this help message.
    - exit                    : Exit the CLI.
    `);
  }
}