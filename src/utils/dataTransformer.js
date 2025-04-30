export const transformGraphData = (graphicalData) => {
  const newData = {
    nodes: [],
    links: [],
    unit: " KWH",
  };

  graphicalData.edges.forEach((edge) => {
    newData.links.push({
      source: edge[0],
      target: edge[1],
      value: edge[2],
    });
  });

  for (let i = 1; i < graphicalData.vertices; i++) {
    newData.nodes.push({
      id: i,
      group: 1,
    });
  }

  return newData;
};
