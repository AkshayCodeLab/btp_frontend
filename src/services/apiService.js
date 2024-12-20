import axios from "axios";

export const apiService = {
  getGraph: async (graphData) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/getGraph`,
        graphData
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching Graph:", error);
      throw error;
    }
  },
  findShortestPath: async (pathParams) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/shortestPath`,
        pathParams
      );
      return response.data;
    } catch (error) {
      console.error("Error finding shortest path:", error);
      throw error;
    }
  },
  calibrateVehicle: async (vehicleModel) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/caliberate`,
        { name: vehicleModel }
      );
      return response.data;
    } catch (error) {
      console.error("Error calibrating vehicle:", error);
      throw error;
    }
  },
};
