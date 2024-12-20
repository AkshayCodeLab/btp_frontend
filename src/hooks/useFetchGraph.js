import { useEffect, useState } from "react";
import { apiService } from "../services/apiService";
const useFetchGraph = (graphicalData, setError) => {
  const [graph, setGraph] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGraphData(graphicalData);
  }, [graphicalData]);

  const fetchGraphData = async (data) => {
    try {
      const graphData = await apiService.getGraph(graphicalData);
      setGraph(graphData);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };
  return { graph, loading };
};

export default useFetchGraph;
