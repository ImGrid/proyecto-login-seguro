import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  sanitizeInput,
  validateEmail,
  validatePassword,
  validateName,
} from "../utils/validation";

export default function RegisterForm() {
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
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
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (!validateName(form.name)) {
      setError(
        "El nombre solo puede contener letras y espacios (2-50 caracteres)"
      );
      return;
    }

    if (!validateEmail(form.email)) {
      setError("Por favor ingresa un email válido");
      return;
    }

    if (!validatePassword(form.password)) {
      setError("La contraseña debe tener entre 6 y 128 caracteres");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/api/register", {
        name: form.name.trim(),
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
          "Error al registrarse. Intente nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-auto bg-gradient-to-br from-blue-50 to-green-50">
      <div className="w-full max-w-md p-8 my-8 bg-white rounded-lg shadow-xl">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-3xl font-bold text-gray-800">
            Crear Cuenta
          </h2>
          <p className="text-gray-600">Únete a nuestra plataforma</p>
        </div>

        {error && (
          <div className="p-3 mb-6 border border-red-200 rounded-lg bg-red-50">
            <p className="text-sm text-center text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Nombre completo
            </label>
            <input
              type="text"
              name="name"
              placeholder="Tu nombre completo"
              value={form.name}
              onChange={handleChange}
              maxLength="50"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              autoComplete="name"
            />
          </div>

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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
              placeholder="Mínimo 6 caracteres"
              value={form.password}
              onChange={handleChange}
              maxLength="128"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-medium transition ${
              loading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {loading ? "Registrando..." : "Crear Cuenta"}
          </button>

          <div className="text-center">
            <span className="text-gray-600">¿Ya tienes cuenta? </span>
            <button
              type="button"
              onClick={() => (window.location.href = "/login")}
              className="font-medium text-green-600 hover:text-green-700"
            >
              Iniciar sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
