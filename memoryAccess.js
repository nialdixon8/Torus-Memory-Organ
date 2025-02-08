// memoryAccess.js
import { createLibp2p } from 'libp2p';
import { createHelia } from 'helia';
import { LevelBlockstore } from 'blockstore-level';
import { Libp2pOptions } from './config/libp2p.js';
import { createOrbitDB } from '@orbitdb/core';
import { multiaddr } from '@multiformats/multiaddr'

export class MemoryAccess {

  constructor(orbitdb, db) {
    this.orbitdb = orbitdb;
    this.db = db;
  }

  static async create({ dbAddress, onboardString } = {}) {
    // Generate unique directory names using a timestamp.
    const timestamp = Date.now();
    const orbitdbDirectory = `./orbitdb-storage-${timestamp}`;
    const ipfsBlockstoreDirectory = `./ipfs-blocks-${timestamp}`;

    const blockstore = new LevelBlockstore(ipfsBlockstoreDirectory);
    const libp2p = await createLibp2p(Libp2pOptions);
    const ipfs = await createHelia({ libp2p, blockstore });
    const orbitdb = await createOrbitDB({ ipfs, directory: orbitdbDirectory });

    await libp2p.dial(multiaddr(onboardString))

    // Open an existing database if an address is provided; otherwise, create a new one.
    const db = await orbitdb.open(dbAddress);

    await new Promise(resolve => setTimeout(resolve, 1000))

    return new MemoryAccess(orbitdb, db);
  }

  async write(entry) {
    try {
      const result = await this.db.put(entry);
      console.log('Wrote entry:', entry);
      return result;
    } catch (error) {
      console.error('Error writing entry:', error);
      throw error;
    }
  }

  async fetch() {
    try {
      const data = await this.db.all();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
}
