import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import {
  Typography,
  CircularProgress,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
  Box,
} from "@mui/material";

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categoryType, setCategoryType] = useState("image");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await API.get(`/users/profile/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUser(data);
        localStorage.setItem("userType", user?.userType);
        setError("");
      } catch (error) {
        console.error(
          "Error fetching user profile:",
          error.response ? error.response.data.message : error.message
        );
        setError(
          error.response
            ? error.response.data.message
            : "Error fetching user profile"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const handleCategorySubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await API.post(
        "/categories/create",
        { name: categoryName, type: categoryType },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log("Category created:", response.data);
      alert("Category created successfully");
      setCategoryName("");
      setCategoryType("image");
    } catch (error) {
      console.error(
        "Error creating category:",
        error.response
          ? error.response.data.message
          : "Failed to create category"
      );
      alert(
        error.response
          ? error.response.data.message
          : "Failed to create category"
      );
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>
      {user && (
        <>
          <Typography variant="subtitle1">
            <strong>Username:</strong> {user.username}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Email:</strong> {user.email}
          </Typography>
          <Typography variant="subtitle1">
            <strong>User Type:</strong> {user.userType}
          </Typography>

          {user.userType === "admin" && (
            <Box
              component="form"
              onSubmit={handleCategorySubmit}
              sx={{ mt: 3 }}
            >
              <TextField
                fullWidth
                label="Category Name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
              />
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Type</InputLabel>
                <Select
                  value={categoryType}
                  label="Type"
                  onChange={(e) => setCategoryType(e.target.value)}
                  required
                >
                  <MenuItem value="image">Image</MenuItem>
                  <MenuItem value="video">Video</MenuItem>
                  <MenuItem value="document">Document</MenuItem>
                </Select>
              </FormControl>
              <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                Create Category
              </Button>
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default UserProfile;
