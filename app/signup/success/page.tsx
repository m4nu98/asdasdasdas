"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Mail, ShoppingBag, ArrowRight } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-pink-100 rounded-full animate-ping"></div>
              <div className="relative bg-pink-600 rounded-full p-4">
                <Mail className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">
            ¡Bienvenido a Elegance!
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Tu cuenta ha sido creada exitosamente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Verifica tu correo electrónico
            </h3>
            <p className="text-blue-700">
              Hemos enviado un enlace de verificación a tu correo electrónico. 
              Por favor, revisa tu bandeja de entrada y sigue las instrucciones 
              para activar tu cuenta.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              ¿No recibiste el correo?
            </h3>
            <p className="text-gray-600">
              Revisa tu carpeta de spam o solicita un nuevo enlace de verificación.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              className="w-full bg-pink-600 hover:bg-pink-700"
            >
              <Link href="/login" className="flex items-center justify-center gap-2">
                Ir al inicio de sesión
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full"
            >
              <Link href="/" className="flex items-center justify-center gap-2">
                Volver al inicio
                <ShoppingBag className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>
              ¿Necesitas ayuda?{" "}
              <Link href="/contact" className="text-pink-600 hover:text-pink-500">
                Contáctanos
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 