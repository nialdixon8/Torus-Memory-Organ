# Torus Memory Organ - TorBit

**A robust, decentralized, zero-trust, and secure memory system for Torus agents.**

## Meet the Team

| ![Sam Wakefield](https://media.licdn.com/dms/image/v2/D4E03AQG5vDxRgEyyqQ/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1705506826370?e=1744848000&v=beta&t=YaSLl-xnkzYMkOScqrAsSFK-xaTLWClurhq_Sk1Nr44) | ![Niall Dixon](https://media.licdn.com/dms/image/v2/D4E03AQE_QhInNVVHyg/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1718220386492?e=1744848000&v=beta&t=xODXzWwO_3lZ08Vfmtjqu1_4-nj_GxwINJ3dfDCXoas) | ![Clyde Fernandes](https://media.licdn.com/dms/image/v2/D4D03AQGGAa80ajEWBg/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1726071240858?e=1744848000&v=beta&t=tpLiHoCC2iL6utT5HOog-X4pfh6npLiEL2-0BRiSCIU) |
|:---:|:---:|:---:|
| **Sam Wakefield**  | **Nial Dixon** | **Clyde Fernandes** |
| Software Developer | Software Developer | Software Developer |

## Demo Video
https://www.loom.com/share/f36b4fc492d347779c6130da1a29e347?sid=cb4a1db2-b517-4c27-8975-991566391e80


## The Problem

The rise of decentralized AI requires a robust, secure, and scalable memory system. Current architectures lack the foundation for true AI collaboration, suffering from centralized control, security vulnerabilities, and data inconsistencies.

Torus agents require a trustless, verifiable, and fault-tolerant memory solution to communicate and store knowledge reliably in a distributed environment.

## Our Solution - TorBit
TorBit is a decentralized, open, and cryptographically secure memory organ that enables seamless communication between Torus AI agents. It provides:

* ✅ Tamper-proof decentralized storage via OrbitDB
* ✅ Zero-trust architecture ensuring secure and verified data exchanges
* ✅ Open and accessible framework—any Torus Agent can join as a peer

TorBit allows AI agents to collaborate, retrieve information, and evolve in a fully distributed, trustless environment.

Key Features & Benefits
* **Decentralized Architecture**
Eliminates single points of failure and enhances resilience using OrbitDB, ensuring high availability.

* **Zero-Trust Security**
Every node, including Torus agents, operates as an independent database within OrbitDB, making data exchanges verifiable and secure.

* **Open and Accessible**
Any Torus Agent can join the network as a peer, fostering collaborative AI learning and knowledge sharing without a central authority.

## Documentation

This section provides details on the project's structure, setup, and usage.

### 📖 Available Documents

- **README.md (This Document):** Overview of the project, problem, solution, and links to other documentation.
- **Creator.md:** Details about the project creators and their contributions.
- **node.md:** Information about the TorBit node implementation.
- **memoryAccess.md:** Documentation on how the database interacts with agents.
- **CLI.md:** Instructions for using the command-line interface.

---

## **Installation & Running the System**

### 🔧 Running Without Docker

1. **Install Dependencies**  
   ```sh
   npm install
   ```

2. **Create Initial Database**  
   ```sh
   node creator.js
   ```
   This command initializes the database.

3. **Run an Extra Node to Connect to the Database**  
   ```sh
   node node.js <database-address> <connection-string>
   ```
   This starts an additional node and connects it to the database.

4. **Using the CLI**  
   Inside the CLI, you can run the following command to get a list of available commands:  
   ```sh
   help
   ```

---

### 🐳 Running With Docker

To run the system using Docker, execute the following command:  
```sh
docker run -itp . .
```

---

## **Other Components**

### 📂 **Memory Access (`memoryAccess.md`)**
The **memoryAccess** module acts as a **bridge between AI agents and the database**, allowing seamless interaction and secure data exchange.

### 💻 **Command-Line Interface (`CLI.md`)**
The **CLI** provides an **interactive way to manage and interact with the database**.

---

## Video Demonstration (Coming Soon!)

A video demonstration showcasing the functionality and benefits of Nodulisk will be available here soon.  [Link to Video Demo - Placeholder]  *(Update this link once the video is ready)*

## Dockerization (Future Development)

Whole code is Dockerized

## Contact

## License

[License Information]
