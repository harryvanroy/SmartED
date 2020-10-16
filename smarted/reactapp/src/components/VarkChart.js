import React from 'react';
import { PieChart } from 'react-minimal-pie-chart';
 
const VarkChart = ({ V, A, R, K}) => {
  return (
    <PieChart
      style={{blockSize: 200}}
      animate={true}
      viewBoxSize={[300, 300]}
      center={[150, 150]}
      radius={150}
      label={({ dataEntry }) => dataEntry.value !== 0 ? `${dataEntry.title}: ${dataEntry.value}` : ''}
      data={[
        { title: 'V', value: V, color: '#603E95' },
        { title: 'A', value: A, color: '#009DA1' },
        { title: 'R', value: R, color: '#FAC22B' },
        { title: 'K', value: K, color: '#D7255D' },
      ]}
    />
  )
}

export default VarkChart;