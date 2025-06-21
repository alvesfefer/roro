
import React from 'react';
import QRCode from 'qrcode.react';

const QRCodeStylized = ({ value, size = 128, fgColor = "#1F2937", bgColor = "#FFFFFF", level = "M" }) => {
  if (!value) {
    return (
      <div 
        className="flex items-center justify-center p-1 rounded-lg shadow-lg bg-gradient-to-br from-primary via-purple-500 to-secondary"
        style={{ width: size + 8, height: size + 8 }} 
      >
        <div 
          className="flex items-center justify-center rounded-md bg-muted"
          style={{ width: size, height: size }}
        >
          <p className="p-2 text-xs text-center text-muted-foreground">Gerando QR Code...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="inline-block p-1 rounded-lg shadow-lg bg-gradient-to-br from-primary via-purple-500 to-secondary">
      <QRCode
        value={value}
        size={size}
        fgColor={fgColor} 
        bgColor={bgColor} 
        level={level} 
        renderAs="svg" 
        imageSettings={{ 
          excavate: true, 
          width: size * 0.15, 
          height: size * 0.15,
        }}
        className="rounded-md"
      />
    </div>
  );
};

export default QRCodeStylized;
  