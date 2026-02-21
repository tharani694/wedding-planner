import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  components: {
    MuiTextField: {
      defaultProps: {
        size: "small",
      },
    },
    MuiButton: {
      defaultProps: {
        size: "small",
      },
    },
    MuiSelect: {
      defaultProps: {
        size: "small",
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
        },
      },
      defaultProps: {
        size: "small",
      },
    },
  },
  typography: {
    h4: { fontSize: "1.5rem" },
    h5: { fontSize: "1.2rem" },
    h6: { fontSize: "1rem" },
    body1: { fontSize: "0.9rem" },
    body2: { fontSize: "0.8rem" },
  },
});
export default theme;
