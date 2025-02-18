#!/usr/bin/env bash

export contract=controller-demo.testnet
export signer=controller-delegate.testnet

# 1. Delete account
near account delete-account $contract beneficiary $signer network-config testnet sign-with-keychain send

# 2. Create account
near account create-account sponsor-by-faucet-service $contract autogenerate-new-keypair save-to-keychain network-config testnet create

# 3. Deploy contract
cargo near deploy $contract with-init-call new json-args '{"pause_manager": "'$signer'"}' prepaid-gas '100.0 Tgas' attached-deposit '0 NEAR' network-config testnet sign-with-keychain send
