
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

  const { id } = props;

  useEffect(() => {
    const fetchBloodPressureData = async () => {
      try {
        const response = await fetch(`${process.env.api}/patient/records/bloodPressure/${id}`,{
          method:'GET',
          credentials:'include'
        });
        const data = await response.json();
        // Format the data for display
        const formattedData = data.map(item => ({
          x: new Date(item.x).toLocaleDateString('default', { month: 'short', year: '2-digit' }),
          y: item.y
        }));
        setBloodPressureData(formattedData);
      } catch (error) {
        console.error('Error fetching blood pressure data:', error);
      }
    };

    fetchBloodPressureData();
  }, [id]);

  // Calculate dynamic min and max values for y-axis
  const yMin = bloodPressureData.length ? 
    Math.floor(Math.min(...bloodPressureData.map(d => d.y)) / 10) * 10 - 10 : 60;
  const yMax = bloodPressureData.length ? 
    Math.ceil(Math.max(...bloodPressureData.map(d => d.y)) / 10) * 10 + 10 : 190;

  const data = {
    labels: bloodPressureData.map(d => d.x),
    datasets: [
      {
        label: 'Blood Pressure',
        data: bloodPressureData.map(d => d.y),
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

          title: (context) => `Date: ${context[0].label}`,

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
          maxRotation: 45,
          autoSkip: true,
          maxTicksLimit: 12,
        },
      },
      y: {
        beginAtZero: false,
        min: yMin,
        max: yMax,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            size: 10,
          },
          stepSize: 10,
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

      <h2>Blood Pressure History</h2>
      <Line options={options} data={data} />
    </div>
  );
}

