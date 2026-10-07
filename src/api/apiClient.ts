const API_KEY = import.meta.env.VITE_API_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVobmVyZXd4bXdpdmlybnVncXlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMDIwOTMsImV4cCI6MjA2MTY3ODA5M30.SVedLQVv4vMj5_RY9wKX4PKQ9SeEFQUjVFm-hkmGIXg';
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://ehnerewxmwivirnugqyp.supabase.co/rest/v1';

const headers = {
  'apiKey': API_KEY,
  'Content-Type': 'application/json'
};

export async function fetchData<T>(endpoint: string): Promise<T[]> {
  try {
    var response = null;
    if (endpoint === 'accounts') {
      response = await fetch(`${BASE_URL}/${endpoint}?order=acc_id`, {
        method: 'GET',
        headers
      });
    } else {
      response = await fetch(`${BASE_URL}/${endpoint}`, {
        method: 'GET',
        headers
      });

    }
   
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

export async function createItem<T>(endpoint: string, data: Omit<T, 'id'>): Promise<T> {
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      if (response.status === 409) {
        throw new Error('A record with this ID already exists');
      }
      throw new Error(`Error ${response.status}: ${await response.text()}`);
    }
    
    const text = await response.text();
    if (!text) return null as T;
    
    try {
      return JSON.parse(text);
    } catch {
      return null as T;
    }
  } catch (error) {
    console.error(`Error creating ${endpoint}:`, error);
    throw error;
  }
}

export async function updateItem<T>(endpoint: string, id: number | string, data: Partial<T>): Promise<void> {
  const idParam = getIdParamName(endpoint);
  
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}?${idParam}=eq.${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }
  } catch (error) {
    console.error(`Error updating ${endpoint}:`, error);
    throw error;
  }
}

export async function deleteItem(endpoint: string, id: number | string): Promise<void> {
  const idParam = getIdParamName(endpoint);
  
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}?${idParam}=eq.${id}`, {
      method: 'DELETE',
      headers
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }
  } catch (error) {
    console.error(`Error deleting ${endpoint}:`, error);
    throw error;
  }
}

function getIdParamName(endpoint: string): string {
  switch (endpoint) {
    case 'accounts':
      return 'uid';
    case 'sales':
      return 'sale_id';
    case 'purchases':
      return 'purchase_id';
    case 'summary':
      return 'summary_id';
    default:
      return 'id';
  }
}