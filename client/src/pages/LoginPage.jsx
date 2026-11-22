
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import apiClient from "../services/apiClient.js";
import { useAuth } from "../auth/AuthContext.jsx";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { dispatch } = useAuth();

  const loginMutation = useMutation({
  mutationFn: (credentials) =>
    apiClient
      .post("/auth/login", credentials)
      .then((res) => res.data),

  onSuccess: (data) => {
    console.log("LOGIN SUCCESS:", data);

    dispatch({
      type: "LOGIN",
      payload: {
        user: data.user,
        accessToken: data.accessToken,
      },
    });
  },

  onError: (error) => {
    console.error("LOGIN ERROR:", error.response?.data);
  },
});

  function handleSubmit(e) {
    e.preventDefault();

    loginMutation.mutate({
      email,
      password,
    });
  }

  return (
    <form className="login" onSubmit={handleSubmit}>
      <h2>Log in</h2>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="ada@threadbase.dev"
        required
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="password"
        required
      />

      <button
        type="submit"
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? "Logging in..." : "Login"}
      </button>

      {loginMutation.isError && (
        <p style={{ color: "red" }}>
          Login failed. Please check your credentials or server.
        </p>
      )}

      {loginMutation.isSuccess && (
        <p style={{ color: "green" }}>
          Login successful!
        </p>
      )}
    </form>
  );
}
