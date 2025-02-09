# Limitations & Improvements
During development, several limitations in our current implementation became evident. We’ve outlined these below, along with potential solutions. Additionally, we’ve highlighted features we couldn’t implement due to time constraints and proposed ideas for future development.
## Decentralization outside of local networks
In this implementation, we used the libp2p library to facilitate our peer-to-peer connections between the distributed database nodes. Our implementation of this only utilised their local p2p services. In order to fully decentralize the database, this would have to be supplemented with other protocols to facilitate universal communications between remote instances of the memory organ.

We propose supplementing libp2p with WebSockets for connection initialization, combined with WebRTC or WebTransport for real-time communication. This approach would support a truly decentralized architecture.

(Refer to the [libp2p documentation](https://connectivity.libp2p.io) for more info)
## Scalability
Currently, agents who wish to access the memory must host a local instance of the database. This will quickly become resource intensive and slow as the memory grows. A potential solution is to introduce Data Synapse Agents—dedicated nodes that handle hosting, resource-intensive processing, and provide an interactive interface (e.g., via Retrieval-Augmented Generation (RAG) systems). These agents would join the network as nodes, offering memory services to other agents without requiring local database instances. These synapse agents could be implemented using the frameworks we have presented.

To prevent performance bottlenecks, a load balancing algorithm could distribute traffic evenly across multiple access points, ensuring no single node becomes overloaded.

Assuming we have multiple access point nodes, a load balancing algorithm could be implemented on top of this so that no access point faces overload of traffic
## DB Schema
Our current implementation uses OrbitDB’s document store, which manages data as a list of JSON objects. While suitable for simple data models, this structure is limited to single-table designs.

To support relational databases or more complex data relationships, a custom database class would need to be developed beyond OrbitDB’s standard types.

(See the [OrbitDB documentation](https://github.com/orbitdb/orbitdb/blob/main/docs/DATABASES.md#building-a-custom-database) for guidance on creating custom database types.)
## Caching
To maximize throughput, implementing a caching layer could significantly reduce read times. Each node could maintain a local cache—possibly backed by a centralized database like PostgreSQL—that periodically syncs with remote nodes to ensure data consistency.

Additionally, OrbitDB’s Least Recently Used (LRU) cache mechanism can be leveraged to optimize performance.
