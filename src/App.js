import { useEffect, useState } from "react";
import "./App.css";
import * as d3 from "d3";
import axios from "axios";
import LinePlot from "./LinePlot";
import ForceDirectedGraph from "./ForceDirectedGraph";
import useFetchGraph from "./Utils/useFetchGraph";

const graphicalData = {
  n: 8,
  from: 1,
  to: 5,
  edges: [
    [1, 2, 8],
    [1, 7, 6],
    [1, 3, 7],
    [2, 7, 3],
    [2, 4, 2],
    [3, 7, 6],
    [3, 6, 2],
    [4, 5, 4],
    [5, 6, 2],
    [5, 7, 12],
    [6, 7, 4],
  ],
};

const newData = {
  nodes: [],
  links: [],
};

graphicalData.edges.map((edge) => {
  newData.links.push({
    source: edge[0],
    target: edge[1],
    value: edge[2],
  });
});

for (let i = 1; i <= graphicalData.n; i++) {
  newData.nodes.push({
    id: i,
    group: 1,
  });
}
const interactiveData = {
  nodes: [
    {
      id: "1",
      group: "1",
      radius: 1,
      citing_patents_count: 1,
    },
    {
      id: "2",
      group: "2",
      radius: 1,
      citing_patents_count: 1,
    },
    {
      id: "3",
      group: "2",
      radius: 1,
      citing_patents_count: 1,
    },
    {
      id: "4",
      group: "3",
      radius: 3,
      citing_patents_count: 3,
    },
    {
      id: "5",
      group: "10",
      radius: 3,
      citing_patents_count: 3,
    },
    {
      id: "6",
      group: "10",
      radius: 3,
      citing_patents_count: 3,
    },
  ],
  links: [
    {
      source: "1",
      target: "2",
      value: 10,
    },
    {
      source: "2",
      target: "3",
      value: 5,
    },
    {
      source: "3",
      target: "4",
      value: 10,
    },
    {
      source: "4",
      target: "5",
      value: 2,
    },
    {
      source: "5",
      target: "1",
      value: 2,
    },
    {
      source: "1",
      target: "3",
      value: 2,
    },
    {
      source: "1",
      target: "4",
      value: 2,
    },
    {
      source: "1",
      target: "6",
      value: 2,
    },
  ],
};

function App() {
  const [graph, setGraph] = useState([]);
  const [to, setTo] = useState(null);
  const [from, setFrom] = useState(null);
  const [fuel, setFuel] = useState(null);
  const [error, setError] = useState("");
  const [data, setData] = useState(() => d3.ticks(-2, 2, 200).map(Math.sin));
  const [path, setPath] = useState([]);
  useFetchGraph(graphicalData, setGraph);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post("http://localhost:8080/shortestPath", {
      to: to,
      from: from,
      fuel: fuel,
    });

    console.log(response.data);

    if (response.data?.second.length === 0) {
      setError("Insufficient fuel to traverse path!");
    } else {
      setError("");
      setPath(response.data?.second);
    }
  };

  function onMouseMove(event) {
    const [x, y] = d3.pointer(event);
    setData(data.slice(-200).concat(Math.atan2(x, y)));
  }

  return (
    <div className="App">
      <div onMouseMove={onMouseMove}>
        <ForceDirectedGraph data={newData} pathNodes={path} />
      </div>
      {error && <div>The path can't be traversed!</div>}
      <form action="submit">
        <label>From: </label>
        <input
          placeholder="from"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <label>To: </label>
        <input
          placeholder="to"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <input
          placeholder="fuel"
          value={fuel}
          onChange={(e) => setFuel(e.target.value)}
        />
        <button onClick={handleSubmit}>Submit</button>
      </form>

      {graph ? <pre>{JSON.stringify(graph, null, 2)}</pre> : "Loading..."}
    </div>
  );
}

export default App;
