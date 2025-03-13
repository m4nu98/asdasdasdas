"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    birthDate: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          birthDate: formData.birthDate,
          password: formData.password,
        }),
      })

      if (!response.ok) {
        throw new Error('Error al crear la cuenta')
      }

      window.location.href = '/login'
    } catch (error) {
      setError('Error al crear la cuenta. Por favor, inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-4xl">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <ShoppingBag className="h-8 w-8 text-pink-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Crear una cuenta en Elegance</CardTitle>
          <CardDescription className="text-gray-600">
            Únete a nuestra exclusiva comunidad de amantes de la moda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Ingresa tu nombre"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Apellido
                </label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Ingresa tu apellido"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="nombre@ejemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Teléfono
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+54 (123) 456-7890"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                  Fecha de Nacimiento
                </label>
                <Input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                />
              </div>

              <div className="hidden md:block"></div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirmar Contraseña
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                />
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <Button 
                type="submit" 
                className="w-full md:w-auto md:min-w-[200px] bg-pink-600 hover:bg-pink-700"
                disabled={isLoading}
              >
                {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">O regístrate con</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
              <Button 
                variant="outline" 
                className="w-full sm:w-auto sm:min-w-[200px] border-gray-200 hover:bg-gray-50"
                onClick={() => {}}
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
              <Button 
                variant="outline" 
                className="w-full sm:w-auto sm:min-w-[200px] border-gray-200 hover:bg-gray-50"
                onClick={() => {}}
                disabled={isLoading}
              >
                <svg className="mr-2 h-4 w-4" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
                </svg>
                Facebook
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">¿Ya tienes una cuenta?</span>{" "}
            <Link href="/login" className="text-pink-600 hover:text-pink-500">
              Iniciar Sesión
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}