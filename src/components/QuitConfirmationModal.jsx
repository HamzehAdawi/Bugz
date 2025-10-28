import React from 'react';

const QuitConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
      onClick={onCancel}
    >
      <div 
        style={{
          backgroundColor: '#fff',
          padding: '30px',
          borderRadius: '15px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          maxWidth: '400px',
          width: '90%',
          textAlign: 'center'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        
        <p style={{ 
          marginBottom: '30px', 
          color: '#6e6c6cff',
          fontSize: '16px'
        }}>
          Are you sure you want to leave?
        </p>
        <div style={{ 
          display: 'flex', 
          gap: '15px', 
          justifyContent: 'center' 
        }}>
          <button 
            onClick={() => {
              onConfirm();

            }}
            style={{
              padding: '12px 30px',
              fontSize: '16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#4CAF50',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
          >
            Yes
          </button>
          <button 
            onClick={onCancel}
            style={{
              padding: '12px 30px',
              fontSize: '16px',
              borderRadius: '8px',
              border: '2px solid #ddd',
              backgroundColor: 'white',
              color: '#333',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#f5f5f5';
              e.target.style.borderColor = '#999';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'white';
              e.target.style.borderColor = '#ddd';
            }}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};
export default QuitConfirmationModal;