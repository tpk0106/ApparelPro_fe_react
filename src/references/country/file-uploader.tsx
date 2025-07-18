import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { useRef } from "react";

export default function FileInlnput() {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <TextField
      type="file"
      inputRef={inputRef}
      slotProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Button
              variant="outlined"
              size="small"
              onClick={(e) =>
                inputRef.current?.dispatchEvent(
                  new MouseEvent("click", {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    buttons: 1,
                  })
                )
              }
            >
              Choose File
            </Button>
          </InputAdornment>
        ),
      }}
      sx={{
        "& input::file-selector-button": {
          display: "none",
        },
      }}
    />
  );
}
