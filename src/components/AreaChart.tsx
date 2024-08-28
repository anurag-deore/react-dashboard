import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import jsonData from "./csvjson.json";
import { useChartStore } from "../store/useStore";
import { RangeValues } from "../store/types";
import clsx from "clsx";
import RangeTabs from "./RangeTabs";
import NavTabs from "./NavTabs";

interface StockData {
  Date: string;
  "Close/Last": number;
  Volume: number;
  Open: number;
  High: number;
  Low: number;
}

const AreaChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [data, setData] = useState<StockData[]>([]);
  const [filteredData, setFilteredData] = useState<StockData[]>([]);

  const setStockPrice = useChartStore().setLatestPrice;
  const selectedRange = useChartStore().currentRange;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rwdata: StockData[] = JSON.parse(JSON.stringify(jsonData));
        setData(rwdata);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data.length <= 0) return;
    filterData(selectedRange);
  }, [data, selectedRange]);

  useEffect(() => {
    if (filteredData.length <= 0) return;
    createChart(filteredData);
  }, [filteredData]);

  const filterData = (range: RangeValues) => {
    const now = new Date(data[0].Date); // Assume the last date in the data is the "present day"
    let filtered = data;
    switch (range) {
      case RangeValues["1d"]:
        filtered = data.filter(
          (d) => new Date(d.Date) >= d3.timeDay.offset(now, -1)
        );
        break;
      case RangeValues["3d"]:
        filtered = data.filter(
          (d) => new Date(d.Date) >= d3.timeDay.offset(now, -3)
        );
        break;
      case RangeValues["1w"]:
        filtered = data.filter(
          (d) => new Date(d.Date) >= d3.timeWeek.offset(now, -1)
        );
        break;
      case RangeValues["1m"]:
        filtered = data.filter(
          (d) => new Date(d.Date) >= d3.timeMonth.offset(now, -1)
        );
        break;
      case RangeValues["6m"]:
        filtered = data.filter(
          (d) => new Date(d.Date) >= d3.timeMonth.offset(now, -6)
        );
        break;
      case RangeValues["1y"]:
        filtered = data.filter(
          (d) => new Date(d.Date) >= d3.timeYear.offset(now, -1)
        );
        break;
      case RangeValues["3y"]:
        filtered = data.filter(
          (d) => new Date(d.Date) >= d3.timeYear.offset(now, -3)
        );
        break;
      case RangeValues["5y"]:
        filtered = data.filter(
          (d) => new Date(d.Date) >= d3.timeYear.offset(now, -5)
        );
        break;
      case RangeValues["all"]:
      default:
        filtered = data;
        break;
    }

    setFilteredData(filtered);
  };

  const createChart = (data: StockData[]) => {
    if (!svgRef.current) return;

    if (!data || data.length === 0) {
      return;
    }

    const width = 840;
    const height = 400;
    const margin = { top: 28, right: 90, bottom: 1, left: 0 };

    const svg = d3.select(svgRef.current);
    // .attr("preserveAspectRatio", "xMidYMid meet")
    // .attr("viewBox", `0 0 ${width} ${height}`)
    // .attr("preserveAspectRatio", "xMidYMid meet")
    // .append("g")
    // .attr("transform", `translate(${margin.left},${margin.top})`);

    svg.selectAll("*").remove(); // Clear existing content

    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => new Date(d.Date)) as [Date, Date])
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d["Close/Last"]) as number])
      .range([height - margin.bottom, margin.top]);

    y.domain([
      d3.min(filteredData, (d) => d["Close/Last"] - 50) as number,
      d3.max(filteredData, (d) => d["Close/Last"]) as number,
    ]);

    const yVolume = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.Volume) as number])
      .range([0, 50]);

    const area = d3
      .area<StockData>()
      .x((d) => x(new Date(d.Date)))
      .y0(height - margin.bottom)
      .y1((d) => y(d["Close/Last"]));

    svg.attr("width", width).attr("height", height);

    svg
      .select(".y-axis")
      .transition()
      .duration(750)
      .call(d3.axisLeft(y).tickSize(-width + margin.left + margin.right));

    // Redraw the area with the updated y scale
    svg
      .select("path")
      .datum(filteredData)
      .transition()
      .duration(750)
      .attr("d", area);

    // Create gradient
    const gradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "area-gradient")
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

    // Draw area
    svg
      .append("path")
      .datum(data)
      .attr("fill", "url(#area-gradient)")
      .attr("d", area);

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#4B40EE")
      .attr("stroke-width", 1.5)
      .attr(
        "d",
        d3
          .line<(typeof data)[0]>()
          .x((d) => x(new Date(d.Date)))
          .y((d) => y(d["Close/Last"]))
      );

    svg
      .selectAll(".volume-bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "volume-bar")
      .attr("x", (d) => x(new Date(d.Date)))
      .attr("y", (d) => height - yVolume(d.Volume) - 5)

      .attr("width", 2)
      .attr("height", (d) => yVolume(d.Volume))
      .attr("fill", "#E6E8EB");

    // Add x and y axes without ticks or labels
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSize(0).tickValues([]))
      .select("path")
      .attr("stroke", "#E2E4E7");

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickSize(0).tickValues([]))
      .select("path")
      .attr("stroke", "#E2E4E7");

    const lastDataPoint = data[0];
    const lastX = x(new Date(lastDataPoint.Date));
    const lastY = y(lastDataPoint["Close/Last"]);

    setStockPrice(lastDataPoint["Close/Last"]);

    const lastPointLabel = svg
      .append("g")
      .attr("transform", `translate(${lastX}, ${lastY})`);

    lastPointLabel
      .append("rect")
      .attr("x", -20) // Center the rectangle
      .attr("y", -15) // Position above the point
      .attr("width", 109)
      .attr("height", 30)
      .attr("z-index", 1)
      .attr("fill", "#4B40EE")
      .attr("rx", 4)
      .attr("ry", 4);

    const lastPointBBox = lastPointLabel.node()!.getBBox();

    // Add text inside the box
    lastPointLabel
      .append("text")
      .attr("x", lastPointBBox.x + lastPointBBox.width / 2) // Center the text horizontally
      .attr("y", 2) // Center the text vertically
      .attr("fill", "white")
      .attr("font-weight", "500")
      .attr("font-family", "PT Root UI VF, system-ui, sans-serif")
      .attr("font-size", "18px")
      .attr("z-index", 1)
      .attr("text-anchor", "middle") // Center align the text
      .attr("dominant-baseline", "middle") // Vertical centering
      .text(lastDataPoint["Close/Last"].toFixed(2));

    // Create crosshair group
    const crosshair = svg
      .append("g")
      .attr("class", "crosshair")
      .style("display", "none");

    // Add vertical line to crosshair
    crosshair
      .append("line")
      .attr("id", "crosshairX")
      .attr("stroke", "gray")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "5,5")
      .attr("y1", margin.top)
      .attr("y2", height - margin.bottom);

    // Add horizontal line to crosshair
    crosshair
      .append("line")
      .attr("id", "crosshairY")
      .attr("stroke", "gray")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "5,5")
      .attr("x1", margin.left)
      .attr("x2", width - margin.right);

    const labelBackground = crosshair
      .append("rect")
      .attr("id", "crosshairLabelBackground")
      .attr("width", 109)
      .attr("height", 30)
      .attr("z-index", 2)
      .attr("fill", "#1A243A")
      .attr("rx", 4)
      .attr("ry", 4);

    // Add label for displaying the value
    const label = crosshair
      .append("text")
      .attr("id", "crosshairLabel")
      .attr("fill", "white")
      .attr("font-weight", "500")
      .attr("font-family", "PT Root UI VF, system-ui, sans-serif")
      .attr("font-size", "18px")
      .attr("z-index", 1)
      .attr("text-anchor", "middle") // Center align the text
      .attr("dominant-baseline", "middle") // Vertical centering
      .text(lastDataPoint.Open.toFixed(2));

    // Create overlay for capturing mouse events
    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("mouseover", () => crosshair.style("display", null))
      .on("mouseout", () => crosshair.style("display", "none"))
      .on("mousemove", function (event) {
        const [mouseX] = d3.pointer(event);
        const date = x.invert(mouseX);

        // Find the closest data point
        const closestData = data.reduce((a, b) => {
          return Math.abs(new Date(a.Date).getTime() - date.getTime()) <
            Math.abs(new Date(b.Date).getTime() - date.getTime())
            ? a
            : b;
        });
        const closestX = x(new Date(closestData.Date));
        const closestY = y(closestData["Close/Last"]);

        // Update crosshair position
        crosshair
          .select("#crosshairX")
          .attr("x1", closestX)
          .attr("x2", closestX);

        crosshair
          .select("#crosshairY")
          .attr("y1", closestY)
          .attr("y2", closestY);

        // Get the size of the label text and adjust background size accordingly
        labelBackground
          .attr("x", width - margin.right - 20) // Slight padding
          .attr("y", closestY - 15);
        const labelBBox = labelBackground.node()!.getBBox();
        label
          .attr("x", labelBBox.x + labelBBox.width / 2) // Position the label at the end of the horizontal line
          .attr("y", closestY + 2)
          // .text(closestData["Close/Last"].toFixed(2)); // Display the value with 2 decimal places
          .text(closestData["Close/Last"].toFixed(2)); // Display the value with 2 decimal places
      });
  };

  return (
    <div className="flex flex-col p-60">
      <RangeTabs />
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default AreaChart;
