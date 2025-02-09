# Creator Node Documentation

This document provides an overview of the Creator Node setup and its functionality. The Creator Node is responsible for initializing the database, managing the peer-to-peer network, and starting the Command Line Interface (CLI) for user interaction.

## Overview

The Creator Node performs the following key tasks:
- Initializes a persistent storage system.
- Establishes peer-to-peer (P2P) communication using Libp2p.
- Creates and manages an OrbitDB database.
- Listens for remote updates and peer connections.
- Launches the CLI for database operations.

## Setup Process

1. **Persistent Storage Initialization:**
   - The `LevelBlockstore` is initialized to ensure data persistence.
   - **Path:** `./creator-ipfs-blocks`

2. **Libp2p Network Initialization:**
   - Libp2p is configured using custom options from `./config/libp2p.js`.
   - Handles P2P networking and communication.

3. **Helia (IPFS) Node Creation:**
   - Helia is created with Libp2p and the blockstore to enable IPFS functionality.

4. **OrbitDB Instance Creation:**
   - The database directory is set to `./creator-orbitdb-storage`.
   - The database is opened with the name `shared-database` and uses document storage.
   - Open access is granted for demo purposes.

5. **Initial Data Entry:**
   - A genesis entry is added with `_id: 'first'` and `content: 'Genesis entry'`.

6. **Event Listeners:**
   - **Update Listener:** Displays new updates from peers.
   - **Join Listener:** Notifies when new nodes join the network.

7. **CLI Launch:**
   - The CLI is started with the database, Libp2p instance, and identity.

## Code Summary

```javascript
const blockstore = new LevelBlockstore('./creator-ipfs-blocks');
const libp2p = await createLibp2p(Libp2pOptions);
const ipfs = await createHelia({ libp2p, blockstore });
const orbitdb = await createOrbitDB({ ipfs, directory: './creator-orbitdb-storage' });

const db = await orbitdb.open('shared-database', {
  type: 'documents',
  AccessController: OrbitDBAccessController({ write: [orbitdb.identity.id] })
});

await db.put({ _id: 'first', content: 'Genesis entry' });

db.events.on('update', (entry) => console.log('New update from peer:', entry.payload.value));
db.events.on('join', (peerID) => console.log('Node Joined:', peerID));

const cli = new CLI(db, libp2p, orbitdb.identity);
cli.start();
```
## Access Controllers
In our implementation we use the OrbitDBAccessController which holds a map of identities to their access rights. Each identity is a private public key pair so that nodes can sign transactions with their private key and other nodes can validate their transactions against the decentralised capabilities table in the keystore. More info on this can be found in the [OrbitDB documentation](https://github.com/orbitdb/orbitdb/blob/main/docs/ACCESS_CONTROLLERS.md)
## Event Handling

- **Update Event:** Triggered when a remote peer updates the database.
  ```javascript
  db.events.on('update', (entry) => {
    console.log('New update from peer:', entry.payload.value);
  });
  ```

- **Join Event:** Triggered when a new peer connects to the network.
  ```javascript
  db.events.on('join', (peerID) => {
    console.log('Node Joined:', peerID);
  });
  ```

## CLI Integration

The CLI is initialized with:
- **Database Instance:** For managing data operations.
- **Libp2p Instance:** For handling network communication.
- **Identity:** For managing access permissions.

To start interacting with the database:
```bash
node creator.js
```

## Troubleshooting

- **Database Connection Errors:** Ensure that the storage paths exist and the database has proper read/write permissions.
- **Network Issues:** Verify that Libp2p is configured correctly, and ports are not blocked by firewalls.
- **Peer Synchronization:** Ensure that remote nodes are running compatible versions and can reach the Creator Node.

## Notes

- This setup is designed for demonstration purposes; consider implementing stricter access controls for production.
- Ensure dependencies like Libp2p, Helia, and OrbitDB are correctly installed.
- Data persistence relies on the `LevelBlockstore` and OrbitDB directory paths.

---

For further assistance, refer to the project documentation or contact support.

