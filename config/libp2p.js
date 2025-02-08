import { tcp } from '@libp2p/tcp'
import { identify } from '@libp2p/identify'
import { gossipsub } from '@chainsafe/libp2p-gossipsub'
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { mdns } from '@libp2p/mdns'
import { bootstrap } from '@libp2p/bootstrap'

// Shared by all nodes
export const Libp2pOptions = {
  addresses: {
    listen: ['/ip4/0.0.0.0/tcp/0']
  },
  transports: [tcp()],
  connectionEncryptors: [noise()],
  streamMuxers: [yamux()],
  services: {
    identify: identify(),
    pubsub: gossipsub({ allowPublishToZeroTopicPeers: true })
  },
  peerDiscovery: [
    mdns(), // For local network discovery
    bootstrap({ // For Docker/remote discovery
      list: [
        '/dns4/bootstrap-node/tcp/4001/p2p/12D3KooWBootstrapPeerId'
      ]
    })
  ]
}