import React from "react";
import BillsSection from "../pages/Dasboard/BillsSection";
import Chart_All from "../pages/Dasboard/Chart_All";
import HistorySection from "../pages/Dasboard/HistorySection";

const Contentt = () => {
  return (
    <div className="-mx-14 mt-4">
      <div className="space-y-10 px-6 ">
        <BillsSection />
        <Chart_All />
        <HistorySection />
      </div>
    </div>
  );
};

export default Contentt;
