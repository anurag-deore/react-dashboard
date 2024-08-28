import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { generateRandomStockData } from "../utils/data-generator";

// Define the data structure
export interface StockData {
  // {"Date":"02/28/2020","Close/Last":"$273.36","Volume":106721200,"Open":"$257.26","High":"$278.41","Low":"$256.37"},
  Date: string;
  "Close/Last": number;
  Volume: number;
  Open: number;
  High: number;
  Low: number;

  // date: Date;
  // price: number;
  // volume: number; // Added volume field
}

interface StockChartProps {
  data: StockData[];
}
enum TimeRange {
  "1d",
  "1w",
  "1m",
  "3m",
  "6m",
  "1y",
  "all",
}

const StockPointsMap: Record<TimeRange, number> = {
  [TimeRange["1d"]]: 100,
  [TimeRange["1w"]]: 200,
  [TimeRange["1m"]]: 300,
  [TimeRange["3m"]]: 400,
  [TimeRange["6m"]]: 600,
  [TimeRange["1y"]]: 800,
  [TimeRange["all"]]: 1000,
};

const StockChart: React.FC<StockChartProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selectedRange, setSelectedRange] = useState<TimeRange>(TimeRange.all);

  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: 400,
  });

  // Update dimensions on window resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: 400 });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

    const { width, height } = dimensions;
    const margin = { top: 20, right: 100, bottom: 100, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Clear any existing SVG content before rendering
    d3.select(svgRef.current).selectAll("*").remove();

    // Create SVG container
    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Define a gradient
    const gradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "area-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    gradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#4B40EE")
      .attr("stop-opacity", 0.1);

    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#4B40EE")
      .attr("stop-opacity", 0);

    const parseDate = d3.timeParse("%m/%d/%Y");
    const dataParsed = data.map((d) => ({ ...d, Date: parseDate(d.Date) }));

    // Set up scales
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(dataParsed, (d) => d.Date) as [Date, Date])
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(dataParsed, (d) => d.Open) || 0])
      .range([innerHeight, 0]);

    const volumeScale = d3
      .scaleLinear()
      .domain([0, d3.max(dataParsed, (d) => d.Volume) || 0])
      .range([0, 30]);

    // Add X axis
    svg
      .append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).tickSize(0).tickValues([]))
      .select("path")
      .attr("stroke", "#E2E4E7");

    // Add Y axis
    svg
      .append("g")
      .call(d3.axisLeft(yScale).tickSize(0).tickValues([]))
      .select("path")
      .attr("stroke", "#E2E4E7");

    // Add volume bars
    svg
      .selectAll(".volume-bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "volume-bar")
      .attr("x", (d) => xScale(new Date(d.Date))) // Center the bar on the x position
      .attr("y", (d) => innerHeight - volumeScale(d.Volume) - 5) // Position bars above the x-axis
      .attr("width", 3) // Width of the volume bar
      .attr("height", (d) => volumeScale(d.Volume))
      .attr("fill", "#E6E8EB");

    // Create the area generator
    const area = d3
      .area<(typeof dataParsed)[0]>()
      .x((d) => xScale(d.Date))
      .y0(innerHeight)
      .y1((d) => yScale(d.Open));

    svg
      .append("path")
      .datum(dataParsed)
      .attr("fill", "url(#area-gradient)")
      .attr("d", area);

    svg
      .append("path")
      .datum(dataParsed)
      .attr("fill", "none")
      .attr("stroke", "#4B40EE")
      .attr("stroke-width", 2)
      .attr(
        "d",
        d3
          .line<(typeof dataParsed)[0]>()
          .x((d) => xScale(d.Date))
          .y((d) => yScale(d.Open))
      );

    // Add the label at the end of the line
    const lastDataPoint = dataParsed[dataParsed.length - 1];
    const lastX = xScale(lastDataPoint.Date);
    const lastY = yScale(lastDataPoint.Open);

    // Add black box behind the text
    const labelGroup = svg
      .append("g")
      .attr("transform", `translate(${lastX}, ${lastY})`);

    labelGroup
      .append("rect")
      .attr("x", -10) // Center the rectangle
      .attr("y", -15) // Position above the point
      .attr("width", 100)
      .attr("height", 30)
      .attr("z-index", 1)
      .attr("fill", "#4B40EE")
      .attr("rx", 4)
      .attr("ry", 4);

    // Add text inside the box
    labelGroup
      .append("text")
      .attr("x", 40) // Center the text horizontally
      .attr("y", 2) // Center the text vertically
      .attr("fill", "white")
      .attr("font-weight", "500")
      .attr("font-family", "PT Root UI VF, system-ui, sans-serif")
      .attr("font-size", "18px")
      .attr("z-index", 1)
      .attr("text-anchor", "middle") // Center align the text
      .attr("dominant-baseline", "middle") // Vertical centering
      .text(lastDataPoint.Open.toFixed(2));

    // Add group for crosshair lines
    const crosshair = svg.append("g").style("display", "none");

    const crosshairLabelBox = crosshair
      .append("rect")
      .attr("width", 100)
      .attr("height", 30)
      .attr("fill", "#1A243A")
      .attr("z-index", 2)
      .attr("rx", 4)
      .attr("ry", 4);

    const crosshairLabel = crosshair
      .append("text")
      .attr("fill", "white")
      .attr("z-index", 2)
      .attr("font-weight", "500")
      .attr("font-family", "PT Root UI VF, system-ui, sans-serif")
      .attr("font-size", "18px")
      .attr("text-anchor", "middle") // Center align the text
      .attr("dominant-baseline", "middle") // Vertical centering
      .style("display", "none");

    // Horizontal line
    crosshair
      .append("line")
      .attr("class", "horizontal")
      .attr("stroke", "gray")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "4");

    // Vertical line
    crosshair
      .append("line")
      .attr("class", "vertical")
      .attr("stroke", "gray")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "4");

    // Circle at the intersection of the lines
    // crosshair.append("circle").attr("r", 0).attr("fill", "gray");

    // Add overlay for capturing mouse movements
    const parsedDate = d3.timeParse("%m/%d/%Y");

    svg
      .append("rect")
      .attr("width", innerWidth)
      .attr("height", innerHeight + 60)
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("mouseover", () => crosshair.style("display", null))
      .on("mouseout", () => crosshair.style("display", "none"))
      .on("mousemove", (event) => {
        const [x] = d3.pointer(event);
        const xDate = xScale.invert(x);

        // Find the closest data point
        const bisectDate = d3.bisector<(typeof dataParsed)[0], Date>(
          (d) => d.Date
        ).left;
        const index = bisectDate(dataParsed, xDate);
        const d0 = dataParsed[index - 1];
        const d1 = dataParsed[index];
        console.log(index, d0, d1);
        const closestData =
          xDate.getTime() - d0.Date.getTime() >
          d1.Date.getTime() - xDate.getTime()
            ? d1
            : d0;

        // Update crosshair position
        crosshair
          .select(".horizontal")
          .attr("x1", 0)
          .attr("x2", innerWidth)
          .attr("y1", yScale(closestData.Open))
          .attr("y2", yScale(closestData.Open));

        crosshair
          .select(".vertical")
          .attr("x1", xScale(closestData.Date))
          .attr("x2", xScale(closestData.Date))
          .attr("y1", 0)
          .attr("y2", innerHeight);

        crosshair
          .select("circle")
          .attr("cx", xScale(closestData.Date))
          .attr("cy", yScale(closestData.Open));

        crosshairLabel
          .style("display", null)
          .attr("y", yScale(closestData.Open))
          .text(closestData.Open.toFixed(2));

        crosshairLabelBox
          .style("display", null)
          .attr("y", yScale(closestData.Open) - 17);
      });

    crosshairLabel.attr("x", lastX + 40);
    crosshairLabelBox.attr("x", lastX - 10);
  }, [data, dimensions, selectedRange]);
  console.log(selectedRange);
  return (
    <div>
      {/* <div className="range-buttons">
        <button onClick={() => setSelectedRange(TimeRange["1d"])}>1D</button>
        <button onClick={() => setSelectedRange("3d")}>3D</button>
        <button onClick={() => setSelectedRange("1w")}>1W</button>
        <button onClick={() => setSelectedRange("1m")}>1M</button>
        <button onClick={() => setSelectedRange("6m")}>6M</button>
        <button onClick={() => setSelectedRange("1y")}>1Y</button>
        <button onClick={() => setSelectedRange("all")}>All</button>
      </div> */}
      <svg id="chart" ref={svgRef} />
    </div>
  );
};

export default StockChart;
