import { createLibp2p } from 'libp2p'
import { createHelia } from 'helia'
import { createOrbitDB, OrbitDBAccessController } from '@orbitdb/core'
import { LevelBlockstore } from 'blockstore-level'
import { Libp2pOptions } from './config/libp2p.js'
import { CLI } from './CLI.js'

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
    AccessController: OrbitDBAccessController({ write: [orbitdb.identity.id] })
  })

  console.log('=== CREATOR READY ===')

  // Add initial data
  await db.put({ _id: 'first', content: 'Genesis entry' })

  // Listen for remote updates
  db.events.on('update', (entry) => {
    console.log('\nNew update from peer:', entry.payload.value)
  })

  db.events.on('join', (peerID, heads) => {
    console.log('Node Joined: ', peerID)
  })

  const cli = new CLI(db, libp2p);
  cli.start();
}

createDatabase().catch(console.error)