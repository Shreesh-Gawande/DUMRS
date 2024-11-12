// Graph.js
import React, { useState, useEffect } from 'react';
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
  Legend,
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

export function Graph(props) {
  const [bloodPressureData, setBloodPressureData] = useState([]);
  const {id}=props
  useEffect(() => {
    const fetchBloodPressureData = async () => {
      try {
        const response = await fetch(`http://localhost:4000/patient/bloodPressure/${id}`);
        const data = await response.json();
        setBloodPressureData(data);
      } catch (error) {
        console.error('Error fetching blood pressure data:', error);
      }
    };

    fetchBloodPressureData();
  }, []);

  const data = {
    datasets: [
      {
        label: 'Blood Pressure',
        data: bloodPressureData,
        borderColor: 'rgba(138, 43, 226, 1)',
        backgroundColor: 'rgba(138, 43, 226, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
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
          label: (context) => `Blood Pressure: ${context.parsed.y.toFixed(0)} mmHg`,
        },
      },
    },
    scales: {
      x: {
        type: 'linear',
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
    <div style={{ width: '100%' }}>
      <h2>Blood Pressure Over the Years</h2>
      <Line options={options} data={data} />
    </div>
  );
}