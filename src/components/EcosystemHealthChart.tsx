// src/components/EcosystemHealthChart.tsx
import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import rawData from '../data/aggregated_migrations.json';

// Updated interfaces based on your exact Jenkins schema!
interface Migration {
  migrationStatus: string; // e.g., 'fail', 'success'
  migrationName: string;
}

interface PluginReport {
  pluginName: string;
  migrations: Migration[];
}

const EcosystemHealthChart: React.FC = () => {
  const pluginReports = rawData as PluginReport[];

  const chartData = useMemo(() => {
    let success = 0;
    let fail = 0;
    let other = 0;

    // We now have to loop through the plugins, AND loop through their migrations
    pluginReports.forEach((plugin) => {
      // Some plugins might not have migrations yet, so we default to an empty array
      const migrations = plugin.migrations || []; 
      
      migrations.forEach((migration) => {
        const status = migration.migrationStatus?.toLowerCase();
        if (status === 'success') success++;
        else if (status === 'fail') fail++;
        else other++;
      });
    });

    return [
      { value: success, name: 'Success', itemStyle: { color: '#4caf50' } },
      { value: fail, name: 'Failed', itemStyle: { color: '#f44336' } },
      { value: other, name: 'Other/Skipped', itemStyle: { color: '#ffeb3b' } },
    ];
  }, [pluginReports]);

  const option = {
    title: { text: 'Overall Migration Health', left: 'center' },
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { bottom: '10%', left: 'center' },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: { show: false, position: 'center' },
        emphasis: { label: { show: true, fontSize: 20, fontWeight: 'bold' } },
        labelLine: { show: false },
        data: chartData,
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: '400px', width: '100%' }} />;
};

export default EcosystemHealthChart;