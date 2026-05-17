import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import CreateFormPage from './pages/CreateFormPage';
import FillFormPage from './pages/FillFormPage';
import DashboardPage from './pages/DashboardPage';
import AnalysisPage from './pages/AnalysisPage';
import ResponsesListPage from './pages/ResponsesListPage';
import AIInsightsPage from './pages/AIInsightsPage';
import SpamFilterPage from './pages/SpamFilterPage';
import SavedFormsPage from './pages/SavedFormsPage';
import TemplatesPage from './pages/TemplatesPage';
import AuthPage from './pages/AuthPage';
import UserPortalPage from './pages/UserPortalPage';
import AppLayout from './components/AppLayout';
import { FormProvider, useForms } from './context/FormContext';
import { Page, Template } from './types';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page | any>('landing');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const { user, setSelectedFormId } = useForms();

  // Smooth scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // Dynamic Query Parameter Parser for secure sharing link redirection
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fillFormId = params.get('fill') || params.get('form');
    if (fillFormId) {
      console.log(`🔗 SmartPulse shared form link parsed successfully. Redirecting to form: ${fillFormId}`);
      setSelectedFormId(fillFormId);
      setCurrentPage('fill');
    }
  }, [setSelectedFormId]);

  // Authentication Route Guard
  useEffect(() => {
    const adminPages = ['dashboard', 'analysis', 'responses', 'insights', 'spam', 'saved-forms', 'create', 'templates'];
    
    if (adminPages.includes(currentPage)) {
      if (!user) {
        console.log('🔒 Unauthenticated access to admin page. Redirecting to Auth page.');
        setCurrentPage('auth');
      } else if (user.role !== 'admin') {
        console.log('🔒 Unauthorized access. Standard users redirected to User Portal.');
        setCurrentPage('user-portal');
      }
    } else if (currentPage === 'user-portal') {
      if (!user) {
        setCurrentPage('auth');
      } else if (user.role === 'admin') {
        setCurrentPage('dashboard');
      }
    }
  }, [currentPage, user]);

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setCurrentPage('create');
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage onNavigate={setCurrentPage} />;
      case 'analysis':
        return <AnalysisPage onNavigate={setCurrentPage} />;
      case 'responses':
        return <ResponsesListPage />;
      case 'insights':
        return <AIInsightsPage />;
      case 'spam':
        return <SpamFilterPage />;
      case 'saved-forms':
        return <SavedFormsPage onNavigate={setCurrentPage} />;
      default:
        return <DashboardPage onNavigate={setCurrentPage} />;
    }
  };

  const renderPage = () => {
    if (['dashboard', 'analysis', 'responses', 'insights', 'spam', 'saved-forms'].includes(currentPage)) {
      return (
        <AppLayout currentPage={currentPage} onNavigate={setCurrentPage}>
          {renderContent()}
        </AppLayout>
      );
    }

    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={setCurrentPage} />;
      case 'auth':
        return <AuthPage onNavigate={setCurrentPage} />;
      case 'user-portal':
        return <UserPortalPage onNavigate={setCurrentPage} />;
      case 'create':
        return <CreateFormPage onNavigate={setCurrentPage} template={selectedTemplate} onClearTemplate={() => setSelectedTemplate(null)} />;
      case 'fill':
        return <FillFormPage onNavigate={setCurrentPage} />;
      case 'templates':
        return <TemplatesPage onNavigate={setCurrentPage} onSelectTemplate={handleSelectTemplate} />;
      default:
        return <LandingPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen selection:bg-blue-500/30 selection:text-blue-200">
      {renderPage()}
    </div>
  );
}

export default function App() {
  return (
    <FormProvider>
      <div className="min-h-screen selection:bg-blue-500/30 selection:text-blue-200">
        <AppContent />
      </div>
    </FormProvider>
  );
}
