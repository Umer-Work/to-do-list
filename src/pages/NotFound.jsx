import { Box, Typography } from "@mui/material";

const NotFound = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f8d7da",
      }}
    >
      <Typography variant="h3" color="error">
        404 - Page Not Found
      </Typography>
      <Typography variant="h6" color="textSecondary">
        Sorry, the page you are looking for does not exist.
      </Typography>
    </Box>
  );
};

export default NotFound;
