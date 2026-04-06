const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const { exec } = require("child_process");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

// ==================== Dosya Yükleme ====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// ==================== Veriler ====================
let firms = []; // {id, name}
let docs = [];  // {id, firmId, type, filename, path, startDate, endDate}

// ==================== Firma İşlemleri ====================
app.post("/firms", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).send("Firma adı gerekli");
  const newFirm = { id: Date.now().toString(), name };
  firms.push(newFirm);
  res.json(newFirm);
});

app.get("/firms", (req, res) => res.json(firms));

app.delete("/firms/:id", (req, res) => {
  const { id } = req.params;
  firms = firms.filter(f => f.id !== id);
  docs = docs.filter(d => d.firmId !== id);
  res.sendStatus(200);
});

// ==================== Belge İşlemleri ====================
app.post("/firms/:id/docs", upload.single("file"), (req, res) => {
  const { id } = req.params;
  const { type, startDate, endDate } = req.body;
  if (!req.file) return res.status(400).send("Dosya yüklenmedi");

  const newDoc = {
    id: Date.now().toString(),
    firmId: id,
    type: type || "Belirsiz",
    filename: req.file.originalname,
    path: req.file.path,
    startDate: startDate || null,
    endDate: endDate || null
  };
  docs.push(newDoc);
  res.json(newDoc);
});

app.get("/firms/:id/docs", (req, res) => {
  const firmDocs = docs.filter(d => d.firmId === req.params.id);
  res.json(firmDocs);
});

app.delete("/docs/:docId", (req, res) => {
  const { docId } = req.params;
  const doc = docs.find(d => d.id === docId);
  if (!doc) return res.status(404).send("Belge bulunamadı");

  try {
    if (fs.existsSync(doc.path)) fs.unlinkSync(doc.path);
    docs = docs.filter(d => d.id !== docId);
    res.sendStatus(200);
  } catch (err) {
    console.error("Dosya silinirken hata:", err);
    res.status(500).send("Belge silinemedi");
  }
});

// Belge açma (sunucu tarafında dosyayı işletim sisteminde açar)
app.get("/open/:docId", (req, res) => {
  const doc = docs.find(d => d.id === req.params.docId);
  if (!doc) return res.status(404).send("Belge bulunamadı");

  exec(`start "" "${path.join(__dirname, doc.path)}"`, (err) => {
    if (err) {
      console.error("Belge açılamadı:", err);
      return res.status(500).send("Belge açılamadı");
    }
    res.send("Belge açıldı");
  });
});

// ==================== React Build ====================
app.use(express.static(path.join(__dirname, "../frontend/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

// ==================== Sunucu ====================
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Sunucu çalışıyor: http://localhost:${PORT}`));
