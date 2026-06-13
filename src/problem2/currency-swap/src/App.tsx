import { useMemo } from "react";
import { ThemeProvider, CssBaseline, useMediaQuery } from "@mui/material";
import { buildTheme } from "./theme/theme";
import { SwapCurrenciesPage } from "./pages/swapCurrenciesPage/SwapCurrenciesPage";

function App() {
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = useMemo(() => buildTheme(prefersDark), [prefersDark]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SwapCurrenciesPage />
    </ThemeProvider>
  );
}

export default App;
