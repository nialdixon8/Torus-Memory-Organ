import { createLibp2p } from 'libp2p'
import { createHelia } from 'helia'
import { createOrbitDB } from '@orbitdb/core'
import { LevelBlockstore } from 'blockstore-level'
import { Libp2pOptions } from './config/libp2p.js'
import { multiaddr } from '@multiformats/multiaddr'
import { CLI } from './CLI.js'

const joinDatabase = async (dbAddress, creatorAddress) => {
  const blockstore = new LevelBlockstore('./replicator-ipfs-blocks')
  const libp2p = await createLibp2p(Libp2pOptions)
  const ipfs = await createHelia({ libp2p, blockstore })

  const orbitdb = await createOrbitDB({
    ipfs,
    directory: './replicator-orbitdb-storage'
  })

  // Connect to creator first
  await libp2p.dial(multiaddr(creatorAddress))
  
  // Open existing database
  const db = await orbitdb.open(dbAddress)

  console.log('=== NODE READY ===')

  // Listen for updates
  db.events.on('update', (entry) => {
    console.log('\nNew update received:', entry.payload.value)
  })

  const cli = new CLI(db, libp2p);
  cli.start();
}

// Usage: node replicator.js <db-address> <creator-multiaddr>
const [,, dbAddress, creatorAddress] = process.argv
if (!dbAddress || !creatorAddress) {
  console.error('Missing arguments: <db-address> <creator-multiaddr>')
  process.exit(1)
}

joinDatabase(dbAddress, creatorAddress).catch(console.error)