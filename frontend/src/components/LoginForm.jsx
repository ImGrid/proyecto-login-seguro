import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { sanitizeInput, validateEmail } from "../utils/validation";

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    setForm({ ...form, [name]: sanitizedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validaciones mejoradas frontend
    if (!form.email.trim() || !form.password.trim()) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (!validateEmail(form.email)) {
      setError("Por favor ingresa un email válido");
      return;
    }

    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/api/login", {
        email: form.email.toLowerCase().trim(),
        password: form.password,
      });

      if (res.data.success && res.data.data?.token) {
        // Guardar token
        localStorage.setItem("token", res.data.data.token);
        // Guardar usuario
        localStorage.setItem("user", JSON.stringify(res.data.data.user));

        login(res.data.data.token);
      } else {
        throw new Error(res.data.message || "Error desconocido");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Error al iniciar sesión. Intente nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-auto bg-gradient-to-br from-blue-50 to-green-50">
      <div className="w-full max-w-md p-8 my-8 bg-white rounded-lg shadow-xl">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-3xl font-bold text-gray-800">
            Iniciar Sesión
          </h2>
          <p className="text-gray-600">Bienvenido de vuelta</p>
        </div>

        {error && (
          <div className="p-3 mb-6 border border-red-200 rounded-lg bg-red-50">
            <p className="text-sm text-center text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              placeholder="tu@email.com"
              value={form.email}
              onChange={handleChange}
              maxLength="254"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              maxLength="128"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-medium transition ${
              loading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? "Iniciando..." : "Iniciar Sesión"}
          </button>

          <div className="text-center">
            <span className="text-gray-600">¿No tienes cuenta? </span>
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              Crear cuenta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
