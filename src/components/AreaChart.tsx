import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import jsonData from "./csvjson.json";
import googleData from "./google.json";
import { useChartStore } from "../store/useStore";
import { AvailableCharts, RangeValues } from "../store/types";
import RangeTabs from "./RangeTabs";
import { chartColors } from "../utils/constants";

export interface StockData {
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
  const [data1, setData1] = useState<StockData[]>([]);
  const [filteredData, setFilteredData] = useState<StockData[]>([]);
  const [filteredData1, setFilteredData1] = useState<StockData[]>([]);

  const selectedCharts = useChartStore().selectedCharts;

  const setStockPrice = useChartStore().setLatestPrice;
  const selectedRange = useChartStore().currentRange;

  const isFullScreen = useChartStore().isFullScreen;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rwdata: StockData[] = JSON.parse(JSON.stringify(jsonData));
        setData(rwdata);
        const ggData: StockData[] = JSON.parse(JSON.stringify(googleData));
        setData1(ggData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data.length <= 0) return;
    filterData(selectedRange);
  }, [data, selectedRange, selectedCharts]);

  useEffect(() => {
    if (filteredData.length <= 0) return;
    const charts = [filteredData];
    if (selectedCharts.includes(AvailableCharts.Chart2)) {
      charts.push(filteredData1);
    }
    createChart(charts);
  }, [filteredData, filteredData1, selectedCharts, isFullScreen]);

  const filterData = (range: RangeValues) => {
    const now = new Date(data[0].Date); // Assume the last date in the data is the "present day"
    let filtered = data;
    let filtered1 = data1;

    switch (range) {
      case RangeValues["1d"]:
        filtered = data.filter(
          (d) => new Date(d.Date) >= d3.timeDay.offset(now, -1)
        );
        filtered1 = data1.filter(
          (d) => new Date(d.Date) >= d3.timeDay.offset(now, -1)
        );
        break;
      case RangeValues["3d"]:
        filtered = data.filter(
          (d) => new Date(d.Date) >= d3.timeDay.offset(now, -3)
        );
        filtered1 = data1.filter(
          (d) => new Date(d.Date) >= d3.timeDay.offset(now, -3)
        );
        break;
      case RangeValues["1w"]:
        filtered = data.filter(
          (d) => new Date(d.Date) >= d3.timeWeek.offset(now, -1)
        );
        filtered1 = data1.filter(
          (d) => new Date(d.Date) >= d3.timeWeek.offset(now, -1)
        );
        break;
      case RangeValues["1m"]:
        filtered = data.filter(
          (d) => new Date(d.Date) >= d3.timeMonth.offset(now, -1)
        );
        filtered1 = data1.filter(
          (d) => new Date(d.Date) >= d3.timeMonth.offset(now, -1)
        );
        break;
      case RangeValues["6m"]:
        filtered = data.filter(
          (d) => new Date(d.Date) >= d3.timeMonth.offset(now, -6)
        );
        filtered1 = data1.filter(
          (d) => new Date(d.Date) >= d3.timeMonth.offset(now, -6)
        );
        break;
      case RangeValues["1y"]:
        filtered = data.filter(
          (d) => new Date(d.Date) >= d3.timeYear.offset(now, -1)
        );
        filtered1 = data1.filter(
          (d) => new Date(d.Date) >= d3.timeYear.offset(now, -1)
        );
        break;
      case RangeValues["3y"]:
        filtered = data.filter(
          (d) => new Date(d.Date) >= d3.timeYear.offset(now, -3)
        );
        filtered1 = data1.filter(
          (d) => new Date(d.Date) >= d3.timeYear.offset(now, -3)
        );
        break;
      case RangeValues["5y"]:
        filtered = data.filter(
          (d) => new Date(d.Date) >= d3.timeYear.offset(now, -5)
        );
        filtered1 = data1.filter(
          (d) => new Date(d.Date) >= d3.timeYear.offset(now, -5)
        );
        break;
      case RangeValues["max"]:
      default:
        filtered = data;
        filtered1 = data1;
        break;
    }

    setFilteredData(filtered);
    setFilteredData1(filtered1);
  };

  const createChart = (datasets: StockData[][]) => {
    if (!svgRef.current) return;

    if (!datasets || datasets.length === 0) {
      return;
    }

    const width = isFullScreen ? window.innerWidth - 200 : 840;
    const height = isFullScreen ? window.innerHeight - 100 : 400;
    const margin = { top: 28, right: 90, bottom: 1, left: 0 };

    const svg = d3.select(svgRef.current);

    svg.selectAll("*").remove();

    const x = d3
      .scaleTime()
      .domain(d3.extent(datasets[0], (d) => new Date(d.Date)) as [Date, Date])
      .range([margin.left, width - margin.right]);

    const maxY = d3.max(datasets.flat(), (d) => d["Close/Last"]) as number;
    const minY = d3.min(datasets.flat(), (d) => d["Close/Last"]) as number;
    const y = d3
      .scaleLinear()
      .domain([0, maxY])
      .range([height - margin.bottom, margin.top]);

    const yVolume = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.Volume) as number])
      .range([0, minY * 2]);

    const area = d3
      .area<StockData>()
      .x((d) => x(new Date(d.Date)))
      .y0(height - margin.bottom)
      .y1((d) => y(d["Close/Last"]));

    svg.attr("width", width).attr("height", height);

    svg
      .append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(5)
          .tickSize(-height + margin.top + margin.bottom)
          .tickFormat(() => "")
      )
      .selectAll(".tick line")
      .attr("stroke", "#E2E4E7");

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSize(0).tickValues([]))
      .select("path")
      .attr("stroke", "#E2E4E7");

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickSize(0))
      .select("path")
      .attr("stroke", "#E2E4E7");
    datasets.forEach((chartData, index) => {
      const gradient = svg
        .append("defs")
        .append("linearGradient")
        .attr("id", "area-gradient-" + index)
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "0%")
        .attr("y2", "100%");

      gradient
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", chartColors[index])
        .attr("stop-opacity", 0.1);

      gradient
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", chartColors[index])
        .attr("stop-opacity", 0);

      svg
        .append("path")
        .datum(chartData)
        .attr("fill", "url(#area-gradient-" + index + ")")
        .attr("d", area);

      svg
        .append("path")
        .datum(chartData)
        .attr("fill", "none")
        .attr("stroke", chartColors[index])
        .attr("stroke-width", 1.5)
        .style("z-index", 4)
        .attr(
          "d",
          d3
            .line<(typeof data)[0]>()
            .x((d) => x(new Date(d.Date)))
            .y((d) => y(d["Close/Last"]))
        );

      const lastDataPoint = chartData[0];
      const lastX = x(new Date(lastDataPoint.Date));
      const lastY = y(lastDataPoint["Close/Last"]);

      const firstDataPoint = chartData[chartData.length - 1];
      const difference =
        lastDataPoint["Close/Last"] - firstDataPoint["Close/Last"];
      const diff = (difference / firstDataPoint["Close/Last"]) * 100;
      const diffString = `${difference < 0 ? "-" : "+"}${difference.toFixed(
        2
      )} (${diff.toFixed(2)}%)`;

      setStockPrice(
        selectedCharts[index],
        lastDataPoint["Close/Last"],
        diffString
      );

      const lastPointLabel = svg
        .append("g")
        .attr("transform", `translate(${lastX}, ${lastY})`);

      lastPointLabel
        .append("rect")
        .attr("x", -20)
        .attr("y", -15)
        .attr("width", 109)
        .attr("height", 30)
        .attr("z-index", 4)
        .attr("fill", chartColors[index])
        .attr("rx", 4)
        .attr("ry", 4);

      const lastPointBBox = lastPointLabel.node()!.getBBox();

      lastPointLabel
        .append("text")
        .attr("x", lastPointBBox.x + lastPointBBox.width / 2)
        .attr("y", 2)
        .attr("fill", "white")
        .attr("font-weight", "500")
        .attr("font-family", "PT Root UI VF, system-ui, sans-serif")
        .attr("font-size", "18px")
        .attr("z-index", 4)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .text(lastDataPoint["Close/Last"].toFixed(2));
    });

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

    const crosshair = svg
      .append("g")
      .attr("class", "crosshair")
      .style("display", "none");

    datasets.forEach((chartData, index) => {
      crosshair
        .append("line")
        .attr("id", "crosshairY" + index)
        .attr("stroke", "gray")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "5,5")
        .attr("x1", margin.left)
        .attr("x2", width - margin.right);

      crosshair
        .append("line")
        .attr("id", "crosshairX" + index)
        .attr("stroke", "gray")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "5,5")
        .attr("y1", margin.top)
        .attr("y2", height - margin.bottom);

      crosshair
        .append("rect")
        .attr("id", "crosshairLabelBackground" + index)
        .attr("width", 109)
        .attr("height", 30)
        .attr("z-index", 4)
        .attr("fill", "#1A243A")
        .attr("rx", 4)
        .attr("ry", 4);

      crosshair
        .append("text")
        .attr("id", "crosshairLabel" + index)
        .attr("fill", "white")
        .attr("font-weight", "500")
        .attr("font-family", "PT Root UI VF, system-ui, sans-serif")
        .attr("font-size", "18px")
        .attr("z-index", 1)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .text(chartData[0]["Close/Last"].toFixed(2));
    });
    svg.select(".domain").attr("stroke", "none");

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
        datasets.forEach((chartData, index) => {
          const closestData = chartData.reduce((a, b) => {
            return Math.abs(new Date(a.Date).getTime() - date.getTime()) <
              Math.abs(new Date(b.Date).getTime() - date.getTime())
              ? a
              : b;
          });
          const closestX = x(new Date(closestData.Date));
          const closestY = y(closestData["Close/Last"]);

          crosshair
            .select("#crosshairX" + index)
            .attr("x1", closestX)
            .attr("x2", closestX);

          crosshair
            .select("#crosshairY" + index)
            .attr("y1", closestY)
            .attr("y2", closestY);

          const labelBg = crosshair.select("#crosshairLabelBackground" + index);

          labelBg.attr("x", width - margin.right - 20).attr("y", closestY - 15);
          const labelBBox = (
            crosshair
              .select("#crosshairLabelBackground" + index)
              .node()! as SVGGraphicsElement
          ).getBBox();

          crosshair
            .select("#crosshairLabel" + index)
            .attr("x", labelBBox.x + labelBBox.width / 2)
            .attr("y", closestY + 2)
            .text(closestData["Close/Last"].toFixed(2));
        });
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
