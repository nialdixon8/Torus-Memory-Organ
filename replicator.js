import { createLibp2p } from 'libp2p'
import { createHelia } from 'helia'
import { createOrbitDB } from '@orbitdb/core'
import { LevelBlockstore } from 'blockstore-level'
import { Libp2pOptions } from './config/libp2p.js'
import { multiaddr } from '@multiformats/multiaddr'

const main = async (dbAddress, creatorAddress, storageDir) => {
  // Persistent storage for replicator
  const blockstore = new LevelBlockstore(`./${storageDir}/ipfs-blocks`)
  const libp2p = await createLibp2p(Libp2pOptions)
  const ipfs = await createHelia({ libp2p, blockstore })

  // Initialize OrbitDB with a unique directory
  const orbitdb = await createOrbitDB({ ipfs, directory: `./${storageDir}/orbitdb` })

  // Connect to the creator
  await libp2p.dial(multiaddr(creatorAddress))

  // Open the shared database
  const db = await orbitdb.open(dbAddress)
  console.log('=== REPLICATOR READY ===')
  console.log('Database Address:', db.address.toString())
  console.log('Network Addresses:', libp2p.getMultiaddrs().map(ma => ma.toString()))
  console.log('Current data:', await db.all())

  // Listen for updates
  db.events.on('update', (entry) => {
    console.log('\nNew update:', entry.payload.value)
  })

  // Add new data after a delay
  setTimeout(async () => {
    await db.put({ _id: 'doc2', message: 'Hello from replicator!' })
  }, 5000)

  // Keep the replicator alive
  setInterval(() => {}, 1000)
}

// Usage: node replicator.js <db-address> <creator-multiaddr> <storage-dir>
const [,, dbAddress, creatorAddress, storageDir] = process.argv
if (!dbAddress || !creatorAddress || !storageDir) {
  console.error('Usage: node replicator.js <db-address> <creator-multiaddr> <storage-dir>')
  process.exit(1)
}

main(dbAddress, creatorAddress, storageDir).catch(console.error)