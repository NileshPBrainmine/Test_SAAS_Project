import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";

import NotFound from "pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TeamCollaboration from './pages/team-collaboration';
import ContentCalendar from './pages/content-calendar';
import AnalyticsDashboard from './pages/analytics-dashboard';
import Dashboard from './pages/dashboard';
import SocialAccountManagement from './pages/social-account-management';
import ContentCreation from './pages/content-creation';
import AdPerformanceAnalytics from "pages/ad-performance-analytics";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Main app routes - accessible in preview mode for Rocket platform */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/team-collaboration" element={<TeamCollaboration />} />
          <Route path="/content-calendar" element={<ContentCalendar />} />
          <Route path="/analytics-dashboard" element={<AnalyticsDashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/social-account-management" element={<SocialAccountManagement />} />
          <Route path="/content-creation" element={<ContentCreation />} />
          <Route path="/ad-performance-analytics" element={<AdPerformanceAnalytics />} />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;