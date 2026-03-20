import React from "react";
import { Handle, Position } from "reactflow";

const ResultNode = ({ data }) => {
  return (
    <div className="custom-node result-node">
      <Handle type="target" position={Position.Left} />
      <h3>🤖 Result Node</h3>
      <div className="result-box">
        {data.response || "AI response will appear here..."}
      </div>
    </div>
  );
};

export default ResultNode;
