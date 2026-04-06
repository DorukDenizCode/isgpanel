import React, { useState } from "react";
import { TextField, Button, Box, Typography, Select, MenuItem } from "@mui/material";
import axios from "axios";

function AddFirm() {
  const [firm, setFirm] = useState({
    name: "",
    class: "",
    address: "",
    sicilNo: "",
    phone: "",
    email: "",
    manager: "",
    isgExpert: "",
    doctor: ""
  });

  const saveFirm = async () => {
    try {
      const res = await axios.post("/firms", firm);
      alert("Firma kaydedildi!");
      // burada navigate ile /firms sayfasına yönlendirebilirsin
    } catch (err) {
      alert("Firma kaydedilemedi: " + err.message);
    }
  };

  return (
    <Box p={2}>
      <Typography variant="h6" sx={{ mb: 2 }}>Yeni Firma Ekle</Typography>

      <TextField 
        label="Firma Adı" 
        fullWidth 
        sx={{ mb: 2 }}
        value={firm.name}
        onChange={e => setFirm({ ...firm, name: e.target.value })}
      />

      <Select
        fullWidth
        value={firm.class}
        onChange={e => setFirm({ ...firm, class: e.target.value })}
        displayEmpty
        sx={{ mb: 2 }}
      >
        <MenuItem value="">
          <em>Tehlike Sınıfı Seçin</em>
        </MenuItem>
        <MenuItem value="Az Tehlikeli">Az Tehlikeli</MenuItem>
        <MenuItem value="Tehlikeli">Tehlikeli</MenuItem>
        <MenuItem value="Çok Tehlikeli">Çok Tehlikeli</MenuItem>
      </Select>

      <TextField label="Adres" fullWidth sx={{ mb: 2 }}
        value={firm.address}
        onChange={e => setFirm({ ...firm, address: e.target.value })}
      />
      <TextField label="Sicil No" fullWidth sx={{ mb: 2 }}
        value={firm.sicilNo}
        onChange={e => setFirm({ ...firm, sicilNo: e.target.value })}
      />
      <TextField label="Telefon No" fullWidth sx={{ mb: 2 }}
        value={firm.phone}
        onChange={e => setFirm({ ...firm, phone: e.target.value })}
      />
      <TextField label="Email" fullWidth sx={{ mb: 2 }}
        value={firm.email}
        onChange={e => setFirm({ ...firm, email: e.target.value })}
      />
      <TextField label="Yetkili Ad Soyad / Ünvan" fullWidth sx={{ mb: 2 }}
        value={firm.manager}
        onChange={e => setFirm({ ...firm, manager: e.target.value })}
      />
      <TextField label="Yetkili İSG Uzmanı" fullWidth sx={{ mb: 2 }}
        value={firm.isgExpert}
        onChange={e => setFirm({ ...firm, isgExpert: e.target.value })}
      />
      <TextField label="Yetkili İşyeri Hekimi" fullWidth sx={{ mb: 2 }}
        value={firm.doctor}
        onChange={e => setFirm({ ...firm, doctor: e.target.value })}
      />

      <Button variant="contained" sx={{ mt: 2 }} onClick={saveFirm}>
        Kaydet
      </Button>
    </Box>
  );
}

export default AddFirm;
