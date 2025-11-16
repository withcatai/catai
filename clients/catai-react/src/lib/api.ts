export async function checkAdmin(): Promise<boolean> {
    try {
        const response = await fetch('/api/admin');
        return response.ok;
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
}

export async function getSettings(): Promise<Record<string, any> | null> {
    try {
        const response = await fetch('/api/admin/settings');
        if (response.ok) {
            return await response.json();
        }
        return null;
    } catch (error) {
        console.error('Error fetching settings:', error);
        return null;
    }
}

export async function saveSettings(settings: Record<string, any>): Promise<boolean> {
    try {
        const response = await fetch('/api/admin/settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(settings),
        });
        return response.ok;
    } catch (error) {
        console.error('Error saving settings:', error);
        return false;
    }
}

export async function restartServer(): Promise<boolean> {
    try {
        const response = await fetch('/api/admin/restart', {
            method: 'POST',
        });
        return response.ok;
    } catch (error) {
        console.error('Error restarting server:', error);
        return false;
    }
}
