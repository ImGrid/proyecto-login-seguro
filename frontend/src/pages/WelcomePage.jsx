import { useAuth } from "../context/AuthContext";

export default function WelcomePage() {
  const { logout } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100">
      <h1 className="text-2xl font-bold mb-4">¡Bienvenido!</h1>
      <p className="mb-4">Has iniciado sesión correctamente.</p>
      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Cerrar Sesión
      </button>
    </div>
  );
}
