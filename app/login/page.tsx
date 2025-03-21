"use client"

import { useState, useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ShoppingBag, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push("/")
    }
  }, [session, status, router])

  // Si está cargando la sesión o ya está autenticado, mostramos un estado de carga
  if (status === "loading" || status === "authenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ShoppingBag className="h-8 w-8 text-pink-600 mx-auto animate-pulse" />
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        console.log('Error de autenticación:', result.error)
        switch (result.error) {
          case "Usuario no encontrado":
            setError("No existe una cuenta con este email. Por favor, regístrate primero")
            break
          case "Contraseña incorrecta":
            setError("El email o la contraseña son incorrectos")
            break
          case "Por favor ingresa tu email y contraseña":
            setError("Por favor ingresa tu email y contraseña")
            break
          case "Por favor, verifica tu email antes de iniciar sesión":
            setError("Por favor, verifica tu email haciendo clic en el enlace que enviamos a tu correo electrónico")
            break
          default:
            setError(result.error || "Ocurrió un error al iniciar sesión. Por favor, intenta nuevamente")
        }
      } else {
        // Esperar un momento para que la sesión se actualice
        await new Promise(resolve => setTimeout(resolve, 1000))
        // Forzar una actualización de la sesión
        await router.refresh()
        // Redirigir a la página principal y forzar una recarga completa
        window.location.href = "/"
      }
    } catch (error) {
      console.error("Error durante el inicio de sesión:", error)
      setError("Ocurrió un error al iniciar sesión. Por favor, intenta nuevamente")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError("")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <ShoppingBag className="h-8 w-8 text-pink-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
          <CardDescription>
            Ingresa a tu cuenta de Elegance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className="border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                placeholder="ejemplo@correo.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-pink-600 hover:bg-pink-700 h-11"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Iniciando sesión...
                </div>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">O continúa con</span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                variant="outline"
                className="w-full border-gray-200 hover:bg-gray-50"
                onClick={async () => {
                  try {
                    console.log('Iniciando proceso de login con Google...');
                    setIsLoading(true);
                    await signIn("google", { 
                      callbackUrl: "/",
                      redirect: true
                    });
                  } catch (error) {
                    console.error('Error al iniciar sesión con Google:', error);
                    setIsLoading(false);
                  }
                }}
                disabled={isLoading}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">¿No tienes una cuenta?</span>{" "}
            <Link href="/signup" className="text-pink-600 hover:text-pink-500">
              Regístrate
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
