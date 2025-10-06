import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const CalendarGrid = ({ viewMode, currentDate, events, onEventClick, onEventDrop, onDateClick }) => {
  const [draggedEvent, setDraggedEvent] = useState(null);
  const [dragOverDate, setDragOverDate] = useState(null);
  const gridRef = useRef(null);

  // Generate calendar dates based on view mode
  const generateCalendarDates = () => {
    const dates = [];
    const now = new Date(currentDate);
    
    if (viewMode === 'month') {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      const startDate = new Date(firstDay);
      startDate?.setDate(startDate?.getDate() - firstDay?.getDay());
      
      for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date?.setDate(startDate?.getDate() + i);
        dates?.push(date);
      }
    } else if (viewMode === 'week') {
      const startOfWeek = new Date(now);
      startOfWeek?.setDate(now?.getDate() - now?.getDay());
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date?.setDate(startOfWeek?.getDate() + i);
        dates?.push(date);
      }
    } else {
      dates?.push(new Date(now));
    }
    
    return dates;
  };

  const calendarDates = generateCalendarDates();

  const getEventsForDate = (date) => {
    const dateStr = date?.toDateString();
    return events?.filter(event => new Date(event.scheduledDate)?.toDateString() === dateStr);
  };

  const isToday = (date) => {
    return date?.toDateString() === new Date()?.toDateString();
  };

  const isCurrentMonth = (date) => {
    return date?.getMonth() === currentDate?.getMonth();
  };

  const handleDragStart = (e, event) => {
    setDraggedEvent(event);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, date) => {
    e?.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverDate(date);
  };

  const handleDragLeave = () => {
    setDragOverDate(null);
  };

  const handleDrop = (e, date) => {
    e?.preventDefault();
    if (draggedEvent) {
      onEventDrop(draggedEvent, date);
      setDraggedEvent(null);
      setDragOverDate(null);
    }
  };

  const getEventTypeColor = (type) => {
    const colors = {
      post: 'bg-primary',
      draft: 'bg-muted-foreground',
      campaign: 'bg-secondary',
      hold: 'bg-warning'
    };
    return colors?.[type] || 'bg-primary';
  };

  const getEventStatusColor = (status) => {
    const colors = {
      scheduled: 'border-primary',
      pending: 'border-warning',
      published: 'border-success',
      failed: 'border-error'
    };
    return colors?.[status] || 'border-primary';
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      instagram: 'Instagram',
      facebook: 'Facebook',
      linkedin: 'Linkedin',
      twitter: 'Twitter'
    };
    return icons?.[platform] || 'Globe';
  };

  const EventCard = ({ event, isCompact = false }) => (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, event)}
      onClick={() => onEventClick(event)}
      className={`group cursor-pointer bg-surface border-2 rounded-lg p-2 mb-2 shadow-sm hover:shadow-md transition-all duration-200 ${
        getEventStatusColor(event?.status)
      } ${isCompact ? 'min-h-[60px]' : 'min-h-[80px]'}`}
    >
      <div className="flex items-start space-x-2">
        {/* Event Type Indicator */}
        <div className={`w-3 h-3 rounded-full mt-1 ${getEventTypeColor(event?.type)}`} />
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Media Thumbnail */}
          {event?.media && (
            <div className="w-full h-12 mb-2 rounded overflow-hidden bg-muted">
              <Image
                src={event?.media?.thumbnail}
                alt="Post thumbnail"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {/* Caption Preview */}
          <p className="text-xs text-foreground font-medium line-clamp-2 mb-1">
            {event?.caption}
          </p>
          
          {/* Platform Icons & Time */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              {event?.platforms?.map((platform, index) => (
                <Icon
                  key={index}
                  name={getPlatformIcon(platform)}
                  size={12}
                  className="text-muted-foreground"
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {new Date(event.scheduledDate)?.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit'
              })}
            </span>
          </div>
          
          {/* Recurrence Indicator */}
          {event?.recurrence && (
            <div className="flex items-center mt-1">
              <Icon name="Repeat" size={10} className="text-primary mr-1" />
              <span className="text-xs text-primary">Recurring</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (viewMode === 'month') {
    return (
      <div className="bg-surface rounded-lg border border-border overflow-hidden">
        {/* Month Header */}
        <div className="grid grid-cols-7 border-b border-border">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']?.map((day) => (
            <div key={day} className="p-3 text-center text-sm font-semibold text-muted-foreground bg-muted">
              {day}
            </div>
          ))}
        </div>
        {/* Month Grid */}
        <div className="grid grid-cols-7" ref={gridRef}>
          {calendarDates?.map((date, index) => {
            const dayEvents = getEventsForDate(date);
            const isDragOver = dragOverDate && dragOverDate?.toDateString() === date?.toDateString();
            
            return (
              <div
                key={index}
                className={`min-h-[120px] p-2 border-r border-b border-border cursor-pointer transition-colors ${
                  !isCurrentMonth(date) ? 'bg-muted/30 text-muted-foreground' : 'bg-surface hover:bg-muted/50'
                } ${isToday(date) ? 'bg-primary/5' : ''} ${isDragOver ? 'bg-accent/20' : ''}`}
                onClick={() => onDateClick(date)}
                onDragOver={(e) => handleDragOver(e, date)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, date)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${
                    isToday(date) ? 'text-primary font-bold' : !isCurrentMonth(date) ?'text-muted-foreground' : 'text-foreground'
                  }`}>
                    {date?.getDate()}
                  </span>
                  {dayEvents?.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{dayEvents?.length - 3}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  {dayEvents?.slice(0, 3)?.map((event) => (
                    <EventCard key={event?.id} event={event} isCompact />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (viewMode === 'week') {
    return (
      <div className="bg-surface rounded-lg border border-border overflow-hidden">
        {/* Week Header */}
        <div className="grid grid-cols-8 border-b border-border">
          <div className="p-3 text-center text-sm font-semibold text-muted-foreground bg-muted">
            Time
          </div>
          {calendarDates?.map((date, index) => (
            <div key={index} className={`p-3 text-center border-r border-border ${
              isToday(date) ? 'bg-primary/10' : 'bg-muted'
            }`}>
              <div className="text-sm font-semibold text-foreground">
                {date?.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className={`text-lg font-bold mt-1 ${
                isToday(date) ? 'text-primary' : 'text-foreground'
              }`}>
                {date?.getDate()}
              </div>
            </div>
          ))}
        </div>
        {/* Week Grid */}
        <div className="grid grid-cols-8 min-h-[600px]">
          {/* Time Column */}
          <div className="border-r border-border bg-muted/30">
            {Array.from({ length: 24 }, (_, hour) => (
              <div key={hour} className="h-12 border-b border-border p-2 text-xs text-muted-foreground">
                {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
              </div>
            ))}
          </div>
          
          {/* Day Columns */}
          {calendarDates?.map((date, dateIndex) => {
            const dayEvents = getEventsForDate(date);
            const isDragOver = dragOverDate && dragOverDate?.toDateString() === date?.toDateString();
            
            return (
              <div
                key={dateIndex}
                className={`border-r border-border relative ${isDragOver ? 'bg-accent/20' : ''}`}
                onDragOver={(e) => handleDragOver(e, date)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, date)}
              >
                {/* Hour Grid Lines */}
                {Array.from({ length: 24 }, (_, hour) => (
                  <div key={hour} className="h-12 border-b border-border" />
                ))}
                {/* Events */}
                <div className="absolute inset-0 p-1">
                  {dayEvents?.map((event, eventIndex) => {
                    const eventDate = new Date(event.scheduledDate);
                    const top = (eventDate?.getHours() * 48) + (eventDate?.getMinutes() * 0.8);
                    
                    return (
                      <div
                        key={event?.id}
                        style={{ top: `${top}px` }}
                        className="absolute left-1 right-1 z-10"
                      >
                        <EventCard event={event} isCompact />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Day View
  return (
    <div className="bg-surface rounded-lg border border-border overflow-hidden">
      {/* Day Header */}
      <div className="p-4 border-b border-border bg-muted">
        <h2 className="text-lg font-semibold text-foreground">
          {currentDate?.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </h2>
      </div>
      {/* Day Content */}
      <div className="grid grid-cols-2 min-h-[600px]">
        {/* Timeline */}
        <div className="border-r border-border">
          <div className="relative">
            {Array.from({ length: 24 }, (_, hour) => (
              <div key={hour} className="h-16 border-b border-border p-3 text-sm text-muted-foreground">
                {hour === 0 ? '12:00 AM' : hour < 12 ? `${hour}:00 AM` : hour === 12 ? '12:00 PM' : `${hour - 12}:00 PM`}
              </div>
            ))}
            
            {/* Events on Timeline */}
            {getEventsForDate(currentDate)?.map((event) => {
              const eventDate = new Date(event.scheduledDate);
              const top = (eventDate?.getHours() * 64) + (eventDate?.getMinutes() * 1.07);
              
              return (
                <div
                  key={event?.id}
                  style={{ top: `${top}px` }}
                  className="absolute left-16 right-2 z-10"
                >
                  <EventCard event={event} />
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Event List */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Scheduled Posts ({getEventsForDate(currentDate)?.length})
          </h3>
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {getEventsForDate(currentDate)?.map((event) => (
              <EventCard key={event?.id} event={event} />
            ))}
            {getEventsForDate(currentDate)?.length === 0 && (
              <div className="text-center py-8">
                <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No posts scheduled for this day</p>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={() => onDateClick(currentDate)}
                  className="mt-3"
                >
                  Schedule Post
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarGrid;