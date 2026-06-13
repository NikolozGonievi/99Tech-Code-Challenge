import { Box, Card, CardContent } from "@mui/material";
import { Header } from "../../organisms/Header";
import { Footer } from "../../organisms/Footer";
import { SwapCurrenciesForm } from "../../organisms/SwapCurrenciesForm";

export function SwapCurrenciesPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 4,
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "radial-gradient(ellipse at 50% 0%, rgba(170,59,255,0.15) 0%, transparent 60%), #0f1117"
            : "radial-gradient(ellipse at 50% 0%, rgba(170,59,255,0.08) 0%, transparent 60%), #f0f0f5",
      }}
    >
      <Box
        sx={{ width: "100%", minWidth: { sm: 560, md: 680 }, maxWidth: 800 }}
      >
        <Header />

        <Card
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? "0 8px 32px rgba(0,0,0,0.4)"
                : "0 8px 32px rgba(0,0,0,0.08)",
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <SwapCurrenciesForm />
          </CardContent>
        </Card>

        <Footer />
      </Box>
    </Box>
  );
}
