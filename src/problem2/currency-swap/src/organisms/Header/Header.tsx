import { Box, Typography } from "@mui/material";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import { HEADER_STRINGS } from "../../constants/header.constants";

export function Header() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1.5,
        mb: 3,
      }}
    >
      <CurrencyExchangeIcon sx={{ color: "primary.main", fontSize: 28 }} />
      <Typography
        variant="h5"
        sx={{ fontWeight: 700, letterSpacing: "-0.5px" }}
        color="text.primary"
      >
        {HEADER_STRINGS.TITLE}
      </Typography>
    </Box>
  );
}
