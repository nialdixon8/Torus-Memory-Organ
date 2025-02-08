import { createLibp2p } from 'libp2p'
import { createHelia } from 'helia'
import { createOrbitDB } from '@orbitdb/core'
import { LevelBlockstore } from 'blockstore-level'
import { Libp2pOptions } from './config/libp2p.js'
import { multiaddr } from '@multiformats/multiaddr'

const replicateDatabase = async (dbAddress, creatorAddress) => {
  const blockstore = new LevelBlockstore('./replicator2-ipfs-blocks')
  const libp2p = await createLibp2p(Libp2pOptions)
  const ipfs = await createHelia({ libp2p, blockstore })

  const orbitdb = await createOrbitDB({
    ipfs,
    directory: './replicator2-orbitdb-storage'
  })

  // Connect to creator first
  await libp2p.dial(multiaddr(creatorAddress))
  
  // Open existing database
  const db = await orbitdb.open(dbAddress)

  console.log('=== REPLICATOR READY ===')
  console.log('Current data:', await db.all())

  // Listen for updates
  db.events.on('update', (entry) => {
    console.log('\nNew update received:', entry.payload.value)
  })

  // Simulate adding data later
  setTimeout(async () => {
    await db.put({ _id: 'replica', content: 'From replicator' })
  }, 5000)

  // Keep alive
  setInterval(() => {}, 1000)
}

// Usage: node replicator.js <db-address> <creator-multiaddr>
const [,, dbAddress, creatorAddress] = process.argv
if (!dbAddress || !creatorAddress) {
  console.error('Missing arguments: <db-address> <creator-multiaddr>')
  process.exit(1)
}

replicateDatabase(dbAddress, creatorAddress).catch(console.error)