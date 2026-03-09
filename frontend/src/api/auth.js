import api from "./client";

export async function login(email, password) {
  const form = new URLSearchParams();
  form.set("username", email);
  form.set("password", password);

  const res = await api.post("/users/login", form, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return res.data; // { access_token, token_type }
}

export async function register(email, password) {
  const res = await api.post("/users/register", { email, password });
  return res.data;
}
