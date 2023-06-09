export async function haveAdminAccess(){
    const request = await fetch('/api/admin');
    return await request.json();
}

export async function getSettings(){
    const request = await fetch('/api/admin/settings');
    return await request.json();
}

export async function saveSettings(settings){
    const request = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
    });
    return await request.json();
}

export async function restartServer(){
    const request = await fetch('/api/admin/restart', {
        method: 'POST',
    });
    return await request.json();
}