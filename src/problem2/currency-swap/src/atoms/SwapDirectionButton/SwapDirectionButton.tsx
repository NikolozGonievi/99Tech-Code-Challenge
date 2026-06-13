import { IconButton } from "@mui/material";
import SwapVertIcon from "@mui/icons-material/SwapVert";

interface SwapDirectionButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function SwapDirectionButton({ onClick, disabled }: SwapDirectionButtonProps) {
  return (
    <IconButton
      onClick={onClick}
      disabled={disabled}
      size="small"
      aria-label="Swap currencies"
      sx={{
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        color: "primary.main",
        boxShadow: 1,
        width: 36,
        height: 36,
        "&:hover": {
          bgcolor: "primary.main",
          color: "white",
          borderColor: "primary.main",
        },
        transition: "all 0.2s ease",
      }}
    >
      <SwapVertIcon fontSize="small" />
    </IconButton>
  );
}
