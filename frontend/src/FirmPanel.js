import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  List,
  ListItem,
  ListItemButton,
  Divider
} from "@mui/material";

function FirmPanel() {
  const [firms, setFirms] = useState([]);
  const [newFirm, setNewFirm] = useState("");
  const [selectedFirm, setSelectedFirm] = useState(null);
  const [docs, setDocs] = useState([]);
  const [approvedDocs, setApprovedDocs] = useState({});
  const [selectedType, setSelectedType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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

  useEffect(() => {
    axios.get("/firms").then(res => setFirms(res.data));
  }, []);

  const addFirm = async () => {
    if (!newFirm.trim()) return;
    const res = await axios.post("/firms", { name: newFirm });
    setFirms([...firms, res.data]);
    setNewFirm("");
  };

  const deleteFirm = async (id) => {
    await axios.delete(`/firms/${id}`);
    setFirms(firms.filter(f => f.id !== id));
    if (selectedFirm === id) {
      setSelectedFirm(null);
      setDocs([]);
    }
  };

  const selectFirm = async (id) => {
    setSelectedFirm(id);
    const res = await axios.get(`/firms/${id}/docs`);
    setDocs(res.data);
  };

  const uploadDoc = async (e) => {
    if (!selectedFirm || !selectedType) return;
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("type", selectedType);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    await axios.post(`/firms/${selectedFirm}/docs`, formData);
    const res = await axios.get(`/firms/${selectedFirm}/docs`);
    setDocs(res.data);
  };

  const deleteDoc = async (id) => {
    await axios.delete(`/docs/${id}`);
    setDocs(docs.filter(d => d.id !== id));
  };

  const openDoc = async (id) => {
    await axios.get(`/open/${id}`);
  };

  const toggleApproval = (id) => {
    setApprovedDocs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Box display="flex" gap={2} p={2}>
      {/* Sol menü */}
      <Paper elevation={3} sx={{ width: 250, p: 2 }}>
        <Typography variant="h6">Firmalar</Typography>
        <TextField
        fullWidth
        size="small"
        label="Firma adı"
        value={newFirm}
        onChange={e => setNewFirm(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            addFirm();   // Enter’a basınca firma ekle
          }
        }}
        sx={{ mt: 1 }}
      />
      <Button
        fullWidth
        variant="contained"
        color="primary"
        sx={{ mt: 1 }}
        onClick={addFirm}
      >
        Ekle
        </Button>
        <Divider sx={{ my: 2 }} />
        <List>
          {firms.map(f => (
            <ListItem
              key={f.id}
              secondaryAction={
                <Button size="small" color="error" onClick={() => deleteFirm(f.id)}>
                  Sil
                </Button>
              }
            >
              <ListItemButton onClick={() => selectFirm(f.id)}>
                {f.name}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Belgeler tablosu */}
      <Box flex={1}>
        {selectedFirm && (
          <>
            <Typography variant="h6" gutterBottom>Belgeler</Typography>
            <Box display="flex" gap={2} mb={2}>
              <Select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                displayEmpty
                size="small"
              >
                <MenuItem value="">Belge Türü Seçiniz</MenuItem>
                {docTypes.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </Select>
              <TextField
                type="date"
                size="small"
                label="Başlangıç"
                InputLabelProps={{ shrink: true }}
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
              />
              <TextField
                type="date"
                size="small"
                label="Bitiş"
                InputLabelProps={{ shrink: true }}
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
              />
              <Button variant="outlined" component="label">
                Dosya Yükle
                <input hidden type="file" onChange={uploadDoc} />
              </Button>
            </Box>

            <Table component={Paper}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#1976d2" }}>
                  <TableCell sx={{ color: "white" }}>S.N.</TableCell>
                  <TableCell sx={{ color: "white" }}>Firma</TableCell>
                  <TableCell sx={{ color: "white" }}>Belge Türü</TableCell>
                  <TableCell sx={{ color: "white" }}>Doküman</TableCell>
                  <TableCell sx={{ color: "white" }}>Tarih Aralığı</TableCell>
                  <TableCell sx={{ color: "white" }}>Onay</TableCell>
                  <TableCell sx={{ color: "white" }}>Sil</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {docs.map((d, i) => (
                  <TableRow key={d.id} sx={{ backgroundColor: i % 2 === 0 ? "#ecf0f1" : "#fdfdfd" }}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{firms.find(f => f.id === d.firmId)?.name}</TableCell>
                    <TableCell>{d.type}</TableCell>
                    <TableCell>
                      {d.filename}{" "}
                      <Button size="small" variant="contained" color="success" onClick={() => openDoc(d.id)}>
                        Aç
                      </Button>
                    </TableCell>
                    <TableCell>{d.startDate} - {d.endDate}</TableCell>
                    <TableCell align="center">
                      <Button size="small" variant="outlined" onClick={() => toggleApproval(d.id)}>
                        {approvedDocs[d.id] ? "✅" : "⬜"}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button size="small" color="error" onClick={() => deleteDoc(d.id)}>
                        Sil
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </Box>
    </Box>
  );
}

export default FirmPanel;
