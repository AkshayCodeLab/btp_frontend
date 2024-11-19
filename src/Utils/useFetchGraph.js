import axios from "axios";
import { useEffect } from "react";

const useFetchGraph = (graphicalData, setGraph) => {
  useEffect(() => {
    fetchGraphData(graphicalData);
  }, []);

  const fetchGraphData = async (data) => {
    try {
      const response = await axios.post("http://localhost:8080/getGraph", data);
      console.log(response.data);
      setGraph(response.data); // Set graph with fetched data
    } catch (error) {
      console.log("Error in fetching graph: ", error);
    }
  };
};

export default useFetchGraph;
