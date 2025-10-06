import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CalendarHeader = ({ 
  currentDate, 
  viewMode, 
  onViewModeChange, 
  onNavigate, 
  onTodayClick,
  onImportClick,
  onExportClick 
}) => {
  const formatDate = (date) => {
    const options = { 
      year: 'numeric', 
      month: 'long',
      ...(viewMode === 'day' && { day: 'numeric' })
    };
    return date?.toLocaleDateString('en-US', options);
  };

  const viewModes = [
    { key: 'month', label: 'Month', icon: 'Calendar' },
    { key: 'week', label: 'Week', icon: 'CalendarDays' },
    { key: 'day', label: 'Day', icon: 'CalendarCheck' }
  ];

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      {/* Left Section - Navigation */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="ChevronLeft"
            onClick={() => onNavigate('prev')}
            className="w-9 h-9"
          />
          <Button
            variant="outline"
            size="sm"
            iconName="ChevronRight"
            onClick={() => onNavigate('next')}
            className="w-9 h-9"
          />
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onTodayClick}
          className="text-primary hover:text-primary-foreground hover:bg-primary"
        >
          Today
        </Button>
        
        <h1 className="text-2xl font-bold text-foreground">
          {formatDate(currentDate)}
        </h1>
      </div>
      {/* Right Section - View Controls & Actions */}
      <div className="flex items-center space-x-3">
        {/* View Mode Toggle */}
        <div className="flex items-center bg-muted rounded-lg p-1">
          {viewModes?.map((mode) => (
            <button
              key={mode?.key}
              onClick={() => onViewModeChange(mode?.key)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-smooth ${
                viewMode === mode?.key
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background'
              }`}
            >
              <Icon name={mode?.icon} size={16} />
              <span className="hidden sm:inline">{mode?.label}</span>
            </button>
          ))}
        </div>

        {/* Import/Export Actions */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Upload"
            iconPosition="left"
            onClick={onImportClick}
            className="hidden sm:flex"
          >
            Import
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
            onClick={onExportClick}
            className="hidden sm:flex"
          >
            Export
          </Button>
          
          {/* Mobile Actions */}
          <Button
            variant="outline"
            size="sm"
            iconName="MoreVertical"
            className="sm:hidden w-9 h-9"
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;