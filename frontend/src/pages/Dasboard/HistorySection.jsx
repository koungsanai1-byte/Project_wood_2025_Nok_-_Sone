import React from "react";
import Sales_debt from "../Sales/Sales-debt/List"

const HistorySection = () => {
  return (
    <div className="mb-6">

      {/* History Table Card */}
      <div className="rounded-xl p-2 md:p-4">
        <div className="overflow-x-auto">
          <Sales_debt />
        </div>
      </div>
    </div>
  );
};

export default HistorySection;
