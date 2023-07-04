import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

interface LineChartProps {
  lineChartData: any;
  lineChartOptions: any;
}

const LineChart: React.FC<LineChartProps> = ({ lineChartData, lineChartOptions }) => {
  const [chartData, setChartData] = useState([]);
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    setChartData(lineChartData);
    setChartOptions(lineChartOptions);
  }, [lineChartData, lineChartOptions]);

  return (
    <ReactApexChart
      options={chartOptions}
      series={chartData}
      type='area'
      width='100%'
      height='100%'
    />
  );
}

export default LineChart;