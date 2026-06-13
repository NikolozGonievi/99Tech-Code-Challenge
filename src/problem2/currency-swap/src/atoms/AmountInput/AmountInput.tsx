import { TextField } from "@mui/material";
import { FORM_STRINGS } from "../../constants/form.constants";

interface AmountInputProps {
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onBlur: React.FocusEventHandler<HTMLInputElement>;
  error?: boolean;
  helperText?: string | false;
  disabled?: boolean;
}

export function AmountInput({
  name,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  disabled,
}: AmountInputProps) {
  return (
    <TextField
      fullWidth
      name={name}
      placeholder={FORM_STRINGS.AMOUNT_PLACEHOLDER}
      type="number"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={error}
      helperText={helperText}
      disabled={disabled}
      slotProps={{ htmlInput: { min: 0, step: "any" } }}
      sx={{
        "& .MuiOutlinedInput-root": { bgcolor: "background.paper" },
        "& input": { fontSize: "1.2rem", fontWeight: 600 },
      }}
    />
  );
}
