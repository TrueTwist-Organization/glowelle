import React, { useState } from 'react';
import { tryLipstick } from '../api/lipstick';

export default function TestPage() {
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('image', file);
    // You can also append 'shade' here if your n8n workflow expects it
    // formData.append('shade', 'FF0000'); 

    try {
      const data = await tryLipstick(formData);
      
      // Use the URL directly as requested
      const outputUrl = (Array.isArray(data) ? data[0]?.transformed_url : data.transformed_url) || data.url || data.image;
      
      if (outputUrl) {
        setResult(outputUrl);
      } else {
        throw new Error('No output URL found in response');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ 
      padding: '4rem 2rem', 
      maxWidth: '1200px', 
      margin: '0 auto', 
      background: '#0a0a0a', 
      color: 'white',
      minHeight: '100vh'
    }}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '2rem' }}>Lipstick Try-On Test</h2>
      
      <div style={{ 
        background: 'rgba(255,255,255,0.05)', 
        padding: '2rem', 
        borderRadius: '24px', 
        border: '1px solid rgba(255,255,255,0.1)',
        marginBottom: '2rem'
      }}>
        <input 
          id="test-upload-input"
          name="test-upload-input"
          type="file" 
          accept="image/*" 
          onChange={handleFile}
          style={{ 
            fontSize: '1rem',
            color: '#888',
            marginBottom: '1rem'
          }}
        />
        {loading && <p style={{ color: '#e91e63', fontWeight: 700 }}>⏳ Processing AI... (This may take 30-60 seconds)</p>}
        {error && <p style={{ color: '#ff5252' }}>❌ Error: {error}</p>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {preview && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ marginBottom: '1rem', color: '#888', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Original Image</p>
            <img src={preview} style={{ width: '100%', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }} alt="Original" />
          </div>
        )}
        
        {result && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ marginBottom: '1rem', color: '#4caf50', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>AI Result ✅</p>
            <img src={result} style={{ width: '100%', borderRadius: '24px', boxShadow: '0 20px 40px rgba(233, 30, 99, 0.2)' }} alt="Result" />
          </div>
        )}
      </div>
    </div>
  );
}
