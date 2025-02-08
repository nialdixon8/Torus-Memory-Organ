import { createLibp2p } from 'libp2p'
import { createHelia } from 'helia'
import { createOrbitDB } from '@orbitdb/core'
import { LevelBlockstore } from 'blockstore-level'
import { Libp2pOptions } from './config/libp2p.js'

const main = async () => {
  // Configure persistent storage
  const blockstore = new LevelBlockstore('./ipfs/blocks')
  const libp2p = await createLibp2p(Libp2pOptions)
  const ipfs = await createHelia({ libp2p, blockstore })

  // Initialize OrbitDB
  const orbitdb = await createOrbitDB({ ipfs })

  // Create database (default: events log)
  const db = await orbitdb.open('my-first-db')

  console.log('my-db-addy', db.address)
  
  // Add records
  await db.add('Hello World')
  await db.add('From OrbitDB!')

  // Query records
  console.log(await db.all())

  // Cleanup
  await db.close()
  await orbitdb.stop()
  await ipfs.stop()
}

main()