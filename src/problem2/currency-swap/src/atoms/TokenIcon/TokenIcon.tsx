import { useState } from "react";
import { Avatar, Box } from "@mui/material";
import { API_URLS } from "../../constants/api.constants";

interface TokenIconProps {
  symbol: string;
  size?: number;
}

export function TokenIcon({ symbol, size = 24 }: TokenIconProps) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <Avatar
        sx={{
          width: size,
          height: size,
          fontSize: size * 0.45,
          bgcolor: "primary.main",
          color: "white",
        }}
      >
        {symbol.slice(0, 2).toUpperCase()}
      </Avatar>
    );
  }

  return (
    <Box
      component="img"
      src={`${API_URLS.TOKEN_ICONS_BASE}/${symbol}.svg`}
      alt={symbol}
      width={size}
      height={size}
      sx={{ borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
      onError={() => setErrored(true)}
    />
  );
}
