import React, { useEffect, useState, useRef } from "react";
import { Pie } from 'react-chartjs-2';

export const PortfolioView = (props) => {

    const balances = props.balances;

    const data = {
      labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],
      datasets: [
        {
          label: 'Dataset 1',
          data: [1,2,3],
          backgroundColor: ['#342', '#332', '#532'],
        }
      ]
    };

    const options = {
           responsive: true,
          plugins: {
            legend: {
              display: false,
            },
          }
      };

      
    return (
        <div className="chart" style={{width:400, margin: '0 auto', padding:8}}>
            <Pie data={data} options={options}/>
        </div>
    );
};

export default PortfolioView;