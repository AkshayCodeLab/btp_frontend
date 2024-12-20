import { useRef, useState } from "react";
import "./App.css";
import * as d3 from "d3";
import ForceDirectedGraph from "./ForceDirectedGraph";
import useFetchGraph from "./hooks/useFetchGraph";
import { transformGraphData } from "./utils/dataTransformer";
import { apiService } from "./services/apiService";
const initialGraphData = {
  n: 8,
  from: 1,
  to: 5,
  edges: [
    [1, 2, 58],
    [1, 7, 44],
    [1, 3, 52],
    [2, 7, 22],
    [2, 4, 15],
    [3, 7, 44],
    [3, 6, 15],
    [4, 5, 29],
    [5, 6, 15],
    [5, 7, 88],
    [6, 7, 29],
  ],
};

function App() {
  const [error, setError] = useState("");
  const [data, setData] = useState(() => d3.ticks(-2, 2, 200).map(Math.sin));
  const [path, setPath] = useState([]);
  const [vehicleModel, setVehicleModel] = useState("");
  const [simulData, setSimulData] = useState(
    transformGraphData(initialGraphData)
  );
  const { graph, loading } = useFetchGraph(initialGraphData, setError);

  const formRef = useRef({
    to: "",
    from: "",
    fuel: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    formRef.current[name] = value;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { to, from, fuel } = formRef.current;

    try {
      const response = await apiService.findShortestPath({ to, from, fuel });

      if (response?.second.length === 0) {
        setError("Insufficient fuel to traverse path!");
        setPath([]);
      } else {
        setError("");
        setPath(response?.second);
      }
    } catch (error) {
      setError("An error occurred while finding the path");
    }
  };

  const handleCaliberation = async (e) => {
    e.preventDefault();

    setPath([]);
    if (!vehicleModel) {
      setSimulData(transformGraphData(initialGraphData));
      return;
    }

    try {
      const calibratedLinks = await apiService.calibrateVehicle(vehicleModel);

      setSimulData({
        ...simulData,
        links: calibratedLinks,
        unit: " KWH",
      });
    } catch (error) {
      console.err("Calibration Error: ", error);
      setError("Error while calibrating the Graph.");
    }
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

      {error && <div className="error">{error}</div>}
      {loading && <div>Loading...</div>}

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
        <button onClick={handleCaliberation}>Calibrate</button>
      </form>

      <form action="submit">
        <label>From: </label>
        <input placeholder="from" name="from" onChange={handleInputChange} />
        <label>To: </label>
        <input placeholder="to" name="to" onChange={handleInputChange} />
        <label>Fuel: </label>

        <input placeholder="fuel" name="fuel" onChange={handleInputChange} />
        <button onClick={handleSubmit}>Submit</button>
      </form>

      {!graph && "Loading..."}
    </div>
  );
}

export default App;
