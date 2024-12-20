import React from "react";
import { VEHICLE_OPTIONS } from "../constants";

const CalibrationForm = ({
  vehicleModel,
  setVehicleModel,
  handleCaliberation,
}) => {
  return (
    <form action="submit">
      <label>Vehicle Model: </label>
      <select
        name="select"
        value={vehicleModel}
        onChange={(e) => setVehicleModel(e.target.value)}
      >
        {VEHICLE_OPTIONS.map((vehicle) => (
          <option value={vehicle.value} key={vehicle.label}>
            {vehicle.label}
          </option>
        ))}
      </select>
      <button onClick={handleCaliberation}>Calibrate</button>
    </form>
  );
};

export default CalibrationForm;
