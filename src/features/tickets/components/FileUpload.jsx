import { Box, FormHelperText, Typography } from "@mui/material";
import {
  AttachFileRounded,
  CloseRounded,
  InsertDriveFileRounded,
} from "@mui/icons-material";
import { useRef } from "react";
import { useController } from "react-hook-form";
import FieldLabel from "./FieldLabel";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const FileUpload = ({ control }) => {
  const fileInputRef = useRef(null);

  const {
    field: { value: file, onChange },
    fieldState: { error },
  } = useController({ name: "attachment", control });

  const handleFile = (f) => {
    if (!f) return;
    onChange(f); // zod validates size
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <Box>
      <FieldLabel text="Attachment" subtitle="(optional)" />

      <Box
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        sx={{
          border: `2px dashed ${error ? "#ef4444" : "rgba(108,76,241,0.25)"}`,
          borderRadius: "12px",
          p: 2.5,
          textAlign: "center",
          cursor: "pointer",
          bgcolor: "#faf9ff",
          transition: "all 0.2s",
          "&:hover": { borderColor: "#6C4CF1", bgcolor: "#f5f3ff" },
        }}
      >
        {file ? (
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "8px",
                bgcolor: "#ede9fe",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <InsertDriveFileRounded sx={{ fontSize: 20, color: "#6C4CF1" }} />
            </Box>
            <Box sx={{ textAlign: "left" }}>
              <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: "#111827" }}>
                {file.name}
              </Typography>
              <Typography sx={{ fontSize: "0.7rem", color: "#9ca3af" }}>
                {(file.size / 1024).toFixed(1)} KB
              </Typography>
            </Box>
            <Box
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
              sx={{
                ml: 1,
                cursor: "pointer",
                color: "#9ca3af",
                display: "flex",
                "&:hover": { color: "#ef4444" },
              }}
            >
              <CloseRounded sx={{ fontSize: 18 }} />
            </Box>
          </Box>
        ) : (
          <>
            <AttachFileRounded sx={{ fontSize: 28, color: "#c4b5fd", mb: 1 }} />
            <Typography sx={{ fontSize: "0.82rem", fontWeight: 500, color: "#6C4CF1" }}>
              Click to upload or drag & drop
            </Typography>
            <Typography sx={{ fontSize: "0.7rem", color: "#9ca3af", mt: 0.5 }}>
              Max file size: 5MB
            </Typography>
          </>
        )}
      </Box>

      {error && (
        <FormHelperText error sx={{ ml: 1.5, mt: 0.5 }}>
          {error.message}
        </FormHelperText>
      )}

      <input
        ref={fileInputRef}
        type="file"
        hidden
        accept="image/*,.pdf,.doc,.docx,.txt"
        onChange={(e) => handleFile(e.target.files[0])}
      />
    </Box>
  );
};

export default FileUpload;