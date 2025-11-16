import React, {useEffect, useState} from 'react';
import {RotateCcw, Save} from 'lucide-react';
import {Modal} from '../ui/Modal';
import {Button} from '../ui/Button';
import {useAdmin} from '../../hooks/useAdmin';
import {useSystemPrompt} from '../../hooks/useSystemPrompt';
import {useToast} from '../ui/Toast';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
                                                                isOpen,
                                                                onClose,
                                                            }) => {
    const {getAdminSettings, updateSettings, restart} = useAdmin();
    const {systemPrompt, setSystemPrompt, resetSystemPrompt} = useSystemPrompt();
    const {addToast} = useToast();
    const [settings, setSettings] = useState<string>('{}');
    const [originalSettings, setOriginalSettings] = useState<string>('{}');
    const [localSystemPrompt, setLocalSystemPrompt] = useState(systemPrompt);
    const [activeTab, setActiveTab] = useState<'model' | 'system' | 'api'>('model');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [apiSettings, setApiSettings] = useState({
        webSearch: false,
        date: false,
        weather: false,
        currency: false,
        stocks: false,
    });

    // Load settings when modal opens
    useEffect(() => {
        if (isOpen) {
            loadSettings();
            setLocalSystemPrompt(systemPrompt);
        }
    }, [isOpen, systemPrompt]);

    const loadSettings = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getAdminSettings();
            if (data) {
                const settingsJson = JSON.stringify(data, null, 2);
                setSettings(settingsJson);
                setOriginalSettings(settingsJson);

                // Extract builtInAPICall settings
                if (data.builtInAPICall) {
                    setApiSettings({
                        webSearch: data.builtInAPICall.webSearch ?? false,
                        date: data.builtInAPICall.date ?? false,
                        weather: data.builtInAPICall.weather ?? false,
                        currency: data.builtInAPICall.currency ?? false,
                        stocks: data.builtInAPICall.stocks ?? false,
                    });
                }
            }
        } catch (err) {
            setError('Failed to load settings');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setError(null);
            // Validate JSON
            const parsed = JSON.parse(settings);

            setIsLoading(true);
            const success = await updateSettings(parsed);

            if (success) {
                setOriginalSettings(settings);
                addToast('Settings saved successfully', 'success');
            } else {
                setError('Failed to save settings');
                addToast('Failed to save settings', 'error');
            }
        } catch (err) {
            setError('Invalid JSON format');
            addToast('Invalid JSON format', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveAndRestart = async () => {
        await handleSave();
        if (!error) {
            setIsLoading(true);
            try {
                const success = await restart();
                if (success) {
                    addToast('Server restarting...', 'info');
                    // Wait a moment before closing
                    setTimeout(() => {
                        onClose();
                    }, 1000);
                } else {
                    addToast('Failed to restart server', 'error');
                }
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleReset = () => {
        setSettings(originalSettings);
        setError(null);
    };

    const handleSaveSystemPrompt = () => {
        if (localSystemPrompt.trim()) {
            setSystemPrompt(localSystemPrompt);
            addToast('System prompt saved', 'success');
        } else {
            addToast('System prompt cannot be empty', 'error');
        }
    };

    const handleResetSystemPrompt = () => {
        resetSystemPrompt();
        setLocalSystemPrompt(systemPrompt);
        addToast('System prompt reset to default', 'info');
    };

    const handleAPISettingChange = async (key: keyof typeof apiSettings, value: boolean) => {
        // Update local state
        const updatedApiSettings = {...apiSettings, [key]: value};
        setApiSettings(updatedApiSettings);

        // Update the JSON settings with builtInAPICall
        try {
            setError(null);
            const currentSettings = JSON.parse(settings);
            const updatedSettings = {
                ...currentSettings,
                builtInAPICall: updatedApiSettings,
            };

            addToast('API setting changed - restarting server...', 'info');
            setIsLoading(true);

            // Save settings and restart
            const success = await updateSettings(updatedSettings);
            if (success) {
                setSettings(JSON.stringify(updatedSettings, null, 2));
                setOriginalSettings(JSON.stringify(updatedSettings, null, 2));

                const restartSuccess = await restart();
                if (restartSuccess) {
                    addToast('Server restarted successfully', 'success');
                    // Close modal after short delay
                    setTimeout(() => {
                        onClose();
                    }, 1000);
                } else {
                    addToast('Failed to restart server', 'error');
                }
            } else {
                addToast('Failed to save API settings', 'error');
            }
        } catch (err) {
            console.error('Error updating API settings:', err);
            addToast('Error updating API settings', 'error');
            setError('Failed to update API settings');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetAPISettings = async () => {
        const defaultSettings = {
            webSearch: false,
            date: false,
            weather: false,
            currency: false,
            stocks: false,
        };
        setApiSettings(defaultSettings);

        try {
            setError(null);
            const currentSettings = JSON.parse(settings);
            const updatedSettings = {
                ...currentSettings,
                builtInAPICall: defaultSettings,
            };

            addToast('Resetting API settings...', 'info');
            setIsLoading(true);

            const success = await updateSettings(updatedSettings);
            if (success) {
                setSettings(JSON.stringify(updatedSettings, null, 2));
                setOriginalSettings(JSON.stringify(updatedSettings, null, 2));
                addToast('API settings reset to defaults', 'success');
            } else {
                addToast('Failed to reset API settings', 'error');
            }
        } catch (err) {
            console.error('Error resetting API settings:', err);
            addToast('Error resetting API settings', 'error');
            setError('Failed to reset API settings');
        } finally {
            setIsLoading(false);
        }
    };

    const hasChanges = settings !== originalSettings;
    const systemPromptChanged = localSystemPrompt !== systemPrompt;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Settings">
            {/* Tabs */}
            <div className="mb-4 flex gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('model')}
                    className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
                        activeTab === 'model'
                            ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                    Model Settings
                </button>
                <button
                    onClick={() => setActiveTab('system')}
                    className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
                        activeTab === 'system'
                            ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                    System Prompt
                </button>
                <button
                    onClick={() => setActiveTab('api')}
                    className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
                        activeTab === 'api'
                            ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                    Built-in APIs
                </button>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded text-sm text-red-800 dark:text-red-200">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                {/* Model Settings Tab */}
                {activeTab === 'model' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                                JSON Settings
                            </label>
                            <textarea
                                value={settings}
                                onChange={(e) => {
                                    setSettings(e.target.value);
                                    setError(null);
                                }}
                                className="w-full h-64 px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="Enter JSON settings..."
                                disabled={isLoading}
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <Button
                                onClick={handleSave}
                                disabled={!hasChanges || isLoading}
                                isLoading={isLoading}
                                className="flex-1 gap-2"
                            >
                                <Save className="w-4 h-4"/>
                                Save
                            </Button>

                            <Button
                                onClick={handleSaveAndRestart}
                                disabled={!hasChanges || isLoading}
                                variant="secondary"
                                className="flex-1 gap-2"
                            >
                                <RotateCcw className="w-4 h-4"/>
                                Save & Restart
                            </Button>

                            {hasChanges && (
                                <Button
                                    onClick={handleReset}
                                    variant="ghost"
                                    disabled={isLoading}
                                    className="px-4 gap-2"
                                >
                                    Reset
                                </Button>
                            )}
                        </div>

                        {/* Info */}
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Edit the JSON settings above. Changes will be saved to the server.
                        </p>
                    </>
                )}

                {/* System Prompt Tab */}
                {activeTab === 'system' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                                System Prompt
                            </label>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                                This prompt will be sent with new conversations to establish the AI's behavior.
                            </p>
                            <textarea
                                value={localSystemPrompt}
                                onChange={(e) => setLocalSystemPrompt(e.target.value)}
                                className="w-full h-40 px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="Enter system prompt..."
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <Button
                                onClick={handleSaveSystemPrompt}
                                disabled={!systemPromptChanged}
                                className="flex-1 gap-2"
                            >
                                <Save className="w-4 h-4"/>
                                Save Prompt
                            </Button>

                            <Button
                                onClick={handleResetSystemPrompt}
                                variant="secondary"
                                className="flex-1 gap-2"
                            >
                                <RotateCcw className="w-4 h-4"/>
                                Reset
                            </Button>
                        </div>

                        {/* Info */}
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            The system prompt helps define how the AI behaves. Changes take effect for new conversations.
                        </p>
                    </>
                )}

                {/* Built-in APIs Tab */}
                {activeTab === 'api' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-slate-900 dark:text-white mb-3">
                                Built-in API Features
                            </label>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                                Enable or disable built-in API features that extend the AI's capabilities.
                            </p>

                            {/* Web Search Toggle */}
                            <div
                                className="flex items-center justify-between p-3 mb-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">Web Search</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Allow the AI to search the web</p>
                                </div>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={apiSettings.webSearch}
                                        onChange={(e) => handleAPISettingChange('webSearch', e.target.checked)}
                                        disabled={isLoading}
                                        className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 disabled:opacity-50"
                                    />
                                </label>
                            </div>

                            {/* Date Toggle */}
                            <div
                                className="flex items-center justify-between p-3 mb-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">Date & Time</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Provide current date and time information</p>
                                </div>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={apiSettings.date}
                                        onChange={(e) => handleAPISettingChange('date', e.target.checked)}
                                        disabled={isLoading}
                                        className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 disabled:opacity-50"
                                    />
                                </label>
                            </div>

                            {/* Weather Toggle */}
                            <div
                                className="flex items-center justify-between p-3 mb-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">Weather</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Access weather information</p>
                                </div>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={apiSettings.weather}
                                        onChange={(e) => handleAPISettingChange('weather', e.target.checked)}
                                        disabled={isLoading}
                                        className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 disabled:opacity-50"
                                    />
                                </label>
                            </div>

                            {/* Currency Toggle */}
                            <div
                                className="flex items-center justify-between p-3 mb-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">Currency Exchange</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Get real-time currency exchange rates</p>
                                </div>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={apiSettings.currency}
                                        onChange={(e) => handleAPISettingChange('currency', e.target.checked)}
                                        disabled={isLoading}
                                        className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 disabled:opacity-50"
                                    />
                                </label>
                            </div>

                            {/* Stocks Toggle */}
                            <div
                                className="flex items-center justify-between p-3 mb-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">Stock Data</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Access stock prices and market data</p>
                                </div>
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={apiSettings.stocks}
                                        onChange={(e) => handleAPISettingChange('stocks', e.target.checked)}
                                        disabled={isLoading}
                                        className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 disabled:opacity-50"
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Reset Button */}
                        <div className="flex gap-3">
                            <Button
                                onClick={handleResetAPISettings}
                                disabled={isLoading}
                                variant="ghost"
                                className="flex-1 gap-2"
                            >
                                <RotateCcw className="w-4 h-4"/>
                                Reset to Default
                            </Button>
                        </div>

                        {/* Info */}
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Changes to API settings take effect immediately for new messages.
                        </p>
                    </>
                )}
            </div>
        </Modal>
    );
};
