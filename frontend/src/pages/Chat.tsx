import React from 'react';
import Header from '../components/Header';

const Chat: React.FC = () => {
  return (
    <>
      <Header />
      <div style={{ 
        backgroundColor: '#0d1214', 
height: '93vh', 
        overflow: 'hidden',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
padding: '34px',
        margin: 0
      }}>
        <div style={{
          position: 'relative',
          width: 'min(90vw, 480px)',
          height: 'min(90vh, 700px)',
          backgroundColor: 'white',
          borderRadius: '20px',
          boxShadow: 'rgba(73, 168, 251, 0.4) 0px 20px 40px',
          border: '2px solid rgb(73, 168, 251)',
          overflow: 'hidden',
          minWidth: '320px',
minHeight: '450px',
          zIndex: 1000
        }}>
          <iframe 
            src="https://widget.tiflux.com/?organization_token=582a9e7c57d9586f18448ac59facb9d764dbf6b8&amp;mail=&amp;name=&amp;phone=&amp;autoSend=false&amp;extra_params=%22%7B%5C%22domain%5C%22:%5C%22129.121.39.130%5C%22%7D%22" 
            style={{
              height: '100%',
              width: '100%',
              border: 'none',
              borderRadius: '18px 18px 0 0'
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Chat;

