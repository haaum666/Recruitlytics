import React, { useState } from 'react';
import Layout from './components/common/Layout';
import AssessmentPage from './pages/AssessmentPage';
import HistoryPage from './pages/HistoryPage';

function App() {
  const [currentPage, setCurrentPage] = useState('assessment');

  const renderPage = () => {
    switch (currentPage) {
      case 'assessment':
        return <AssessmentPage />;
      case 'history':
        return <HistoryPage />;
      default:
        return <AssessmentPage />;
    }
  };

  return (
    <Layout>
      {renderPage()}
    </Layout>
  );
}

export default App;
