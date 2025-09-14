import React, { useState } from 'react';
import Layout from './components/common/Layout';
import AssessmentPage from './pages/AssessmentPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  const [currentPage, setCurrentPage] = useState('assessment');

  const renderPage = () => {
    switch (currentPage) {
      case 'assessment':
        return <AssessmentPage />;
      case 'history':
        return <HistoryPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <AssessmentPage />;
    }
  };

  return (
    <Layout onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default App;
