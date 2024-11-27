import React, { useEffect } from 'react';
import './css/top.css';

function Top() {
  useEffect(() => {
    new Granim({
      element: '#canvas-basic',
      direction: 'diagonal',
      states: {
        "default-state": {
          gradients: [
            ['#ff9966', '#ff5e62'],
            ['#00F260', '#0575E6'],
            ['#e1eec3', '#f05053']
          ],
          transitionSpeed: 2000
        }
      }
    });
  }, []);

  return (
    <div className="container">
      {/* 背景用のCanvas */}
      <canvas id="canvas-basic"></canvas>
      <div className='logo_area'>
        <img src='./logo.png' width={700} alt="logo" />
      </div>
      <p>ストレスフリーなコミュニケーションツール</p>
      <a href='/login' className='btn'>ここから始める</a>
    </div>
  );
}

export default Top;
