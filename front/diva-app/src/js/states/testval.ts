// Assets
import avatar1 from "../../assets/img/avatars/avatar1.png";
import avatar2 from "../../assets/img/avatars/avatar2.png";
import avatar3 from "../../assets/img/avatars/avatar3.png";
import avatar4 from "../../assets/img/avatars/avatar4.png";
import avatar5 from "../../assets/img/avatars/avatar5.png";
import avatar7 from "../../assets/img/avatars/avatar7.png";
import avatar8 from "../../assets/img/avatars/avatar8.png";
import avatar9 from "../../assets/img/avatars/avatar9.png";
import avatar10 from "../../assets/img/avatars/avatar10.png";

export const timelineData = [
    {
     
      title: "$2400, Design changes",
      date: "22 DEC 7:20 PM",
      color: "brand.200",
    },
    {
      title: "New order #4219423",
      date: "21 DEC 11:21 PM",
      color: "orange",
    },
    {
      title: "Server Payments for April",
      date: "21 DEC 9:28 PM",
      color: "blue.400",
    },
    {
      title: "New card added for order #3210145",
      date: "20 DEC 3:52 PM",
      color: "orange.300",
    },
    {
      title: "Unlock packages for Development",
      date: "19 DEC 11:35 PM",
      color: "purple",
    },
    {
      title: "New order #9851258",
      date: "18 DEC 4:41 PM",
    },
  ];

  export const dashboardTableData = [
    {
      name: "Chakra Soft UI Version",
      members: [avatar1, avatar2, avatar3, avatar4, avatar5],
      budget: "$14,000",
      progression: 60,
    },
    {
      name: "Add Progress Track",
      members: [avatar3, avatar2],
      budget: "$3,000",
      progression: 10,
    },
    {
      name: "Fix Platform Errors",
      members: [avatar10, avatar4],
      budget: "Not set",
      progression: 100,
    },
    {
      name: "Launch our Mobile App",
      members: [avatar2, avatar3, avatar7, avatar8],
      budget: "$32,000",
      progression: 100,
    },
    {
      name: "Add the New Pricing Page",
      members: [avatar10, avatar3, avatar7, avatar2, avatar8],
      budget: "$400",
      progression: 25,
    },
    {
      name: "Redesign New Online Shop",
      members: [avatar9, avatar3, avatar2],
      budget: "$7,600",
      progression: 40,
    },
  ];


  export const tablesTableData = [
    {
      logo: avatar1,
      name: "Esthera Jackson",
      email: "alexa@simmmple.com",
      subdomain: "Manager",
      domain: "Organization",
      status: "Online",
      date: "14/06/21",
    },
    {
      logo: avatar2,
      name: "Alexa Liras",
      email: "laurent@simmmple.com",
      subdomain: "Programmer",
      domain: "Developer",
      status: "Offline",
      date: "12/05/21",
    },
    {
      logo: avatar3,
      name: "Laurent Michael",
      email: "laurent@simmmple.com",
      subdomain: "Executive",
      domain: "Projects",
      status: "Online",
      date: "07/06/21",
    },
    {
      logo: avatar4,
      name: "Freduardo Hill",
      email: "freduardo@simmmple.com",
      subdomain: "Manager",
      domain: "Organization",
      status: "Online",
      date: "14/11/21",
    },
    {
      logo: avatar5,
      name: "Daniel Thomas",
      email: "daniel@simmmple.com",
      subdomain: "Programmer",
      domain: "Developer",
      status: "Offline",
      date: "21/01/21",
    },
    {
      logo: avatar7,
      name: "Mark Wilson",
      email: "mark@simmmple.com",
      subdomain: "Designer",
      domain: "UI/UX Design",
      status: "Offline",
      date: "04/09/20",
    },
  ];


  export const barChartDataDashboard = [
    {
      name: "Sales",
      data: [330, 250, 110, 300, 490, 350, 270, 130, 425],
    },
  ];
  
  export const barChartOptionsDashboard = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    tooltip: {
      style: {
        fontSize: "12px",
        fontFamily: "Plus Jakarta Display",
      },
      onDatasetHover: {
        style: {
          fontSize: "12px",
          fontFamily: "Plus Jakarta Display",
        },
      },
      theme: "dark",
    },
    xaxis: {
      categories: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      show: false,
      labels: {
        show: false,
        style: {
          colors: "#fff",
          fontSize: "12px",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: true,
      color: "#fff",
      labels: {
        show: true,
        style: {
          colors: "#fff",
          fontSize: "12px",
          fontFamily: "Plus Jakarta Display",
        },
      },
    },
    grid: {
      show: false,
    },
    fill: {
      colors: "#fff",
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: "12px",
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 0,
            },
          },
        },
      },
    ],
  };
  
  export const lineChartDataDashboard = [
    {
      name: "Mobile apps",
      data: [500, 250, 300, 220, 500, 250, 300, 230, 300, 350, 250, 400],
    },
    {
      name: "Websites",
      data: [200, 230, 300, 350, 370, 420, 550, 350, 400, 500, 330, 550],
    },
  ];
  
  export const lineChartOptionsDashboard = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    tooltip: {
      theme: "dark",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      type: "datetime",
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      labels: {
        style: {
          colors: "#c8cfca",
          fontSize: "12px",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#c8cfca",
          fontSize: "12px",
        },
      },
    },
    legend: {
      show: false,
    },
    grid: {
      strokeDashArray: 5,
      borderColor: "#56577A"
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        shadeIntensity: 0,
        gradientToColors: undefined, // optional, if not defined - uses the shades of same color in series
        inverseColors: true,
        opacityFrom: 0.8,
        opacityTo: 0,
        stops: [],
      },
      colors: ["#2CD9FF", "#582CFF"],
    },
    colors: ["#2CD9FF", "#582CFF"],
  };
  
  export const lineChartDataProfile1 = [
    {
      name: "Mobile apps",
      data: [100, 250, 300, 220, 500, 250, 300, 230, 300, 350, 250, 400],
    },
  ];
  
  export const lineChartOptionsProfile1 = {
    chart: {
      height: "50px",
      toolbar: {
        show: false,
      },
      redrawOnParentResize: true,
  
    },
    tooltip: {
      theme: "dark",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      type: "datetime",
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      labels: {
        show: false,
        style: {
          colors: "#c8cfca",
          fontSize: "12px",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: false,
      labels: {
        style: {
          colors: "#c8cfca",
          fontSize: "12px",
        },
      },
    },
    legend: {
      show: false,
    },
    grid: {
      show: false,
      strokeDashArray: 5,
      borderColor: "#56577A"
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        shadeIntensity: 0,
        gradientToColors: undefined, // optional, if not defined - uses the shades of same color in series
        inverseColors: true,
        opacityFrom: 0.8,
        opacityTo: 0,
        stops: [],
      },
      colors: ["#01B574"],
    },
    colors: ["#01B574"],
  };
  
  export const lineChartDataProfile2 = [
    {
      name: "Mobile apps",
      data: [100, 250, 300, 220, 500, 250, 300, 230, 300, 350, 250, 400],
    },
  ];
  
  export const lineChartOptionsProfile2 = {
    chart: {
      height: "50px",
      toolbar: {
        show: false,
      },
      redrawOnParentResize: true
    },
    tooltip: {
      theme: "dark",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      type: "datetime",
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      labels: {
        show: false,
        style: {
          colors: "#c8cfca",
          fontSize: "12px",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: false,
      labels: {
        style: {
          colors: "#c8cfca",
          fontSize: "12px",
        },
      },
    },
    legend: {
      show: false,
    },
    grid: {
      show: false,
      strokeDashArray: 5,
      borderColor: "#56577A"
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        shadeIntensity: 0,
        gradientToColors: undefined, // optional, if not defined - uses the shades of same color in series
        inverseColors: true,
        opacityFrom: 0.8,
        opacityTo: 0,
        stops: [],
      },
      colors: ["#582CFF"],
    },
    colors: ["#582CFF"],
  };
  