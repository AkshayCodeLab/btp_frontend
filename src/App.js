import { useRef, useState } from "react";
import "./App.css";
import useFetchGraph from "./hooks/useFetchGraph";
import { transformGraphData } from "./utils/dataTransformer";
import { apiService } from "./services/apiService";
import { Graph, PathForm, CalibrationForm } from "./components";
import { INITIAL_GRAPH_DATA } from "./constants";

function App() {
  const [error, setError] = useState("");
  const [path, setPath] = useState([]);
  const [vehicleModel, setVehicleModel] = useState("");
  const [simulData, setSimulData] = useState(
    transformGraphData(INITIAL_GRAPH_DATA)
  );
  const { graph, loading } = useFetchGraph(INITIAL_GRAPH_DATA, setError);

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
      setSimulData(transformGraphData(INITIAL_GRAPH_DATA));
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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="App">
      <Graph simulData={simulData} path={path} />

      {error && <div className="error">{error}</div>}

      <CalibrationForm
        vehicleModel={vehicleModel}
        setVehicleModel={setVehicleModel}
        handleCaliberation={handleCaliberation}
      />

      <PathForm
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />

      {!graph && "Loading..."}
    </div>
  );
}

export default App;
