import { SparkWallet } from "@buildonspark/spark-sdk";
import { useState } from "react";
import TxItem from "./components/txItem";

function App() {
  const [seed, setSeed] = useState("");
  const [sparkWallet, setSparkWallet] = useState(null);
  const [balance, setBalance] = useState(0);
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState({
    initialization: false,
    balance: false,
    transactions: false,
  });
  const [errors, setErrors] = useState({
    initialization: "",
    balanceError: "",
    transferError: "",
  });

  const initializeSpark = async () => {
    setLoading((prev) => ({ ...prev, initialization: true }));
    setErrors((prev) => ({ ...prev, initialization: "" }));

    try {
      console.log(seed);
      console.log("Initializing Spark client...");
      const { wallet, mnemonic } = await SparkWallet.initialize({
        mnemonicOrSeed: seed.toLowerCase(),
        options: {
          network: "MAINNET",
        },
      });

      console.log("Mnemonic:", mnemonic);
      setSparkWallet(wallet);
      console.log(
        "Spark client initialized successfully!",
        await wallet.getIdentityPublicKey()
      );
    } catch (error) {
      console.error("Failed to initialize Spark client:", error);
      setErrors((prev) => ({
        ...prev,
        initialization: error.message,
      }));
    } finally {
      setLoading((prev) => ({ ...prev, initialization: false }));
    }
  };

  const getBalance = async () => {
    if (!sparkWallet) {
      console.error("Spark client not initialized");
      return;
    }

    setLoading((prev) => ({ ...prev, balance: true }));
    setErrors((prev) => ({ ...prev, balanceError: "" }));

    try {
      console.log("Getting balance...");
      const balanceResult = await sparkWallet.getBalance();
      console.log(balanceResult);
      setBalance(Number(balanceResult.balance));
    } catch (error) {
      console.error("Failed to get balance:", error);
      setErrors((prev) => ({ ...prev, balanceError: error.message }));
    } finally {
      setLoading((prev) => ({ ...prev, balance: false }));
    }
  };

  const getTransactions = async () => {
    if (!sparkWallet) {
      console.error("Spark client not initialized");
      return;
    }

    setLoading((prev) => ({ ...prev, transactions: true }));
    setErrors((prev) => ({ ...prev, transferError: "" }));

    try {
      const transactions = await sparkWallet.getTransfers(10);
      console.log(transactions);
      setTransfers(transactions.transfers);
    } catch (error) {
      console.error("Failed to get transactions:", error);
      setErrors((prev) => ({ ...prev, transferError: error.message }));
    } finally {
      setLoading((prev) => ({ ...prev, transactions: false }));
    }
  };

  const transferElements = transfers.map((tx, index) => {
    const lastTransaction = transfers[index + 1];
    const currentTxTime = new Date(tx.createdTime).getTime();
    const lastTxTime = lastTransaction
      ? new Date(lastTransaction.createdTime).getTime()
      : 0;
    const BUFFER_TIME = 1000 * 10; // 10 second buffer time
    const difference = Math.abs(currentTxTime - lastTxTime);
    const isDonation =
      difference <= BUFFER_TIME &&
      tx?.receiverIdentityPublicKey ===
        "02121157144443ea2d94f5527688adb062b944edec54c21f6f943dc7d5cdfcdbe2";

    return <TxItem key={index} isDonation={isDonation} tx={tx} index={index} />;
  });

  return (
    <div className="debugContainer">
      <h1 className="pageTitle">Spark Debug</h1>

      <div className="inputsContainer">
        {/* Seed Input Section */}
        <div className="seedInputContainer">
          <label className="itemHeader">Seed Phrase</label>
          <textarea
            className="textarea"
            rows="3"
            value={seed}
            onChange={(event) => setSeed(event.target.value)}
            placeholder="Enter seed phrase here (e.g., milk humor spin maid cable sudden lucky axis corn point system flavor)"
          />
          <button
            onClick={initializeSpark}
            disabled={loading.initialization || !seed.trim()}
            className="initializeSparkBTN"
          >
            {loading.initialization ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Initializing...
              </>
            ) : (
              "Initialize Spark Client"
            )}
          </button>
          {errors.initialization && (
            <p className="errorText">{errors.initialization}</p>
          )}
          {!errors.initialization && (
            <p
              style={{ marginBottom: 10, marginTop: 10 }}
              className="text-sm text-gray-600"
            >
              {sparkWallet
                ? "✅ Spark client is initialized!"
                : "Click the button to initialize Spark client"}
            </p>
          )}
        </div>

        {/* Balance Section */}
        <div className="space-y-3">
          <button
            style={{ marginBottom: 10 }}
            onClick={getBalance}
            disabled={!sparkWallet || loading.balance}
          >
            {loading.balance ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Loading...
              </>
            ) : (
              "Get Balance"
            )}
          </button>
          {errors.balanceError && (
            <p className="errorText">{errors.balanceError}</p>
          )}
          <p className="itemHeader">
            Balance: <span className="text-green-600">{balance}</span>
          </p>
        </div>

        {/* Transactions Section */}
        <div className="space-y-3">
          <button
            onClick={getTransactions}
            disabled={!sparkWallet || loading.transactions}
            className="bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
          >
            {loading.transactions ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Loading...
              </>
            ) : (
              "Get Transactions"
            )}
          </button>
          {errors.transferError && (
            <p className="text-red-600 text-sm">{errors.transferError}</p>
          )}
        </div>

        {/* Transactions List */}
        {transfers.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">
              Recent Transactions
            </h3>
            <div className="max-h-96 overflow-y-auto">{transferElements}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
