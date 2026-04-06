import React, { useState } from 'react';
import axios from 'axios';

const belgeTipleri = [
  'İSG Katip Sözleşmeleri',
  'Risk Analizi Raporu',
  'Acil Durum Planı',
  'İSG Eğitimler',
  'Sağlık Raporu',
  'Yıllık Planlar',
  'Tespit ve Öneri Defteri',
];

const FirmaBelgeSatiri = ({ firma }) => {
  const [belgeTipi, setBelgeTipi] = useState('');
  const [dosyaURL, setDosyaURL] = useState('');

  const handleDosyaYukle = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    // Backend'e dosya gönder
    const res = await axios.post('http://localhost:5000/upload', formData);
    setDosyaURL(res.data.url);
  };

  return (
    <tr>
      <td>{firma.id}</td>
      <td>{firma.unvan}</td>
      <td>
        <select value={belgeTipi} onChange={(e) => setBelgeTipi(e.target.value)}>
          <option value="">Belge Seç</option>
          {belgeTipleri.map((tip) => (
            <option key={tip} value={tip}>{tip}</option>
          ))}
        </select>
      </td>
      <td>
        {!dosyaURL ? (
          <input type="file" onChange={handleDosyaYukle} />
        ) : (
          <a href={`http://localhost:5000${dosyaURL}`} target="_blank" rel="noopener noreferrer">
            Aç
          </a>
        )}
      </td>
    </tr>
  );
};

const FirmaBelgeTablosu = () => {
  const firmalar = [
    { id: 1, unvan: 'Eray Akar' },
    { id: 2, unvan: 'ABC İnşaat' },
  ];

  return (
    <table border="1" cellPadding="10" style={{ width: '100%', marginTop: '20px' }}>
      <thead>
        <tr style={{ backgroundColor: '#e0f0ff' }}>
          <th>S.N.</th>
          <th>Firma Unvanı</th>
          <th>İSG Belgeleri</th>
          <th>Dokuman</th>
        </tr>
      </thead>
      <tbody>
        {firmalar.map((firma) => (
          <FirmaBelgeSatiri key={firma.id} firma={firma} />
        ))}
      </tbody>
    </table>
  );
};

export default FirmaBelgeTablosu;