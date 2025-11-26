import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const registerSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirmPassword: z.string().min(1, "Confirma tu contraseña"),
  firstName: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().min(1, "El apellido es requerido"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const [, setLocation] = useLocation();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterForm) => {
      const { confirmPassword, ...registerData } = data;
      const response = await apiRequest("/api/auth/register", {
        method: "POST",
        body: registerData,
      });
      return response;
    },
    onSuccess: (data: any) => {
      setSuccess(true);
      // Store the JWT token in localStorage
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Redirect to questionnaire after short delay
      setTimeout(() => {
        setLocation("/questionnaire");
      }, 2000);
    },
    onError: (error: any) => {
      console.error("Register error:", error);
      setError(error.message || "Error al registrar la cuenta");
    },
  });

  const onSubmit = (data: RegisterForm) => {
    setError("");
    setSuccess(false);
    registerMutation.mutate(data);
  };

  if (success) {
    return (
      <div className="min-h-screen">
        <section className="seccion">
          <img src="/logo.PNG" alt="TheCookFlow" className="logo" />
          
          <div className="p-16 bg-transparent max-w-2xl mx-auto text-center">
            <CheckCircle2 className="h-24 w-24 text-chalk-green mx-auto mb-8" />
            <h1 className="text-5xl font-bold text-chalk-white mb-8">
              ¡Cuenta creada exitosamente!
            </h1>
            <p className="text-chalk text-2xl">
              Te estamos redirigiendo al cuestionario para personalizar tu experiencia...
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="seccion">
        <img src="/logo.PNG" alt="TheCookFlow" className="logo" />
        
        <h1 className="text-chalk-white mb-8 text-6xl">
          Crear Cuenta
        </h1>
        
        <p className="text-3xl text-chalk mb-12 max-w-4xl mx-auto leading-relaxed">
          Únete a TheCookFlow y transforma tu experiencia culinaria con IA
        </p>
        
        <div className="p-16 bg-transparent max-w-3xl mx-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {error && (
              <div className="p-6 bg-red-500/20 border border-red-500/50 rounded-lg mb-8">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-6 w-6 text-red-400" />
                  <p className="text-red-400 text-xl">{error}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="text-chalk font-semibold block mb-4 text-2xl">Nombre</label>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  className="w-full input-chalk text-xl p-4"
                  {...register("firstName")}
                />
                {errors.firstName && (
                  <p className="text-red-400 text-xl mt-2">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="text-chalk font-semibold block mb-4 text-2xl">Apellido</label>
                <input
                  type="text"
                  placeholder="Tu apellido"
                  className="w-full input-chalk text-xl p-4"
                  {...register("lastName")}
                />
                {errors.lastName && (
                  <p className="text-red-400 text-xl mt-2">{errors.lastName.message}</p>
                )}
              </div>
            </div>

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
                placeholder="Mínimo 6 caracteres"
                className="w-full input-chalk text-xl p-4"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-400 text-xl mt-2">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="text-chalk font-semibold block mb-4 text-2xl">Confirmar Contraseña</label>
              <input
                type="password"
                placeholder="Repite tu contraseña"
                className="w-full input-chalk text-xl p-4"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-red-400 text-xl mt-2">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full btn-red-chalk-outline text-3xl py-6 mt-12"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? "Creando cuenta..." : "Crear Cuenta"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-chalk">
              ¿Ya tienes cuenta?{" "}
              <Link href="/login" className="text-chalk-green hover:text-chalk-green/80 font-bold">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}