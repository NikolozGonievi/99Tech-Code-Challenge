import { Button, CircularProgress } from "@mui/material";
import { FORM_STRINGS } from "../../constants/form.constants";

interface SubmitButtonProps {
  isSubmitting: boolean;
  disabled?: boolean;
}

export function SubmitButton({ isSubmitting, disabled }: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      fullWidth
      variant="contained"
      size="large"
      disabled={isSubmitting || disabled}
      startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
      sx={{
        mt: 3,
        py: 1.8,
        borderRadius: 3,
        fontSize: "1rem",
        fontWeight: 700,
        letterSpacing: 0.5,
        background: isSubmitting
          ? undefined
          : "linear-gradient(135deg, #aa3bff 0%, #7c22c7 100%)",
        boxShadow: isSubmitting ? "none" : "0 4px 20px rgba(170,59,255,0.35)",
        "&:hover:not(:disabled)": {
          boxShadow: "0 6px 28px rgba(170,59,255,0.5)",
        },
        transition: "all 0.2s ease",
      }}
    >
      {isSubmitting ? FORM_STRINGS.SUBMIT_LOADING : FORM_STRINGS.SUBMIT_IDLE}
    </Button>
  );
}
