import readline from 'readline'
import fs from 'fs';

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
      //---CREATE---
      } else if (command.startsWith('create ')) {
        const filePath = command.slice(7).trim();
        if (!filePath) {
          console.error('Error: No file path provided. Usage: create <path-to-json-file>');
          return;
        }
        try {
          const data = await fs.promises.readFile(filePath, 'utf8');

          const jsonData = JSON.parse(data)
          for await (const line of jsonData) {
            try {
              const entry = { _id: new Date().toISOString(), ...line };
              await this.db.put(entry);
            } catch (err) {
              console.error('Error parsing or uploading line:', err);
            }
          }
      
          console.log(`Uploaded file: ${filePath}`);
        } catch (err) {
          console.error('Error reading file:', err);
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
      //---LIST---
      } else if (command === 'list') {
        const data = await this.db.all()
        console.log('Data:\n', data.map(d=>d.value))
      //---FETCH---
      } else if (command.startsWith('fetch ')) {
        const id = command.slice(6).trim()
        const doc = await this.db.get(id)
        console.log(JSON.stringify(doc.value, null, 2))
      //---QUERY---
      } else if (command.startsWith('query ')) {
        const parts = command.split(' ');
        if (parts.length < 3) {
          console.log('Usage: query <field> <value>');
        }
        const field = parts[1];
        let value = parts[2];

        if (!isNaN(Number(value))) {
            value = Number(value);
        }

        const query = { [field]: value };
        const results = await this.db.query(doc => {
            return Object.entries(query).every(([key, value]) => {
                return this.deepCompare(doc[key], value)
            })
        })
        console.log(`Found ${results.length} documents:`)
        results.forEach(doc => console.log(JSON.stringify(doc, null, 2)))
      //---DELETE---
      } else if (command.startsWith('delete ')) {
        const id = line.slice(7).trim()
        await this.db.del(id)
        console.log(`Deleted document: ${id}`)
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
        console.log(`Unknown command: ${command}. Use command 'help' to see valid commands`);
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
    - create <path-to-json>   : Upload JSON data to database.
    - delete <id>             : Delete row from database.
    Read:
    - query <field> <value>   : Fetches documents where field = value.
    - fetch <id>              : Fetches specific document.
    - capabilities            : Show the database capabilities.
    - list                    : List all entries from the database.
    - info                    : Display the database address and network addresses.
    - id                      : Display this node's public key.
    - con                     : Print the connection string.
    - help                    : Display this help message.
    - exit                    : Exit the CLI.
    `);
  }
  deepCompare(a, b) {
    if (typeof a !== typeof b) return false
    if (typeof a !== 'object') return a === b
    return JSON.stringify(a) === JSON.stringify(b)
    }
}