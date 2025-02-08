import { createLibp2p } from 'libp2p'
import { createHelia } from 'helia'
import { createOrbitDB, IPFSAccessController } from '@orbitdb/core'
import { LevelBlockstore } from 'blockstore-level'
import { Libp2pOptions } from './config/libp2p.js'

const main = async () => {
  // Unique storage per node
  const blockstore = new LevelBlockstore('./ipfs')
  const libp2p = await createLibp2p(Libp2pOptions)
  const ipfs = await createHelia({ libp2p, blockstore })

  // Initialize OrbitDB
  const orbitdb = await createOrbitDB({ ipfs, directory: './orbitdb' })

  // Open the same database across all nodes
  const db = await orbitdb.open('shared-db', {
    type: 'documents',
    AccessController: IPFSAccessController({ write: ['*'] })
  })

  console.log('=== NODE ===')
  console.log('Peer ID:', libp2p.peerId.toString())
  console.log('Database Address:', db.address.toString())

  // Auto-discover peers and sync
  db.events.on('replicate', () => {
    console.log('New peer connected. Total peers:', db.all())
  })

  // Keep alive
  setInterval(() => {}, 1000)
}

main().catch(console.error)