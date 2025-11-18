import React from 'react';
import { Settings as SettingsIcon, User, Bell, Lock, Globe, Palette } from 'lucide-react';
import Card from '../../components/common/Card';

const Settings = () => {
  const settingsSections = [
    { icon: User, title: 'Profile', description: 'Manage your account information' },
    { icon: Bell, title: 'Notifications', description: 'Configure notification preferences' },
    { icon: Lock, title: 'Security', description: 'Password and security settings' },
    { icon: Globe, title: 'Language & Region', description: 'Set your preferred language and currency' },
    { icon: Palette, title: 'Appearance', description: 'Customize the app theme' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your app preferences and account settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {settingsSections.map((section, index) => (
          <Card key={index} hover className="cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary-50 rounded-xl">
                <section.icon className="w-6 h-6 text-primary-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{section.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">
            Settings functionality coming in the next update
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
