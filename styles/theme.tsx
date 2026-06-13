import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  direction: "rtl",
  palette: {
    primary: { main: "#143A62" },
    secondary: { main: "#00B6FF" },
    background: { default: "#248f34ff" },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
  shape: {
    borderRadius: 8,
  },
});

export default theme;
