# Controller Cloud Functions

This repository contains a set of cloud functions that provide a unified interface for pausing and unpausing smart contracts. It’s designed to work in tandem with two main components:

1. **Aurora Controller Factory**
   The functions interact with the [aurora-controller-factory](https://github.com/aurora-is-near/aurora-controller-factory) deployed on the NEAR network, which manages the pausing/unpausing logic for Near contracts.

2. **Pausable Contracts on EVM Networks**
   For EVM-based contracts, the functions interface with contracts implementing OpenZeppelin’s [Pausable](https://docs.openzeppelin.com/contracts/4.x/api/security#Pausable) interface. This ensures that contracts deployed on Ethereum (and other EVM chains) can be paused or unpaused as needed.

---

## Table of Contents

- [Overview](#overview)
- [Repository Structure](#repository-structure)
- [Cloud Functions](#cloud-functions)
- [Terraform Deployment](#terraform-deployment)
- [Integration with Controller Factory and Pausable Contracts](#integration)
- [Setup and Deployment](#setup-and-deployment)

---

## Overview

The primary goal of this repository is to serve as the backend for a multi-network control system that can:

- **Pause/Unpause Contracts:**
  Use cloud functions to trigger pausing/unpausing actions on contracts, either through the NEAR controller factory or via direct calls on EVM networks using OpenZeppelin’s Pausable contract.

- **Multi-Network Support:**
  Although the cloud functions share similar logic, the implementation caters to different blockchains by abstracting the underlying pause/unpause mechanism.

- **Infrastructure as Code:**
  The Terraform folder provides configuration for provisioning the necessary infrastructure (such as cloud functions, API gateways, etc.) on your chosen cloud provider.

---

## Repository Structure

- **functions/**
  Contains the source code for the cloud functions. This is where you’ll find the logic for:

  - Handling HTTP triggers or other event sources.
  - Interacting with the controller factory on NEAR.
  - Sending transactions or calls to pause/unpause contracts on EVM networks.

- **terraform/**
  Contains Terraform configuration files that define the cloud infrastructure required for deploying the functions. This may include:

  - Serverless function configuration (e.g., Google Cloud Functions, AWS Lambda, etc.).
  - Networking, IAM roles, and other cloud resource definitions.

## Cloud Functions

The core logic of the cloud functions is implemented in the `functions` directory. Key responsibilities include:

- **Endpoint Handling:**
  Exposing endpoints (HTTP, pub/sub, etc.) that accept requests to change the state (pause/unpause) of a contract.

- **Blockchain Interaction:**
  Depending on the network:

  - For NEAR:
    The functions call the controller factory methods, thereby delegating the actual pause/unpause logic.
  - For EVM networks:
    They interact with contracts that follow the OpenZeppelin Pausable interface, sending transactions to trigger the pause or unpause state.

- **Validation & Logging:**
  Ensure that incoming requests are validated and that each action is logged for auditability.

_Note:_ The exact code may evolve, so check inline documentation/comments within the source files for the latest function-specific details.

---

## Terraform Deployment

The `terraform` folder contains infrastructure as code for deploying the cloud functions. Some key points:

- **Resource Provisioning:**
  Terraform scripts are used to create and manage cloud resources such as:

  - Cloud functions.
  - API Gateways or HTTP endpoints.
  - IAM roles and permissions needed to interact with blockchain networks securely.

- **Configuration Variables:**
  You will likely need to set up certain environment variables (e.g., API keys, network endpoints, etc.). Check the Terraform variable definitions and documentation within the `.tf` files.

## Integration

### With the Aurora Controller Factory (NEAR)

The cloud functions are designed to interact with the [aurora-controller-factory](https://github.com/aurora-is-near/aurora-controller-factory) repository. This means that when a request to pause or unpause a contract is received, the function will:

- Connect to the NEAR network.
- Call the appropriate controller factory function to toggle the contract state.

### With Pausable Contracts (EVM Networks)

For EVM-based contracts:

- The functions leverage the OpenZeppelin Pausable interface.
- They construct and send transactions to the contract on networks like Ethereum.
- This allows for a unified interface, even though the underlying blockchain technology differs.

---

## Setup and Deployment

### Prerequisites

- Node.js (for local development of cloud functions)
- Terraform (for deploying infrastructure)
- Cloud CLI (depending on your chosen provider, e.g., gcloud for Google Cloud Functions, AWS CLI for AWS Lambda)

### Local Development

1. **Install Dependencies:**
   ```bash
   npm install
   ```
2. **Run Functions Locally:**
   Use your preferred method (e.g., Firebase emulator, or provider-specific emulators) to test the functions locally.

### Deployment

1. **Configure Environment Variables:**
   Make sure to set required environment variables for:

   - Seed phrases for wallets (NEAR, EVM)
   - Authenticated to GCP through their CLI

2. **Deploy Using Terraform:**
   ```bash
   make zip
   make deploy
   ```

_Note:_ Verify provider-specific deployment steps as the scripts might require custom configurations.
