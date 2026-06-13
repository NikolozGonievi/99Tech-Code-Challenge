import { createTheme } from "@mui/material";

export function buildTheme(prefersDark: boolean) {
  return createTheme({
    palette: {
      mode: prefersDark ? "dark" : "light",
      primary: {
        main: "#aa3bff",
        light: "#c084fc",
        dark: "#7c22c7",
      },
      background: {
        default: prefersDark ? "#0f1117" : "#f5f5f7",
        paper: prefersDark ? "#16171d" : "#ffffff",
      },
    },
    shape: {
      borderRadius: 16,
    },
    typography: {
      fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif",
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 600,
            letterSpacing: 0.5,
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiAutocomplete: {
        styleOverrides: {
          paper: {
            borderRadius: 12,
          },
        },
      },
    },
  });
}
