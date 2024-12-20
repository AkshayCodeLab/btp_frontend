import React from "react";

const PathForm = ({ handleInputChange, handleSubmit }) => {
  return (
    <form action="submit">
      <label>From: </label>
      <input placeholder="from" name="from" onChange={handleInputChange} />
      <label>To: </label>
      <input placeholder="to" name="to" onChange={handleInputChange} />
      <label>Fuel: </label>

      <input placeholder="fuel" name="fuel" onChange={handleInputChange} />
      <button onClick={handleSubmit}>Submit</button>
    </form>
  );
};

export default PathForm;
