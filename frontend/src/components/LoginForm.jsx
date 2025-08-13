import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function LoginForm() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password.trim()) {
      setError("Todos los campos son obligatorios");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:4000/api/login", {
        email: form.email,
        password: form.password,
      });

      if (res.data.success && res.data.data?.token) {
        // Guardar token
        localStorage.setItem("token", res.data.data.token);
        // Guardar usuario (opcional)
        localStorage.setItem("user", JSON.stringify(res.data.data.user));

        login(res.data.data.token);
      } else {
        throw new Error(res.data.message || "Error desconocido");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Error al iniciar sesión. Intente nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center p-4"
      style={{
        backgroundImage:
          "url('https://getwallpapers.com/wallpaper/full/b/7/8/1482555-beautiful-4k-wallpaper-nature-3840x2160-full-hd.jpg')",
      }}
    >
      <div className="bg-white/90 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-sm sm:max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Iniciar Sesión
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg transition ${
              loading
                ? "bg-gray-400 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {loading ? "Iniciando..." : "Iniciar Sesión"}
          </button>

          <button
            type="button"
            onClick={() => alert("Redirigir a registro")}
            className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg transition"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}
