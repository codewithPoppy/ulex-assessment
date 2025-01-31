import React from "react";

const DummyQueries = () => {
  const dummyQueries = [
    "Do you know Honeycomb Investment Trust plc?",
    "what is the Broker Agreement of Honeycomb Investment Trust plc about?",
  ];

  return (
    <div>
      <h3>Try Different queries</h3>
      <ul className="list-disc list-inside">
        {dummyQueries.map((q) => (
          <li key={q}>{q}</li>
        ))}
      </ul>
    </div>
  );
};

export default DummyQueries;
