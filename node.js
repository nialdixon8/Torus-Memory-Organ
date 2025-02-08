import { createLibp2p } from 'libp2p'
import { createHelia } from 'helia'
import { createOrbitDB, Identities, IPFSAccessController } from '@orbitdb/core'
import { LevelBlockstore } from 'blockstore-level'
import { Libp2pOptions } from './config/libp2p.js'
import { multiaddr } from '@multiformats/multiaddr'

// Get Bootstrap Peers from environment
const BOOTSTRAP_PEERS = process.env.BOOTSTRAP_PEERS ? process.env.BOOTSTRAP_PEERS.split(',') : []

const main = async () => {
  const blockstore = new LevelBlockstore('./ipfs')
  const libp2p = await createLibp2p(Libp2pOptions)
  const ipfs = await createHelia({ libp2p, blockstore })

  console.log("🌐 Node started, connecting to bootstrap peers...")

  // Connect to bootstrap peers if they exist
  for (const peer of BOOTSTRAP_PEERS) {
    try {
      console.log(`🔗 Connecting to peer: ${peer}`)
      await libp2p.dial(multiaddr(peer))
    } catch (error) {
      console.warn(`⚠️ Failed to connect to ${peer}:`, error.message)
    }
  }

  // Create an identity for this node
  const identities = await Identities()
  const nodeIdentity = await identities.createIdentity(`node-${Date.now()}`)

  // Initialize OrbitDB
  const orbitdb = await createOrbitDB({ ipfs, id: nodeIdentity.id })

  // Define write access (allow only certain peers)
  const allowedPeers = [orbitdb.identity.id, "QmPeerAllowed1", "QmPeerAllowed2"]
  const db = await orbitdb.open('shared-db', { 
    AccessController: IPFSAccessController({ write: allowedPeers }) 
  })

  console.log("✅ Database is ready! Address:", db.address.toString())

  // Keep node alive
  setInterval(() => {}, 1000)
}

main().catch(console.error)
