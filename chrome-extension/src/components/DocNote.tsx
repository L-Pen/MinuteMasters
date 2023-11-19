import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

type Props = {
  content: string;
  onDelete: () => void;
};

export default function DocNote({ content, onDelete }: Props) {
  return (
    <Card
      sx={{
        minWidth: 275,
        margin: 1,
        padding: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent sx={{ p: 1 }}>
        <Typography sx={{ fontSize: 14 }} color="text.secondary">
          {content}
        </Typography>
        <Button
          variant="outlined"
          color="error"
          onClick={() => onDelete()}
          size="small"
          sx={{ textTransform: "none" }}
        >
          Delete
        </Button>
      </CardContent>
    </Card>
  );
}
