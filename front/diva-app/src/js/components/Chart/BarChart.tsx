import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

interface BarChartProps {
  barChartData: any;
  barChartOptions: any;
}

const BarChart: React.FC<BarChartProps> = ({ barChartData, barChartOptions }) => {
  const [chartData, setChartData] = useState([]);
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    setChartData(barChartData);
    setChartOptions(barChartOptions);
  }, [barChartData, barChartOptions]);

  return (
    <Chart
      options={chartOptions}
      series={chartData}
      type='bar'
      width='100%'
      height='100%'
    />
  );
}

export default BarChart;