import { createLibp2p } from 'libp2p'
import { createHelia } from 'helia'
import { createOrbitDB, IPFSAccessController } from '@orbitdb/core'
import { LevelBlockstore } from 'blockstore-level'
import { Libp2pOptions } from './config/libp2p.js'
import { v4 as uuidv4 } from 'uuid' // For generating unique IDs

const main = async () => {
  // Persistent storage for creator
  const blockstore = new LevelBlockstore('./creator-ipfs-blocks')
  const libp2p = await createLibp2p(Libp2pOptions)
  const ipfs = await createHelia({ libp2p, blockstore })

  // Initialize OrbitDB
  const orbitdb = await createOrbitDB({ ipfs, directory: './creator-orbitdb' })

  // Generate a unique database name
  const dbName = `shared-db-${uuidv4()}`

  // Create a database with open access
  const db = await orbitdb.open(dbName, {
    type: 'documents',
    AccessController: IPFSAccessController({ write: ['*'] }) // Allow anyone to write
  })

  console.log('=== CREATOR ===')
  console.log('Database Name:', dbName)
  console.log('Database Address:', db.address.toString())
  console.log('Peer Addresses:', libp2p.getMultiaddrs().map(ma => ma.toString()))

  // Add initial data
  await db.put({ _id: 'doc1', message: 'Hello from creator!' })
  console.log('Initial data:', await db.all())

  // Keep the creator alive
  setInterval(() => {}, 1000)
}

main().catch(console.error)