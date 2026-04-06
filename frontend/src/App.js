import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";
import FirmPanel from "./FirmPanel";
import Reports from "./Reports";
import AddFirm from "./AddFirm"; // yeni firma ekleme sayfası

function App() {
  return (
    <Router>
      <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            İSG Panel
          </Typography>
          <Button color="inherit" component={Link} to="/firms">
            Firmalar
          </Button>
          <Button color="inherit" component={Link} to="/reports">
            Raporlar
          </Button>
          <Button color="inherit" component={Link} to="/add-firm">
            Firma Ekle
          </Button>
        </Toolbar>
      </AppBar>

      <Box p={2}>
        <Routes>
          <Route path="/" element={<FirmPanel />} />
          <Route path="/firms" element={<FirmPanel />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/add-firm" element={<AddFirm />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
