import { useState } from "react";
import "./App.css";

const PAUSE_FUNCTION =
  "https://us-central1-aurora-backstage.cloudfunctions.net/pause";
function App() {
  const [networkId, setNetworkId] = useState("ethereum");
  const [chainId, setChainId] = useState("");
  const [accountId, setAccountId] = useState("");
  const [sender, setSender] = useState("");
  const [errors, setErrors] = useState<{
    chainId?: string;
    accountId?: string;
  }>({});
  const [message, setMessage] = useState("");

  // Validate inputs based on selected network
  const validateInputs = () => {
    let valid = true;
    const newErrors: { chainId?: string; accountId?: string } = {};

    if (networkId === "ethereum") {
      // Chain ID must be numeric
      if (!/^\d+$/.test(chainId)) {
        newErrors.chainId = "Chain ID must be a number for Ethereum.";
        valid = false;
      }
      // Account ID must be a 32-byte hex string (64 hex characters, with optional 0x prefix)
      if (!/^(0x)?[0-9a-fA-F]{64}$/.test(accountId)) {
        newErrors.accountId =
          "Account ID must be a 32-byte hex string (64 hex characters) for Ethereum.";
        valid = false;
      }
    } else if (networkId === "near") {
      // Chain ID should be either "mainnet" or "testnet"
      if (!/^(mainnet|testnet)$/.test(chainId)) {
        newErrors.chainId = "Chain ID must be 'mainnet' or 'testnet' for NEAR.";
        valid = false;
      }
      // Account ID must end with ".near" or ".testnet"
      if (!/^[a-z0-9_-]+\.(near|testnet)$/.test(accountId)) {
        newErrors.accountId =
          "Account ID must be a valid NEAR account (e.g. name.near or name.testnet).";
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!validateInputs()) return;

    const payload = { networkId, chainId, accountId, sender };
    try {
      const response = await fetch(PAUSE_FUNCTION, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setMessage("Pause request submitted successfully!");
    } catch (error) {
      if (error instanceof Error) {
        setMessage("Error submitting pause request: " + error.message);
      }
    }
  };

  return (
    <div className="container">
      <h1>Pause Smart Contract</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="networkId">Network</label>
          <select
            id="networkId"
            value={networkId}
            onChange={(e) => setNetworkId(e.target.value)}
          >
            <option value="ethereum">Ethereum</option>
            <option value="near">NEAR</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="chainId">Chain ID</label>
          <input
            id="chainId"
            type="text"
            value={chainId}
            onChange={(e) => setChainId(e.target.value)}
            placeholder={
              networkId === "ethereum" ? "e.g., 1" : "mainnet | testnet"
            }
          />
          {errors.chainId && <span className="error">{errors.chainId}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="accountId">Account ID</label>
          <input
            id="accountId"
            type="text"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            placeholder={
              networkId === "ethereum"
                ? "32-byte hex string (64 hex chars)"
                : "e.g., alice.near"
            }
          />
          {errors.accountId && (
            <span className="error">{errors.accountId}</span>
          )}
        </div>
        {networkId === "near" && (
          <div className="form-group">
            <label htmlFor="sender">Sender</label>
            <input
              id="sender"
              type="text"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder="e.g., alice.near"
            />
          </div>
        )}
        <button type="submit">Pause Contract</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default App;
