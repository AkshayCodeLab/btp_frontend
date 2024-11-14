import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const ForceDirectedGraph = ({ data }) => {
  const svgRef = useRef(null);
  const width = 928;
  const height = 680;

  useEffect(() => {
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Create copies of the data to avoid mutation
    const links = data.links.map((d) => ({ ...d }));
    const nodes = data.nodes.map((d) => ({ ...d }));

    // Initialize the force simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3.forceLink(links).id((d) => d.id)
      )
      .force("charge", d3.forceManyBody().strength(-10000)) // Increase the strength of repulsion
      .force("x", d3.forceX())
      .force("y", d3.forceY());

    // Create the SVG element
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .style("max-width", "100%")
      .style("height", "auto");

    // Add links as lines
    const link = svg
      .append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", (d) => Math.sqrt(d.value));

    // Add nodes as circles
    const node = svg
      .append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 10)
      .attr("fill", (d) => color(d.group))
      .call(drag(simulation));

    // Add node labels
    const nodeLabel = svg
      .append("g")
      .attr("font-size", 12)
      .attr("fill", "#000")
      .attr("dy", -10)
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text((d) => d.id);

    // Update positions on each tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

      nodeLabel.attr("x", (d) => d.x).attr("y", (d) => d.y - 10);
    });

    // Drag functions
    function drag(simulation) {
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }

    // Cleanup on unmount
    return () => simulation.stop();
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default ForceDirectedGraph;
