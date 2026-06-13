import { Typography } from "@mui/material";
import { FOOTER_STRINGS } from "../../constants/footer.constants";

export function Footer() {
  return (
    <Typography
      variant="caption"
      color="text.disabled"
      sx={{ display: "block", textAlign: "center", mt: 2 }}
    >
      {FOOTER_STRINGS.DISCLAIMER}
    </Typography>
  );
}
