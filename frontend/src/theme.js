import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2c3e50",   // koyu mavi-gri
    },
    secondary: {
      main: "#27ae60",   // yeşil
    },
    background: {
      default: "#f4f6f8", // açık gri arka plan
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
    h6: {
      fontWeight: 600,
    },
  },
});

export default theme;