import React, { useState } from 'react';
import Layout from './components/common/Layout';
import AssessmentPage from './pages/AssessmentPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  const [currentPage, setCurrentPage] = useState('assessment');
  const [assessmentToEdit, setAssessmentToEdit] = useState(null);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (page !== 'assessment') {
      setAssessmentToEdit(null);
    }
  };

  const handleEditAssessment = (assessment) => {
    setAssessmentToEdit(assessment);
    setCurrentPage('assessment');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'assessment':
        return <AssessmentPage assessmentToEdit={assessmentToEdit} setAssessmentToEdit={setAssessmentToEdit} />;
      case 'history':
        return <HistoryPage onEdit={handleEditAssessment} />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <AssessmentPage assessmentToEdit={assessmentToEdit} setAssessmentToEdit={setAssessmentToEdit} />;
    }
  };

  return (
    <Layout onPageChange={handlePageChange}>
      {renderPage()}
    </Layout>
  );
}

export default App;
