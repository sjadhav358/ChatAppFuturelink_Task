import React from "react";
import { Handle, Position } from "reactflow";

const InputNode = ({ data }) => {
  return (
    <div className="custom-node input-node">
      <Handle type="source" position={Position.Right} />
      <h3>📝 Input Node</h3>
      <textarea
        value={data.prompt}
        onChange={(e) => data.onChange(e.target.value)}
        placeholder="Type your prompt here..."
        rows={6}
      />
    </div>
  );
};

export default InputNode;
