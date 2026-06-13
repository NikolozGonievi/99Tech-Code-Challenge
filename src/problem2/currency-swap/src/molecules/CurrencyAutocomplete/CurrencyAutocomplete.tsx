import {
  Autocomplete,
  Box,
  CircularProgress,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { TokenIcon } from "../../atoms/TokenIcon";
import { FORM_STRINGS } from "../../constants/form.constants";

interface CurrencyAutocompleteProps {
  label: string;
  options: string[];
  value: string;
  loading?: boolean;
  priceMap: Map<string, number>;
  error?: boolean;
  helperText?: string | false;
  disabled?: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
}

export function CurrencyAutocomplete({
  label,
  options,
  value,
  loading,
  priceMap,
  error,
  helperText,
  disabled,
  onChange,
  onBlur,
}: CurrencyAutocompleteProps) {
  return (
    <Autocomplete
      options={options}
      value={value || null}
      disabled={disabled}
      loading={loading}
      freeSolo
      onChange={(_, selected) => onChange(selected ?? "")}
      onBlur={onBlur}
      onInputChange={(_, inputValue, reason) => {
        if (reason === "input") onChange(inputValue);
      }}
      renderOption={(props, option) => (
        <Box component="li" {...props} key={option}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <TokenIcon symbol={option} size={22} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {option}
            </Typography>
          </Box>
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={FORM_STRINGS.CURRENCY_SEARCH_PLACEHOLDER}
          error={error}
          helperText={helperText}
          slotProps={{
            input: {
              ...params.slotProps.input,
              startAdornment:
                value && priceMap.has(value) ? (
                  <InputAdornment position="start">
                    <TokenIcon symbol={value} size={20} />
                  </InputAdornment>
                ) : undefined,
              endAdornment: (
                <>
                  {loading && <CircularProgress size={16} />}
                  {params.slotProps.input.endAdornment}
                </>
              ),
            },
            htmlInput: params.slotProps.htmlInput,
            inputLabel: params.slotProps.inputLabel,
          }}
        />
      )}
      sx={{ width: "100%" }}
    />
  );
}
