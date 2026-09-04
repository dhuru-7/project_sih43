import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { LandingLayout } from '../layouts/LandingLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';

// Route Guards
import { ProtectedRoute } from './ProtectedRoute';
import { RoleGuard } from './RoleGuard';

// Public Pages
import { LandingPage } from '../public-pages/LandingPage';
import { LoginPage } from '../public-pages/LoginPage';
import { RegisterPage } from '../public-pages/RegisterPage';

// Government Pages
import { GovernmentDashboard } from '../portals/government/pages/Dashboard';
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

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<LandingLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected Stakeholder Portals */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* 🏛️ Government Portal (Role: GOVERNMENT) */}
          <Route element={<RoleGuard allowedRoles={['GOVERNMENT']} />}>
            <Route path="/government/dashboard" element={<GovernmentDashboard />} />
            <Route path="/government/problems" element={<GovernmentProblems />} />
            <Route path="/government/departments" element={<GovernmentDepartments />} />
            <Route path="/government/universities" element={<GovernmentUniversities />} />
            <Route path="/government/challenges" element={<GovernmentChallenges />} />
            <Route path="/government/projects" element={<GovernmentProjects />} />
            <Route path="/government/funding" element={<GovernmentFunding />} />
            <Route path="/government/certificates" element={<GovernmentCertificates />} />
            <Route path="/government/analytics" element={<GovernmentAnalytics />} />
          </Route>

          {/* 🎓 University Portal (Role: UNIVERSITY) */}
          <Route element={<RoleGuard allowedRoles={['UNIVERSITY']} />}>
            <Route path="/university/dashboard" element={<UniversityDashboard />} />
            <Route path="/university/challenges" element={<UniversityChallenges />} />
            <Route path="/university/teams" element={<UniversityTeams />} />
            <Route path="/university/projects" element={<UniversityProjects />} />
            <Route path="/university/milestones" element={<UniversityMilestones />} />
            <Route path="/university/mentors" element={<UniversityMentors />} />
            <Route path="/university/funding" element={<UniversityFunding />} />
            <Route path="/university/communication" element={<UniversityCommunication />} />
          </Route>

          {/* 🏢 Industry Portal (Role: INDUSTRY) */}
          <Route element={<RoleGuard allowedRoles={['INDUSTRY']} />}>
            <Route path="/industry/dashboard" element={<IndustryDashboard />} />
            <Route path="/industry/challenges" element={<IndustryChallenges />} />
            <Route path="/industry/projects" element={<IndustryProjects />} />
            <Route path="/industry/collaborations" element={<IndustryCollaborations />} />
            <Route path="/industry/funding" element={<IndustryFunding />} />
            <Route path="/industry/mentorship" element={<IndustryMentorship />} />
            <Route path="/industry/profile" element={<IndustryProfile />} />
          </Route>
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
