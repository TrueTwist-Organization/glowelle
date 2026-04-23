/**
 * Lipstick API Service
 * This file handles the communication with the n8n webhook.
 */

export async function tryLipstick(formData) {
  try {
    const res = await fetch('/api/lipstick', {
      method: 'POST',
      body: formData
    });

    if (!res.ok) throw new Error('Failed to reach AI service');
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
