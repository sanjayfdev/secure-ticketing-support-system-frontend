import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

import { loginApi } from "../api/authApi";
import useAuthStore from "../store/authStore";

const LoginPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await loginApi(data);
      const {user, token} = response.data;
      debugger
      setAuth({
        user: user,
        token: token,
      });

      toast.success("Login Successful");

      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
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
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: 400,
          p: 4,
          borderRadius: 4,
        }}
      >
        <Typography variant="h4" fontWeight={700} mb={1}>
          Welcome Back
        </Typography>

        <Typography sx={{color:theme.palette.secondary}} gutterBottom>
          Login to continue
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <TextField
              label="Email"
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
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <Button type="submit" variant="contained" size="large">
              Login
            </Button>

            <Typography mt={3} textAlign="center" color={theme.palette.secondary}>
              Don't have an account?{" "}
              <Typography
                component={Link}
                to="/register"
                sx={{
                  color: theme.palette.primary,
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Register
              </Typography>
            </Typography>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginPage;
