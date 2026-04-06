import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const docTypes = [
  "İSG Katip Sözleşmeleri",
  "Risk Analizi",
  "Acil Durum Planı",
  "İSG Eğitimleri",
  "Yıllık Eğitim Planı",
  "Yıllık Çalışma Planı",
  "Yıllık Değerlendirme Raporu",
  "Talimatlar",
  "Yangın Eğitimi ve Tatbikat",
  "Sağlık Gözetimi",
  "İşe Giriş Muayenesi",
  "Sağlık Tetkikleri",
  "Periyodik Kontroller",
  "Ortam Ölçümleri",
  "KKD Zimmet Tutanakları",
  "Mesleki Eğitim/Yeterlilik Belgesi"
];

function Reports() {
  const [firms, setFirms] = useState([]);
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const firmsRes = await axios.get("/firms");
      setFirms(firmsRes.data);

      // tüm firmaların belgelerini çek
      let allDocs = [];
      for (const f of firmsRes.data) {
        const res = await axios.get(`/firms/${f.id}/docs`);
        allDocs = [...allDocs, ...res.data];
      }
      setDocs(allDocs);
    };
    loadData();
  }, []);

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>Raporlar</Typography>
      <Table component={Paper}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#1976d2" }}>
            <TableCell sx={{ color: "white" }}>Firma</TableCell>
            {docTypes.map(type => (
              <TableCell key={type} sx={{ color: "white" }}>{type}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {firms.map(firm => (
            <TableRow key={firm.id}>
              <TableCell>{firm.name}</TableCell>
              {docTypes.map(type => {
                const firmDocs = docs.filter(d => d.firmId === firm.id && d.type === type);
                return (
                  <TableCell key={type} align="center">
                    {firmDocs.length > 0 ? (
                      <CheckCircleIcon sx={{ color: "green" }} />
                    ) : (
                      <CancelIcon sx={{ color: "grey" }} />
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}

export default Reports;
