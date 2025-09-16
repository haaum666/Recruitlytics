import React, { useState, useRef } from 'react';
import Layout from './components/common/Layout';
import AssessmentPage from './pages/AssessmentPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  const [currentPage, setCurrentPage] = useState('assessment');
  const [assessmentToEdit, setAssessmentToEdit] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const saveButtonRef = useRef(null);
  const historyButtonRef = useRef(null);

  const handlePageChange = (page) => {
    if (page === 'history' && currentPage === 'assessment' && saveButtonRef.current && historyButtonRef.current) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentPage(page);
        setAssessmentToEdit(null);
        setIsAnimating(false);
      }, 1000);
    } else {
      setCurrentPage(page);
      if (page !== 'assessment') {
        setAssessmentToEdit(null);
      }
    }
  };

  const handleEditAssessment = (assessment) => {
    setAssessmentToEdit(assessment);
    setCurrentPage('assessment');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'assessment':
        return <AssessmentPage 
          assessmentToEdit={assessmentToEdit} 
          setAssessmentToEdit={setAssessmentToEdit} 
          onPageChange={handlePageChange} 
          saveButtonRef={saveButtonRef}
        />;
      case 'history':
        return <HistoryPage onEdit={handleEditAssessment} />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <AssessmentPage 
          assessmentToEdit={assessmentToEdit} 
          setAssessmentToEdit={setAssessmentToEdit} 
          onPageChange={handlePageChange}
          saveButtonRef={saveButtonRef}
        />;
    }
  };

  const getAnimationStyles = () => {
    if (!saveButtonRef.current || !historyButtonRef.current) {
      return {};
    }

    const saveButtonRect = saveButtonRef.current.getBoundingClientRect();
    const historyButtonRect = historyButtonRef.current.getBoundingClientRect();

    const startX = saveButtonRect.left + saveButtonRect.width / 2;
    const startY = saveButtonRect.top + saveButtonRect.height / 2;
    const endX = historyButtonRect.left + historyButtonRect.width / 2;
    const endY = historyButtonRect.top + historyButtonRect.height / 2;

    const deltaX = endX - startX;
    const deltaY = endY - startY;

    return {
      transform: `translate(${deltaX}px, ${deltaY}px) scale(0.2)`,
      transition: 'transform 1s ease-in-out',
    };
  };

  return (
    <div className="relative min-h-screen">
      {isAnimating && (
        <div 
          className="absolute z-[100] w-6 h-6 rounded-full bg-gray-300 shadow-lg"
          style={{
            ...getAnimationStyles(),
            top: saveButtonRef.current?.getBoundingClientRect().top + saveButtonRef.current?.getBoundingClientRect().height / 2 - 12,
            left: saveButtonRef.current?.getBoundingClientRect().left + saveButtonRef.current?.getBoundingClientRect().width / 2 - 12,
          }}
        />
      )}
      <Layout onPageChange={handlePageChange} currentPage={currentPage} historyButtonRef={historyButtonRef}>
        {renderPage()}
      </Layout>
    </div>
  );
}

export default App;
