import { useState } from "react";
import "./App.css";
import * as d3 from "d3";
import axios from "axios";
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

graphicalData.edges.forEach((edge) => {
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

function App() {
  const [graph, setGraph] = useState([]);
  const [to, setTo] = useState(null);
  const [from, setFrom] = useState(null);
  const [fuel, setFuel] = useState(null);
  const [error, setError] = useState("");
  const [data, setData] = useState(() => d3.ticks(-2, 2, 200).map(Math.sin));
  const [path, setPath] = useState([]);
  const [vehicleModel, setVehicleModel] = useState("");
  const [simulData, setSimulData] = useState(newData);
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

  const handleCaliberation = async (e) => {
    e.preventDefault();
    if (vehicleModel.length === 0) return;

    const response = await axios.post("http://localhost:8080/caliberate", {
      name: vehicleModel,
    });

    setSimulData({
      nodes: simulData.nodes,
      links: response.data,
    });
  };

  function onMouseMove(event) {
    const [x, y] = d3.pointer(event);
    setData(data.slice(-200).concat(Math.atan2(x, y)));
  }

  return (
    <div className="App">
      <div onMouseMove={onMouseMove}>
        <ForceDirectedGraph data={simulData} pathNodes={path} />
      </div>
      {error && <div>The path can't be traversed!</div>}

      <form action="submit">
        <label>Vehicle Model: </label>
        <select
          name="select"
          value={vehicleModel}
          onChange={(e) => setVehicleModel(e.target.value)}
        >
          <option value="">Select</option>
          <option value="Tesla Model 3">Tesla Model 3</option>
          <option value="Tesla Model Y">Tesla Model Y</option>
          <option value="Hyundai Kona Electric">Hyundai Kona Electric</option>
        </select>
        <button onClick={handleCaliberation}>Submit</button>
      </form>

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
        <label>Fuel: </label>

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
