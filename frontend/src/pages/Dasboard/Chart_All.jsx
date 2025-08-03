import React from "react";
import Chart_A from "./Chart_A";
import Chart_B from "./Chart_B";
import Chart_C from "./Chart_C";

const InvoicesSection = () => {
  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="grid grid-cols-1 mx-10 md:grid-cols-2 lg:grid-cols-3 rounded-xl  p-4 lg:col-span-4 gap-x-32">
          <div className="mt-2 bg-white p-4 mb-10 rounded-2xl shadow-md hover:shadow-2xl">
            <Chart_A />
          </div>
          <div className="mt-2 bg-white p-4 mb-10 rounded-2xl shadow-md hover:shadow-2xl">
            <Chart_B />
          </div>
          <div className="mt-2 bg-white p-4 mb-10 rounded-2xl shadow-md hover:shadow-2xl">
            <Chart_C />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicesSection;
