import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { registerApi } from "../api/authApi";
import useAuthStore from "../store/authStore";

const RegisterPage = () => {
  const navigate = useNavigate();

  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await registerApi(data);

      setAuth({
        user: response.user,
        token: response.token,
      });

      toast.success("Registration Successful");

      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registration Failed"
      );
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#F5F7FB",
        p: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 450,
          p: 4,
          borderRadius: 4,
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          mb={1}
        >
          Create Account
        </Typography>

        <Typography
          color="text.secondary"
          mb={4}
        >
          Register to continue
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <TextField
              label="Full Name"
              fullWidth
              {...register("name", {
                required: "Name is required",
              })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />

            <TextField
              label="Email"
              type="email"
              fullWidth
              {...register("email", {
                required: "Email is required",
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message:
                    "Password must be at least 6 characters",
                },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                py: 1.5,
                fontWeight: 600,
              }}
            >
              Register
            </Button>
          </Stack>
        </form>

        <Typography
          mt={3}
          textAlign="center"
          color="text.secondary"
        >
          Already have an account?{" "}
          <Typography
            component={Link}
            to="/login"
            sx={{
              color: "primary.main",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Login
          </Typography>
        </Typography>
      </Paper>
    </Box>
  );
};

export default RegisterPage;