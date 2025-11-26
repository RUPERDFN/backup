import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { AlertCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import SEO from "@/components/SEO";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const [error, setError] = useState<string>("");
  const { refreshAuth } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const response = await apiRequest("/api/auth/login", {
        method: "POST",
        body: data,
      });
      return response;
    },
    onSuccess: (data: any) => {
      // Store the JWT token in localStorage
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Force navigation to questionnaire
      window.location.href = "/questionnaire";
    },
    onError: (error: any) => {
      console.error("Login error:", error);
      setError(error.message || "Error al iniciar sesión");
    },
  });

  const onSubmit = (data: LoginForm) => {
    setError("");
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen">
      <SEO 
        title="Iniciar Sesión - TheCookFlow"
        description="Accede a tu cuenta de TheCookFlow y continúa planificando menús semanales con inteligencia artificial."
        keywords="login TheCookFlow, iniciar sesión planificador menús, acceso cuenta TheCookFlow"
      />
      <section className="seccion">
        <img src="/logo.PNG" alt="TheCookFlow - Planificador de menús inteligente" className="logo" />
        
        <h1 className="text-chalk-white mb-8 text-6xl">
          Iniciar Sesión
        </h1>
        
        <p className="text-3xl text-chalk mb-12 max-w-4xl mx-auto leading-relaxed">
          Accede a tu cuenta de TheCookFlow y continúa creando menús increíbles
        </p>
        
        <div className="p-16 bg-transparent max-w-3xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            {error && (
              <div className="p-6 bg-red-500/20 border border-red-500/50 rounded-lg mb-8">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-6 w-6 text-red-400" />
                  <p className="text-red-400 text-xl">{error}</p>
                </div>
              </div>
            )}

            <div className="space-y-8">
              <div>
                <label className="text-chalk font-semibold block mb-4 text-2xl">Email</label>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="w-full input-chalk text-xl p-4"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-400 text-xl mt-2">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="text-chalk font-semibold block mb-4 text-2xl">Contraseña</label>
                <input
                  type="password"
                  placeholder="Tu contraseña"
                  className="w-full input-chalk text-xl p-4"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-red-400 text-xl mt-2">{errors.password.message}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-primary-chalk text-3xl py-6 mt-12"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-chalk text-2xl">
              ¿No tienes cuenta?{" "}
              <Link href="/register" className="text-chalk-green hover:text-chalk-green/80 font-bold text-2xl">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}