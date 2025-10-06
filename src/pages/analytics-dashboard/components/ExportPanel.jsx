import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ExportPanel = ({ onExport }) => {
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [selectedMetrics, setSelectedMetrics] = useState(['engagement', 'reach', 'followers']);
  const [dateRange, setDateRange] = useState('last_30_days');
  const [isExporting, setIsExporting] = useState(false);

  const exportFormats = [
    { id: 'pdf', label: 'PDF Report', icon: 'FileText', description: 'Formatted report with charts' },
    { id: 'excel', label: 'Excel Spreadsheet', icon: 'FileSpreadsheet', description: 'Raw data for analysis' },
    { id: 'csv', label: 'CSV Data', icon: 'Database', description: 'Comma-separated values' },
    { id: 'png', label: 'PNG Images', icon: 'Image', description: 'Chart images only' }
  ];

  const availableMetrics = [
    { id: 'engagement', label: 'Engagement Metrics', icon: 'Heart' },
    { id: 'reach', label: 'Reach & Impressions', icon: 'Eye' },
    { id: 'followers', label: 'Follower Growth', icon: 'Users' },
    { id: 'content', label: 'Content Performance', icon: 'FileText' },
    { id: 'demographics', label: 'Audience Demographics', icon: 'PieChart' },
    { id: 'timing', label: 'Posting Time Analysis', icon: 'Clock' }
  ];

  const dateRanges = [
    { id: 'last_7_days', label: 'Last 7 Days' },
    { id: 'last_30_days', label: 'Last 30 Days' },
    { id: 'last_90_days', label: 'Last 90 Days' },
    { id: 'last_year', label: 'Last Year' },
    { id: 'custom', label: 'Custom Range' }
  ];

  const handleMetricToggle = (metricId) => {
    setSelectedMetrics(prev => 
      prev?.includes(metricId) 
        ? prev?.filter(id => id !== metricId)
        : [...prev, metricId]
    );
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport({
        format: selectedFormat,
        metrics: selectedMetrics,
        dateRange: dateRange
      });
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-elevation-1">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="Download" size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Export Analytics</h3>
      </div>
      {/* Export Format Selection */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-foreground mb-3">Export Format</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {exportFormats?.map((format) => (
            <button
              key={format?.id}
              onClick={() => setSelectedFormat(format?.id)}
              className={`p-3 rounded-lg border text-left transition-smooth ${
                selectedFormat === format?.id
                  ? 'border-primary bg-primary/5 text-primary' :'border-border bg-background hover:bg-muted/50 text-foreground'
              }`}
            >
              <div className="flex items-start space-x-3">
                <Icon name={format?.icon} size={20} />
                <div>
                  <p className="font-medium text-sm">{format?.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{format?.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      {/* Date Range Selection */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-foreground mb-3">Date Range</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {dateRanges?.map((range) => (
            <button
              key={range?.id}
              onClick={() => setDateRange(range?.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-smooth ${
                dateRange === range?.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {range?.label}
            </button>
          ))}
        </div>
      </div>
      {/* Metrics Selection */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-foreground mb-3">Include Metrics</h4>
        <div className="space-y-2">
          {availableMetrics?.map((metric) => (
            <label
              key={metric?.id}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-smooth"
            >
              <input
                type="checkbox"
                checked={selectedMetrics?.includes(metric?.id)}
                onChange={() => handleMetricToggle(metric?.id)}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary focus:ring-2"
              />
              <Icon name={metric?.icon} size={16} className="text-muted-foreground" />
              <span className="text-sm text-foreground">{metric?.label}</span>
            </label>
          ))}
        </div>
      </div>
      {/* Export Button */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="text-sm text-muted-foreground">
          {selectedMetrics?.length} metrics selected
        </div>
        <Button
          onClick={handleExport}
          loading={isExporting}
          iconName="Download"
          iconPosition="left"
          disabled={selectedMetrics?.length === 0}
        >
          {isExporting ? 'Exporting...' : 'Export Report'}
        </Button>
      </div>
      {/* Recent Exports */}
      <div className="mt-6 pt-6 border-t border-border">
        <h4 className="text-sm font-semibold text-foreground mb-3">Recent Exports</h4>
        <div className="space-y-2">
          {[
            { name: 'Analytics Report - October 2024.pdf', date: '2024-10-02', size: '2.4 MB' },
            { name: 'Engagement Data - September 2024.xlsx', date: '2024-09-30', size: '1.8 MB' },
            { name: 'Social Media Performance Q3.pdf', date: '2024-09-28', size: '3.1 MB' }
          ]?.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon name="FileText" size={16} className="text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">{file?.name}</p>
                  <p className="text-xs text-muted-foreground">{file?.date} • {file?.size}</p>
                </div>
              </div>
              <button className="p-1 text-muted-foreground hover:text-foreground transition-smooth">
                <Icon name="Download" size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExportPanel;