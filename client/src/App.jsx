import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from "reactflow";
import API from "./api";
import InputNode from "./components/InputNode";
import ResultNode from "./components/ResultNode";

const nodeTypes = {
  inputNode: InputNode,
  resultNode: ResultNode,
};

const App = () => {
  const [prompt, setPrompt] = useState("");
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const initialNodes = useMemo(
    () => [
      {
        id: "1",
        type: "inputNode",
        position: { x: 80, y: 100 },
        data: {
          prompt,
          onChange: setPrompt,
        },
      },
      {
        id: "2",
        type: "resultNode",
        position: { x: 520, y: 100 },
        data: {
          response: responseText,
        },
      },
    ],
    [prompt, responseText]
  );

  const initialEdges = useMemo(
    () => [
      {
        id: "e1-2",
        source: "1",
        target: "2",
        animated: true,
        label: "AI Flow",
      },
    ],
    []
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === "1") {
          return {
            ...node,
            data: {
              ...node.data,
              prompt,
              onChange: setPrompt,
            },
          };
        }
        if (node.id === "2") {
          return {
            ...node,
            data: {
              ...node.data,
              response: responseText,
            },
          };
        }
        return node;
      })
    );
  }, [prompt, responseText, setNodes]);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await API.get("/history");
      setHistory(res.data);
    } catch (error) {
      console.error("History fetch failed:", error);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleRunFlow = async () => {
    if (!prompt.trim()) {
      alert("Please enter a prompt first.");
      return;
    }

    try {
      setLoading(true);
      setResponseText("Generating AI response...");

      const res = await API.post("/ask-ai", { prompt });
      setResponseText(res.data.response);
    } catch (error) {
      console.error(error);
      setResponseText("Error: Failed to get AI response.");
      alert("Failed to get AI response.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!prompt.trim() || !responseText.trim() || responseText === "Generating AI response...") {
      alert("Run the flow first, then save.");
      return;
    }

    try {
      await API.post("/save", {
        prompt,
        response: responseText,
      });

      alert("Saved successfully!");
      fetchHistory();
    } catch (error) {
      console.error(error);
      alert("Failed to save data.");
    }
  };

  return (
    <div className="app-container">
      <h1>MERN AI Flow App</h1>
      <p className="subtitle">
        Type a prompt in the Input Node, click Run Flow, and see the AI response.
      </p>

      <div className="button-group">
        <button onClick={handleRunFlow} disabled={loading}>
          {loading ? "Running..." : "Run Flow"}
        </button>
        <button onClick={handleSave} className="save-btn">
          Save
        </button>
      </div>

      <div className="flow-wrapper">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>

      <div className="history-section">
        <h2>Saved History (Bonus)</h2>
        {history.length === 0 ? (
          <p>No saved records yet.</p>
        ) : (
          history.map((item) => (
            <div className="history-card" key={item._id}>
              <p><strong>Prompt:</strong> {item.prompt}</p>
              <p><strong>Response:</strong> {item.response}</p>
              <small>{new Date(item.createdAt).toLocaleString()}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default App;
