import readline from 'readline'
import { v4 as uuidv4 } from 'uuid'

// Define a CLI class to handle terminal commands
export class CLI {
    constructor(db, libp2p) {
        this.db = db;
        this.libp2p = libp2p;
        // Create a readline interface for terminal input
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: '> '
        });
    }

    start() {
        console.log(`Document Database CLI
Commands:
  create <json>       - Create new document
  get <id>            - Get document by ID
  update <id> <json>  - Update document
  delete <id>         - Delete document
  query <json>        - Find documents matching query
  list                - List all documents
  exit                - Exit program
`)
        this.rl.prompt()

        this.rl.on('line', async (line) => {
            const [cmd, ...args] = line.trim().split(/(?<!\\) /).map(s => s.replace(/\\ /g, ' '))

            try {
                switch (cmd.toLowerCase()) {
                    case 'create':
                        await this.handleCreate(args.join(' '))
                        break

                    case 'get':
                        await this.handleGet(args[0])
                        break

                    case 'update':
                        await this.handleUpdate(args[0], args.slice(1).join(' '))
                        break

                    case 'delete':
                        await this.handleDelete(args[0])
                        break

                    case 'query':
                        await this.handleQuery(args.join(' '))
                        break

                    case 'list':
                        await this.handleList()
                        break

                    case 'exit':
                        process.exit(0)
                        break

                    default:
                        console.log('Unknown command')
                        break
                }
            } catch (err) {
                console.error('Error:', err.message)
            }

            this.rl.prompt()
        })
    }

    // CRUD Operations Implementation
    async handleCreate(jsonStr) {
        const doc = this.parseJSON(jsonStr)
        if (!doc._id) doc._id = uuidv4()
        await this.db.put(doc)
        console.log(`Created document: ${doc._id}`)
    }

    async handleGet(id) {
        const doc = await this.db.get(id)
        console.log('Document:', JSON.stringify(doc, null, 2))
    }

    async handleUpdate(id, jsonStr) {
        const existing = await this.db.get(id)
        const updates = this.parseJSON(jsonStr)
        const merged = {...existing, ...updates}
        await this.db.put(merged)
        console.log(`Updated document: ${id}`)
    }

    async handleDelete(id) {
        await this.db.del(id)
        console.log(`Deleted document: ${id}`)
    }

    async handleQuery(jsonStr) {
        const query = this.parseJSON(jsonStr)
        const results = await this.db.query(doc => {
            return Object.entries(query).every(([key, value]) => {
                return this.deepCompare(doc[key], value)
            })
        })
        console.log(`Found ${results.length} documents:`)
        results.forEach(doc => console.log(JSON.stringify(doc, null, 2)))
    }

    async handleList() {
        const all = await this.db.all()
        console.log(`Total documents: ${all.length}`)
        all.forEach(entry => {
            console.log(`ID: ${entry.key}`)
            console.log(JSON.stringify(entry.value, null, 2))
        })
    }

    // Helpers
    parseJSON(str) {
        try {
            return JSON.parse(str)
        } catch (err) {
            throw new Error('Invalid JSON format')
        }
    }

    deepCompare(a, b) {
        if (typeof a !== typeof b) return false
        if (typeof a !== 'object') return a === b
        return JSON.stringify(a) === JSON.stringify(b)
    }
}

