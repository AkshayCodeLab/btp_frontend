import React, { useState } from "react";
import * as d3 from "d3";
import ForceDirectedGraph from "./ForceDirectedGraph";

const Graph = ({ simulData, path }) => {
  const [data, setData] = useState(() => d3.ticks(-2, 2, 200).map(Math.sin));

  const onMouseMove = (event) => {
    const [x, y] = d3.pointer(event);
    setData(data.slice(-200).concat(Math.atan2(x, y)));
  };

  return (
    <div onMouseMove={onMouseMove}>
      <ForceDirectedGraph data={simulData} pathNodes={path} />
    </div>
  );
};

export default Graph;
