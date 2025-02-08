import { createLibp2p } from 'libp2p'
import { createHelia } from 'helia'
import { createOrbitDB, IPFSAccessController } from '@orbitdb/core'
import { LevelBlockstore } from 'blockstore-level'
import { Libp2pOptions } from './config/libp2p.js'

const createDatabase = async () => {
  // Persistent storage setup
  const blockstore = new LevelBlockstore('./creator-ipfs-blocks')
  const libp2p = await createLibp2p(Libp2pOptions)
  const ipfs = await createHelia({ libp2p, blockstore })

  // OrbitDB instance
  const orbitdb = await createOrbitDB({ 
    ipfs,
    directory: './creator-orbitdb-storage'
  })

  // Create database with open access (for demo purposes)
  const db = await orbitdb.open('shared-database', {
    type: 'documents',
    AccessController: IPFSAccessController({ write: ['*'] })
  })

  console.log('=== CREATOR INFO ===')
  console.log('Database Address:', db.address.toString())
  console.log('Network Addresses:', libp2p.getMultiaddrs().map(ma => ma.toString()))

  // Add initial data
  await db.put({ _id: 'first', content: 'Genesis entry' })

  // Listen for remote updates
  db.events.on('update', (entry) => {
    console.log('\nNew update from peer:', entry.payload.value)
  })

  // Keep alive for demo
  setInterval(() => {}, 1000)
}

createDatabase().catch(console.error)