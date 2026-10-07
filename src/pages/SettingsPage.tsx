import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Save, Key, Globe } from 'lucide-react';

import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';

export const SettingsPage: React.FC = () => {
  const [apiSettings, setApiSettings] = useState({
    apiKey: import.meta.env.VITE_API_KEY || '',
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.example.com',
  });
  
  const [generalSettings, setGeneralSettings] = useState({
    theme: 'light',
    currency: 'USD',
    language: 'en',
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    saleAlerts: true,
    purchaseAlerts: true,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleApiSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setApiSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleGeneralSettingsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGeneralSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNotificationSettingsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNotificationSettings(prev => ({
      ...prev,
      [name]: value === 'true'
    }));
  };
  
  const saveSettings = (settingType: string) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(`${settingType} settings saved successfully`);
    }, 500);
  };

  return (
    <DashboardLayout title="Settings">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-500">Configure your application settings</p>
      </div>
      
      <div className="space-y-6">
        {/* API Settings */}
        <Card title="API Configuration" className="mb-6">
          <div className="space-y-4">
            <Input
              label="API Key"
              name="apiKey"
              value={apiSettings.apiKey}
              onChange={handleApiSettingsChange}
              placeholder="Enter your API key"
              fullWidth
              icon={<Key size={18} />}
            />
            
            <Input
              label="Base URL"
              name="baseUrl"
              value={apiSettings.baseUrl}
              onChange={handleApiSettingsChange}
              placeholder="Enter API base URL"
              fullWidth
              icon={<Globe size={18} />}
            />
            
            <div className="flex justify-end pt-4">
              <Button 
                onClick={() => saveSettings('API')}
                isLoading={isSubmitting}
                icon={<Save size={16} />}
              >
                Save API Settings
              </Button>
            </div>
          </div>
        </Card>
        
        {/* General Settings */}
        <Card title="General Settings" className="mb-6">
          <div className="space-y-4">
            <Select
              label="Theme"
              name="theme"
              value={generalSettings.theme}
              onChange={handleGeneralSettingsChange}
              options={[
                { value: 'light', label: 'Light Mode' },
                { value: 'dark', label: 'Dark Mode' },
                { value: 'system', label: 'System Default' }
              ]}
              fullWidth
            />
            
            <Select
              label="Currency"
              name="currency"
              value={generalSettings.currency}
              onChange={handleGeneralSettingsChange}
              options={[
                { value: 'PKR', label: 'Pakistan (Rs.)' },
                { value: 'EUR', label: 'Euro (€)' },
                { value: 'GBP', label: 'British Pound (£)' },
                { value: 'JPY', label: 'Japanese Yen (¥)' }
              ]}
              fullWidth
            />
            
            <Select
              label="Language"
              name="language"
              value={generalSettings.language}
              onChange={handleGeneralSettingsChange}
              options={[
                { value: 'en', label: 'English' },
                { value: 'es', label: 'Spanish' },
                { value: 'fr', label: 'French' },
                { value: 'de', label: 'German' }
              ]}
              fullWidth
            />
            
            <div className="flex justify-end pt-4">
              <Button 
                onClick={() => saveSettings('General')}
                isLoading={isSubmitting}
                icon={<Save size={16} />}
              >
                Save General Settings
              </Button>
            </div>
          </div>
        </Card>
        
        {/* Notification Settings */}
        <Card title="Notification Settings" className="mb-6">
          <div className="space-y-4">
            <Select
              label="Email Notifications"
              name="emailNotifications"
              value={notificationSettings.emailNotifications.toString()}
              onChange={handleNotificationSettingsChange}
              options={[
                { value: 'true', label: 'Enabled' },
                { value: 'false', label: 'Disabled' }
              ]}
              fullWidth
            />
            
            <Select
              label="Sale Alerts"
              name="saleAlerts"
              value={notificationSettings.saleAlerts.toString()}
              onChange={handleNotificationSettingsChange}
              options={[
                { value: 'true', label: 'Enabled' },
                { value: 'false', label: 'Disabled' }
              ]}
              fullWidth
            />
            
            <Select
              label="Purchase Alerts"
              name="purchaseAlerts"
              value={notificationSettings.purchaseAlerts.toString()}
              onChange={handleNotificationSettingsChange}
              options={[
                { value: 'true', label: 'Enabled' },
                { value: 'false', label: 'Disabled' }
              ]}
              fullWidth
            />
            
            <div className="flex justify-end pt-4">
              <Button 
                onClick={() => saveSettings('Notification')}
                isLoading={isSubmitting}
                icon={<Save size={16} />}
                variant="secondary"
              >
                Save Notification Settings
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};