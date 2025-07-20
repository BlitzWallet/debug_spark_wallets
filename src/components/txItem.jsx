import {
  TransferFilter,
  TransferStatus,
  TransferType,
} from "@buildonspark/spark-sdk/proto/spark";
import { TransferDirection } from "@buildonspark/spark-sdk/types";

export default function TxItem({ tx, index, isDonation }) {
  const isLightningPayment = tx.type === "PREIMAGE_SWAP";
  const isBitcoinPayment = tx.type == "COOPERATIVE_EXIT";
  const isSparkPayment = tx.type === "TRANSFER";
  const time = new Date().getTime();
  const timeDifferenceMs = time - new Date(tx.updatedTime).getTime();
  const minutes = timeDifferenceMs / (1000 * 60);
  const hours = minutes / 60;
  const days = hours / 24;
  const years = days / 365;

  //   BITCOIN PENDING = TRANSFER_STATUS_SENDER_KEY_TWEAK_PENDING
  //   BITCOIN CONFIRMED = TRANSFER_STATUS_COMPLETED
  //   BITCOIN FAILED = TRANSFER_STATUS_RETURNED

  //   SPARK PENDING = TRANSFER_STATUS_SENDER_KEY_TWEAKED
  //   SPARK CONFIRMED = TRANSFER_STATUS_COMPLETED

  //   LIGHTING PENDING = LIGHTNING_PAYMENT_INITIATED
  //   LIGHTNING CONFIRMED = TRANSFER_STATUS_COMPLETED

  return (
    <div
      style={{
        backgroundColor: "gainsboro",
        padding: 10,
        margin: 10,
        display: "flex",
        justifyContent: "space-between",
      }}
      key={index}
    >
      <div>
        <p>{isDonation ? "Donation" : "No description"}</p>
        <p className="dateText">
          {`${
            minutes <= 1
              ? `Just now`
              : minutes <= 60
              ? Math.round(minutes) || ""
              : hours <= 24
              ? Math.round(hours)
              : days <= 365
              ? Math.round(days)
              : Math.round(years)
          } ${
            minutes <= 1
              ? ""
              : minutes <= 60
              ? "minute" + (Math.round(minutes) === 1 ? "" : "s")
              : hours <= 24
              ? "hour" + (Math.round(hours) === 1 ? "" : "s")
              : days <= 365
              ? "day" + (Math.round(days) === 1 ? "" : "s")
              : Math.round(years) === 1
              ? "year"
              : "years"
          } ${minutes < 1 ? "" : "ago"}`}
        </p>
        <p>
          {isLightningPayment
            ? "Lightning"
            : isBitcoinPayment
            ? "Bitcion"
            : "Spark"}
        </p>
      </div>
      <p>
        {tx.transferDirection === TransferDirection.OUTGOING ? "-" : "+"}
        {tx.totalValue}
      </p>
    </div>
  );
}
