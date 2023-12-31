// import React, { useEffect, useState } from 'react';
// import QrReader from 'react-qr-code-scanner';

// const BarcodeScanner = () => {
//   const [barcode, setBarcode] = useState('');

//   const handleScan = (data) => {
//     if (data) {
//       setBarcode(data);
//     }
//   };

//   return (
//     <div>
//       <QrReader
//         delay={300}
//         onError={(error) => console.log(error)}
//         onScan={handleScan}
//       />
//       {barcode && <p>Scanned Barcode: {barcode}</p>}
//     </div>
//   );
// };

// export default BarcodeScanner;
