import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const ForceDirectedGraph = ({ data, pathNodes }) => {
  const svgRef = useRef(null);
  const width = 1600; // Increased width
  const height = 1200; // Increased height

  const isContributingEdge = (source, target) => {
    const sourceIndex = pathNodes.indexOf(source);
    const targetIndex = pathNodes.indexOf(target);

    return (
      sourceIndex !== -1 &&
      targetIndex !== -1 &&
      Math.abs(sourceIndex - targetIndex) === 1
    );
  };

  useEffect(() => {
    // Clear existing SVG elements to avoid overlapping
    d3.select(svgRef.current).selectAll("*").remove();

    // Create copies of the data to avoid mutation
    const links = data.links.map((d) => ({ ...d }));
    const nodes = data.nodes.map((d) => ({ ...d }));

    // Initialize the force simulation with improved positioning
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d) => d.id)
          .distance((d) => {
            return 100 * Math.pow(d.value, 0.7);
          })
      )
      .force("charge", d3.forceManyBody().strength(-4000))
      .force("center", d3.forceCenter(0, 0))
      .force("x", d3.forceX(0).strength(0.1))
      .force("y", d3.forceY(0).strength(0.1));

    // Create the SVG element with larger viewport
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
      .attr("stroke-width", (d) => Math.sqrt(d.value))
      .attr("stroke", (d) =>
        isContributingEdge(d.source.id, d.target.id) ? "red" : "#999"
      );

    // Add nodes as circles
    const node = svg
      .append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 10)
      .attr("fill", (d) => (pathNodes.includes(d.id) ? "red" : "green"))
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

    // Add weights as text on edges
    const edgeWeight = svg
      .append("g")
      .attr("font-size", 10)
      .attr("fill", "#000")
      .selectAll("text")
      .data(links)
      .join("text")
      .text((d) => d.value + (data?.unit ? data?.unit : " KM"));

    // Update positions on each tick
    simulation.on("tick", () => {
      // Constrain nodes to stay within the viewport
      const radius = 10; // Node radius
      const padding = 20; // Additional padding from the edge
      const halfWidth = width / 2 - radius - padding;
      const halfHeight = height / 2 - radius - padding;

      nodes.forEach((node) => {
        node.x = Math.max(-halfWidth, Math.min(halfWidth, node.x));
        node.y = Math.max(-halfHeight, Math.min(halfHeight, node.y));
      });

      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

      nodeLabel.attr("x", (d) => d.x).attr("y", (d) => d.y - 15);

      edgeWeight
        .attr("x", (d) => (d.source.x + d.target.x) / 2 + 10)
        .attr("y", (d) => (d.source.y + d.target.y) / 2 - 10);
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
  }, [data, pathNodes]);

  return <svg ref={svgRef}></svg>;
};

export default ForceDirectedGraph;
