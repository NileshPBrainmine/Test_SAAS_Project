import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import CalendarHeader from './components/CalendarHeader';
import CalendarSidebar from './components/CalendarSidebar';
import CalendarGrid from './components/CalendarGrid';
import EventModal from './components/EventModal';
import BulkScheduleModal from './components/BulkScheduleModal';

import Button from '../../components/ui/Button';

const ContentCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [events, setEvents] = useState([]);

  // Mock events data
  const mockEvents = [
    {
      id: 1,
      caption: "🌟 Exciting product launch announcement! Our new AI-powered features are here to revolutionize your workflow.",
      scheduledDate: new Date(2025, 9, 15, 11, 0)?.toISOString(),
      platforms: ['instagram', 'facebook', 'linkedin'],
      type: 'post',
      status: 'scheduled',
      media: {
        thumbnail: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400",
        type: "image",
        size: "1.2 MB"
      },
      recurrence: null
    },
    {
      id: 2,
      caption: "Behind the scenes: Our development team working on cutting-edge solutions for better user experience.",
      scheduledDate: new Date(2025, 9, 16, 14, 30)?.toISOString(),
      platforms: ['linkedin', 'twitter'],
      type: 'post',
      status: 'pending',
      media: {
        thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400",
        type: "image",
        size: "980 KB"
      },
      recurrence: null
    },
    {
      id: 3,
      caption: "Weekly motivation: Success is not final, failure is not fatal. It's the courage to continue that counts.",
      scheduledDate: new Date(2025, 9, 17, 9, 0)?.toISOString(),
      platforms: ['instagram', 'facebook'],
      type: 'campaign',
      status: 'scheduled',
      media: {
        thumbnail: "https://images.unsplash.com/photo-1553484771-371a605b060b?w=400",
        type: "image",
        size: "1.5 MB"
      },
      recurrence: {
        frequency: 'weekly',
        interval: 1,
        endDate: '2025-12-31'
      }
    },
    {
      id: 4,
      caption: "Customer spotlight: How @TechStartup increased their productivity by 300% using our platform.",
      scheduledDate: new Date(2025, 9, 18, 16, 0)?.toISOString(),
      platforms: ['linkedin'],
      type: 'post',
      status: 'draft',
      media: {
        thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
        type: "image",
        size: "1.1 MB"
      },
      recurrence: null
    },
    {
      id: 5,
      caption: "🚀 Join us for our live webinar tomorrow at 3 PM EST. Learn about the future of social media automation.",
      scheduledDate: new Date(2025, 9, 19, 15, 0)?.toISOString(),
      platforms: ['instagram', 'facebook', 'linkedin', 'twitter'],
      type: 'post',
      status: 'scheduled',
      media: {
        thumbnail: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400",
        type: "video",
        size: "5.2 MB"
      },
      recurrence: null
    },
    {
      id: 6,
      caption: "Daily tip: Use our analytics dashboard to track your best performing content and optimize your strategy.",
      scheduledDate: new Date(2025, 9, 20, 10, 0)?.toISOString(),
      platforms: ['twitter', 'linkedin'],
      type: 'post',
      status: 'scheduled',
      media: {
        thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
        type: "image",
        size: "890 KB"
      },
      recurrence: {
        frequency: 'daily',
        interval: 1,
        count: 30
      }
    }
  ];

  useEffect(() => {
    setEvents(mockEvents);
  }, []);

  const handleNavigate = (direction) => {
    const newDate = new Date(currentDate);
    
    if (viewMode === 'month') {
      newDate?.setMonth(currentDate?.getMonth() + (direction === 'next' ? 1 : -1));
    } else if (viewMode === 'week') {
      newDate?.setDate(currentDate?.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate?.setDate(currentDate?.getDate() + (direction === 'next' ? 1 : -1));
    }
    
    setCurrentDate(newDate);
  };

  const handleTodayClick = () => {
    setCurrentDate(new Date());
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const handleDateClick = (date) => {
    const newEvent = {
      id: null,
      caption: '',
      scheduledDate: date?.toISOString(),
      platforms: [],
      type: 'post',
      status: 'draft',
      media: null,
      recurrence: null
    };
    setSelectedEvent(newEvent);
    setIsEventModalOpen(true);
  };

  const handleEventDrop = (event, newDate) => {
    const updatedEvents = events?.map(e => 
      e?.id === event?.id 
        ? { ...e, scheduledDate: newDate?.toISOString() }
        : e
    );
    setEvents(updatedEvents);
  };

  const handleEventSave = (updatedEvent) => {
    if (updatedEvent?.id) {
      // Update existing event
      setEvents(prev => prev?.map(e => e?.id === updatedEvent?.id ? updatedEvent : e));
    } else {
      // Create new event
      const newEvent = {
        ...updatedEvent,
        id: Date.now() // Simple ID generation for demo
      };
      setEvents(prev => [...prev, newEvent]);
    }
    setIsEventModalOpen(false);
    setSelectedEvent(null);
  };

  const handleEventDelete = (event) => {
    setEvents(prev => prev?.filter(e => e?.id !== event?.id));
    setIsEventModalOpen(false);
    setSelectedEvent(null);
  };

  const handleBulkSchedule = (scheduleData) => {
    // Mock bulk scheduling logic
    console.log('Bulk scheduling:', scheduleData);
    setIsBulkModalOpen(false);
  };

  const handleImportClick = () => {
    // Mock import functionality
    console.log('Import calendar data');
  };

  const handleExportClick = () => {
    // Mock export functionality
    console.log('Export calendar data');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-16">
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-6 border-b border-border">
              <CalendarHeader
                currentDate={currentDate}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onNavigate={handleNavigate}
                onTodayClick={handleTodayClick}
                onImportClick={handleImportClick}
                onExportClick={handleExportClick}
              />
              
              {/* Quick Actions Bar */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-3">
                  <Button
                    variant="default"
                    size="sm"
                    iconName="Plus"
                    iconPosition="left"
                    onClick={() => handleDateClick(new Date())}
                  >
                    Create Post
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Calendar"
                    iconPosition="left"
                    onClick={() => setIsBulkModalOpen(true)}
                  >
                    Bulk Schedule
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Zap"
                    iconPosition="left"
                  >
                    Auto-Schedule
                  </Button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-primary rounded-full" />
                      <span>Scheduled</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-warning rounded-full" />
                      <span>Pending</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-muted-foreground rounded-full" />
                      <span>Draft</span>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="SlidersHorizontal"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="lg:hidden"
                  >
                    Filters
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Calendar Content */}
            <div className="flex-1 p-6 overflow-auto">
              <CalendarGrid
                viewMode={viewMode}
                currentDate={currentDate}
                events={events}
                onEventClick={handleEventClick}
                onEventDrop={handleEventDrop}
                onDateClick={handleDateClick}
              />
            </div>
          </div>
          
          {/* Sidebar */}
          <CalendarSidebar
            isOpen={isSidebarOpen}
            onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        </div>
      </div>

      {/* Modals */}
      <EventModal
        event={selectedEvent}
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setSelectedEvent(null);
        }}
        onSave={handleEventSave}
        onDelete={handleEventDelete}
      />

      <BulkScheduleModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onSchedule={handleBulkSchedule}
      />
    </div>
  );
};

export default ContentCalendar;