import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

const data = {
  n: 8,
  from: 1,
  to: 5,
  edges: [
    [1, 2, 8],
    [1, 7, 3],
    [1, 3, 7],
    [2, 7, 3],
    [2, 4, 2],
    [3, 7, 6],
    [3, 6, 1],
    [4, 5, 4],
    [5, 6, 2],
    [5, 7, 12],
    [6, 7, 2],
  ],
};

function App() {
  const [graph, setGraph] = useState([]);

  useEffect(() => {
    fetchGraphData(data);
  }, []);

  const fetchGraphData = async (data) => {
    try {
      const response = await axios.get("http://localhost:8080/graph");
      console.log(response.data);
      setGraph(response.data); // Set graph with fetched data
    } catch (error) {
      console.log("Error in fetching graph: ", error);
    }
  };

  return (
    <div className="App">
      {graph ? <pre>{JSON.stringify(graph, null, 2)}</pre> : "Loading..."}
    </div>
  );
}

export default App;
