import React from 'react';
import QuestionsEditor from '../components/settings/QuestionsEditor';
import EmailTemplateEditor from '../components/settings/EmailTemplateEditor';

function SettingsPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Настройки</h1>
      <p className="text-gray-600 mb-6">
        Здесь вы можете управлять вопросами, весами и шаблонами писем.
      </p>
      <div className="space-y-6">
        <QuestionsEditor />
        <EmailTemplateEditor />
      </div>
    </div>
  );
}

export default SettingsPage;
