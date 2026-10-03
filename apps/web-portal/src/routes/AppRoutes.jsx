import React from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';

// Layouts
import { LandingLayout } from '../layouts/LandingLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { GovernmentLayout } from '../layouts/GovernmentLayout';

// Route Guards
import { ProtectedRoute } from './ProtectedRoute';
import { RoleGuard } from './RoleGuard';
import { CitizenRouteGuard } from './CitizenRouteGuard';

// Public Pages
import { LandingPage } from '../public-pages/LandingPage';
import { LoginPage } from '../public-pages/LoginPage';
import { RegisterPage } from '../public-pages/RegisterPage';
import { NotFoundPage } from '../public-pages/NotFoundPage';

// Citizen Reporting Portal (Dual Desktop & Mobile with Apple Fluid Motion)
import { CitizenHomePage } from '../portals/citizen/pages/CitizenHomePage';
import { OnboardingPage } from '../portals/citizen/pages/OnboardingPage';
import { MySubmissionsPage } from '../portals/citizen/pages/MySubmissionsPage';

// Government Pages
import { GovernmentDashboard } from '../portals/government/pages/Dashboard';
import { GovernmentIssueInbox } from '../portals/government/pages/IssueInbox';
import { GovernmentMapView } from '../portals/government/pages/MapView';
import { GovernmentAssigned } from '../portals/government/pages/Assigned';
import { GovernmentReportDetail } from '../portals/government/pages/ReportDetail';
import { GovernmentProblems } from '../portals/government/pages/Problems';
import { GovernmentChallenges } from '../portals/government/pages/Challenges';
import { 
  GovernmentDepartments, GovernmentUniversities, GovernmentProjects, 
  GovernmentFunding, GovernmentCertificates, GovernmentAnalytics 
} from '../portals/government/pages/OtherPages';

// University Pages
import { UniversityDashboard } from '../portals/university/pages/Dashboard';
import { 
  UniversityChallenges, UniversityTeams, UniversityProjects, 
  UniversityMilestones, UniversityMentors, UniversityFunding, UniversityCommunication 
} from '../portals/university/pages/OtherPages';

// Industry Pages
import { IndustryDashboard } from '../portals/industry/pages/Dashboard';
import { 
  IndustryChallenges, IndustryProjects, IndustryCollaborations, 
  IndustryFunding, IndustryMentorship, IndustryProfile 
} from '../portals/industry/pages/OtherPages';

// Parameterized redirect helper for Government report routes
const OakReportRedirect = () => {
  const { id } = useParams();
  return <Navigate to={`/oak/reports/${id}`} replace />;
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<LandingLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      {/* 🚀 SETU Onboarding Experience (Stitch Design & Apple Polish - Desktop + Mobile) */}
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/welcome" element={<OnboardingPage />} />
      <Route path="/intro" element={<OnboardingPage />} />

      {/* 📱 \grass - Grassroots Reporting Portal (Citizens, Schools, Panchayats, ULBs) */}
      <Route element={<CitizenRouteGuard />}>
        {/* Canonical \grass routes */}
        <Route path="/grass" element={<CitizenHomePage />} />
        <Route path="/grass/home" element={<CitizenHomePage />} />
        <Route path="/grass/explore" element={<CitizenHomePage />} />
        <Route path="/grass/messages" element={<CitizenHomePage />} />
        <Route path="/grass/profile" element={<CitizenHomePage />} />
        <Route path="/grass/report" element={<CitizenHomePage />} />
        <Route path="/grass/submissions" element={<MySubmissionsPage />} />
        <Route path="/grass/my-submissions" element={<MySubmissionsPage />} />
      </Route>

      {/* Legacy & Short Aliases - Immediately update URL to canonical \grass */}
      <Route path="/citizen" element={<Navigate to="/grass" replace />} />
      <Route path="/citizen/home" element={<Navigate to="/grass/home" replace />} />
      <Route path="/citizen/explore" element={<Navigate to="/grass/explore" replace />} />
      <Route path="/explore" element={<Navigate to="/grass/explore" replace />} />
      <Route path="/citizen/messages" element={<Navigate to="/grass/messages" replace />} />
      <Route path="/messages" element={<Navigate to="/grass/messages" replace />} />
      <Route path="/citizen/profile" element={<Navigate to="/grass/profile" replace />} />
      <Route path="/profile" element={<Navigate to="/grass/profile" replace />} />
      <Route path="/citizen/report" element={<Navigate to="/grass/report" replace />} />
      <Route path="/report" element={<Navigate to="/grass/report" replace />} />
      <Route path="/reporting" element={<Navigate to="/grass/report" replace />} />
      <Route path="/reporting-portal" element={<Navigate to="/grass/report" replace />} />
      <Route path="/citizen/submissions" element={<Navigate to="/grass/submissions" replace />} />
      <Route path="/citizen/my-submissions" element={<Navigate to="/grass/submissions" replace />} />
      <Route path="/my-submissions" element={<Navigate to="/grass/submissions" replace />} />
      <Route path="/submissions" element={<Navigate to="/grass/submissions" replace />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* 🌳 \oak - Government Command & Nodal Evaluation Shell */}
      <Route element={<GovernmentLayout />}>
        {/* Canonical \oak routes */}
        <Route path="/oak" element={<GovernmentDashboard />} />
        <Route path="/oak/dashboard" element={<GovernmentDashboard />} />
        <Route path="/oak/inbox" element={<GovernmentIssueInbox />} />
        <Route path="/oak/map" element={<GovernmentMapView />} />
        <Route path="/oak/assigned" element={<GovernmentAssigned />} />
        <Route path="/oak/reports/:id" element={<GovernmentReportDetail />} />

        {/* Existing & legacy redirects to canonical \oak */}
        <Route path="/government" element={<Navigate to="/oak/dashboard" replace />} />
        <Route path="/government/dashboard" element={<Navigate to="/oak/dashboard" replace />} />
        <Route path="/civic-dashboard" element={<Navigate to="/oak/dashboard" replace />} />
        <Route path="/admin" element={<Navigate to="/oak/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<Navigate to="/oak/dashboard" replace />} />

        {/* 📥 Setu Govt Portal - Issue Inbox */}
        <Route path="/government/inbox" element={<Navigate to="/oak/inbox" replace />} />
        <Route path="/government/issue-inbox" element={<Navigate to="/oak/inbox" replace />} />
        <Route path="/inbox" element={<Navigate to="/oak/inbox" replace />} />

        {/* 🗺️ Setu Govt Portal - Map View */}
        <Route path="/government/map" element={<Navigate to="/oak/map" replace />} />
        <Route path="/government/map-view" element={<Navigate to="/oak/map" replace />} />
        <Route path="/map" element={<Navigate to="/oak/map" replace />} />

        {/* 🏛️ Setu Govt Portal - Assigned */}
        <Route path="/government/assigned" element={<Navigate to="/oak/assigned" replace />} />
        <Route path="/assigned" element={<Navigate to="/oak/assigned" replace />} />

        {/* 📋 Setu Govt Portal - Detailed Report Page */}
        <Route path="/government/reports/:id" element={<OakReportRedirect />} />
        <Route path="/government/issues/:id" element={<OakReportRedirect />} />
        <Route path="/reports/:id" element={<OakReportRedirect />} />
      </Route>

      {/* Protected Stakeholder Portals */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* 🌳 \oak Portal (Role: GOVERNMENT) */}
          <Route element={<RoleGuard allowedRoles={['GOVERNMENT']} />}>
            <Route path="/oak/problems" element={<GovernmentProblems />} />
            <Route path="/oak/departments" element={<GovernmentDepartments />} />
            <Route path="/oak/universities" element={<GovernmentUniversities />} />
            <Route path="/oak/challenges" element={<GovernmentChallenges />} />
            <Route path="/oak/projects" element={<GovernmentProjects />} />
            <Route path="/oak/funding" element={<GovernmentFunding />} />
            <Route path="/oak/certificates" element={<GovernmentCertificates />} />
            <Route path="/oak/analytics" element={<GovernmentAnalytics />} />

            <Route path="/government/problems" element={<Navigate to="/oak/problems" replace />} />
            <Route path="/government/departments" element={<Navigate to="/oak/departments" replace />} />
            <Route path="/government/universities" element={<Navigate to="/oak/universities" replace />} />
            <Route path="/government/challenges" element={<Navigate to="/oak/challenges" replace />} />
            <Route path="/government/projects" element={<Navigate to="/oak/projects" replace />} />
            <Route path="/government/funding" element={<Navigate to="/oak/funding" replace />} />
            <Route path="/government/certificates" element={<Navigate to="/oak/certificates" replace />} />
            <Route path="/government/analytics" element={<Navigate to="/oak/analytics" replace />} />
          </Route>

          {/* 🌿 \saplings - University Portal (Role: UNIVERSITY) */}
          <Route element={<RoleGuard allowedRoles={['UNIVERSITY']} />}>
            <Route path="/saplings" element={<UniversityDashboard />} />
            <Route path="/saplings/dashboard" element={<UniversityDashboard />} />
            <Route path="/saplings/challenges" element={<UniversityChallenges />} />
            <Route path="/saplings/teams" element={<UniversityTeams />} />
            <Route path="/saplings/projects" element={<UniversityProjects />} />
            <Route path="/saplings/milestones" element={<UniversityMilestones />} />
            <Route path="/saplings/mentors" element={<UniversityMentors />} />
            <Route path="/saplings/funding" element={<UniversityFunding />} />
            <Route path="/saplings/communication" element={<UniversityCommunication />} />

            <Route path="/university" element={<Navigate to="/saplings/dashboard" replace />} />
            <Route path="/university/dashboard" element={<Navigate to="/saplings/dashboard" replace />} />
            <Route path="/university/challenges" element={<Navigate to="/saplings/challenges" replace />} />
            <Route path="/university/teams" element={<Navigate to="/saplings/teams" replace />} />
            <Route path="/university/projects" element={<Navigate to="/saplings/projects" replace />} />
            <Route path="/university/milestones" element={<Navigate to="/saplings/milestones" replace />} />
            <Route path="/university/mentors" element={<Navigate to="/saplings/mentors" replace />} />
            <Route path="/university/funding" element={<Navigate to="/saplings/funding" replace />} />
            <Route path="/university/communication" element={<Navigate to="/saplings/communication" replace />} />
          </Route>

          {/* 🌲 \grove - Industry Portal (Role: INDUSTRY) */}
          <Route element={<RoleGuard allowedRoles={['INDUSTRY']} />}>
            <Route path="/grove" element={<IndustryDashboard />} />
            <Route path="/grove/dashboard" element={<IndustryDashboard />} />
            <Route path="/grove/challenges" element={<IndustryChallenges />} />
            <Route path="/grove/projects" element={<IndustryProjects />} />
            <Route path="/grove/collaborations" element={<IndustryCollaborations />} />
            <Route path="/grove/funding" element={<IndustryFunding />} />
            <Route path="/grove/mentorship" element={<IndustryMentorship />} />
            <Route path="/grove/profile" element={<IndustryProfile />} />

            <Route path="/industry" element={<Navigate to="/grove/dashboard" replace />} />
            <Route path="/industry/dashboard" element={<Navigate to="/grove/dashboard" replace />} />
            <Route path="/industry/challenges" element={<Navigate to="/grove/challenges" replace />} />
            <Route path="/industry/projects" element={<Navigate to="/grove/projects" replace />} />
            <Route path="/industry/collaborations" element={<Navigate to="/grove/collaborations" replace />} />
            <Route path="/industry/funding" element={<Navigate to="/grove/funding" replace />} />
            <Route path="/industry/mentorship" element={<Navigate to="/grove/mentorship" replace />} />
            <Route path="/industry/profile" element={<Navigate to="/grove/profile" replace />} />
          </Route>
        </Route>
      </Route>

      {/* 404 Not Found Page (Optimized for Mobile & Desktop) */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
