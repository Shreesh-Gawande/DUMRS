import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const years = Array.from({ length: 26 }, (_, i) => 2000 + i);

const generateSmoothBloodSugar = (prevValue) => {
  const change = Math.random() * 20 - 10; // Random change between -10 and 10
  const newValue = prevValue + change;
  return Math.max(70, Math.min(180, newValue)); // Keep within 70-180 range
};

const bloodSugarData = [125]; // Start with an average value
for (let i = 1; i < years.length; i++) {
  bloodSugarData.push(generateSmoothBloodSugar(bloodSugarData[i-1]));
}

const data = {
    labels: years,
    datasets: [
      {
        label: 'Blood Sugar Level (mg/dL)',
        data: bloodSugarData,
        borderColor: 'rgba(138, 43, 226, 1)', // Purple color
        backgroundColor: 'rgba(138, 43, 226, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 3, // Small but visible points
        pointBackgroundColor: 'rgba(138, 43, 226, 1)',
        pointBorderColor: 'white',
        pointBorderWidth: 1,
        pointHoverRadius: 9,
        pointHoverBackgroundColor: 'rgba(138, 43, 226, 1)',
        pointHoverBorderColor: 'white',
        pointHoverBorderWidth: 2,
      },
    ],
  };

// const gradientPlugin = {
//   id: 'customCanvasBackgroundColor',
//   beforeDraw: (chart, args, options) => {
//     const {ctx, chartArea} = chart;
//     if (!chartArea) {
//       return;
//     }
//     const gradientFill = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
//     gradientFill.addColorStop(0, 'rgba(138, 43, 226, 0)');
//     gradientFill.addColorStop(1, 'rgba(138, 43, 226, 0.2)');
    
//     ctx.fillStyle = gradientFill;
//     ctx.fillRect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
//   }
// };

export function Graph() {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'white',
        titleColor: 'black',
        bodyColor: 'black',
        borderColor: 'lightgrey',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          title: (context) => `Year: ${context[0].label}`,
          label: (context) => `Blood Sugar: ${context.parsed.y.toFixed(0)} mg/dL`,
        },
        
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10,
          },
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 6,
        },
      },
      y: {
        beginAtZero: false,
        suggestedMin: 60,
        suggestedMax: 190,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            size: 10,
          },
          stepSize: 30,
        },
      },
    },
    elements: {
      line: {
        cubicInterpolationMode: 'monotone',
      },
    },
  };

  return (
    <div style={{width:"100%"}}>
       <h2>Blood Sugar Level Over the years</h2>
       <Line options={options} data={data}  />
    </div>
  )
   
  
}