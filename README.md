This is a [Vite](https://vitejs.dev) project bootstrapped with [`create-wagmi`](https://github.com/wevm/wagmi/tree/main/packages/create-wagmi).

HealthTrove is a decentralized, on-chain healthcare management system designed to improve patient records management, appointment scheduling, and data privacy in the healthcare sector. Built on the Base network, it aims to provide a more efficient and secure way to manage healthcare data while introducing users to the benefits of Web3 technology.

Features
1. Appointment Scheduling
Patients can easily book, update, or cancel appointments with healthcare providers.
Doctors can manage their schedules effectively, view upcoming appointments, and be notified of any changes.
The system uses smart contracts to automate booking processes and enforce scheduling policies.

2. Healthcare Record Management
Stores patient health records securely using IPFS for off-chain storage.
On-chain IPFS hashes are used to reference records, ensuring data integrity and verifiability.
Role-based access control ensures that only authorized personnel can access or update sensitive health data.

3. Privacy and Security
Uses role-based access to enforce privacy policies and ensure only authorized users can view or edit records.
Event-driven architecture to update data and notify users of relevant changes.

4. Doctor Content Monetization
Allows doctors to create educational content (videos, articles) and earn payments.
Payments are made using ETH.



Project Vision

HealthTrove is aimed at revolutionizing the healthcare sector by providing a more stable and reliable records management system. In regions like Nigeria, where hospitals are often overcrowded and healthcare data management is inefficient, HealthTrove aims to streamline the process by using blockchain technology. Our goal is to enhance patient care, reduce wait times, and bring modern technology to the healthcare space.


Technologies Used

- Blockchain Platform: Base Network (Layer 2 on Ethereum)
- Smart Contracts: Solidity
- Frontend: React + Vite
- Backend: IPFS for off-chain storage
- Tools: Wagmi for Web3 hooks, viem for blockchain interactions, PINATA for IPFS integration

Getting Started

  Prerequisites
   - Node.js (version 14+ recommended)
   - Npm
   - Metamask and coinbase smart wallet


How to Use
  1. Book an Appointment:

  - Patients can log in and schedule appointments with their desired healthcare provider.
  
  2. Manage Records:

  - Healthcare providers can access patient records securely based on their roles.
  - Patients have the ability to grant or revoke consent to their records.

  3. Create Content:

  - Doctors can share educational content and earn rewards through a simple interface.

Roadmap
  - Phase 1: MVP Launch (Appointment Scheduling & Record Management)
  - Phase 2: Doctor Content Monetization
  - Phase 3: Integration with more healthcare providers
  - Phase 4: Mobile App Development
