
import React from 'react';
import QRCode from 'qrcode.react';

const QRCodeStylized = ({ value, size = 128, fgColor = "#1F2937", bgColor = "#FFFFFF", level = "M" }) => {
  if (!value) {
    return (
      <div 
        className="p-1 bg-gradient-to-br from-primary via-purple-500 to-secondary rounded-lg inline-block shadow-lg flex items-center justify-center"
        style={{ width: size + 8, height: size + 8 }} 
      >
        <div 
          className="bg-muted rounded-md flex items-center justify-center"
          style={{ width: size, height: size }}
        >
          <p className="text-xs text-muted-foreground text-center p-2">Gerando QR Code...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-1 bg-gradient-to-br from-primary via-purple-500 to-secondary rounded-lg inline-block shadow-lg">
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
  