"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Verificando tu email...')

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token')
      
      if (!token) {
        setStatus('error')
        setMessage('No se encontró el token en la URL.')
        return
      }

      try {
        // Primero verificamos si el token existe
        const checkResponse = await fetch(`/api/auth/verify-email?token=${token}&check=true`)
        const checkData = await checkResponse.json()

        if (!checkResponse.ok) {
          setStatus('error')
          setMessage(checkData.error)
          return
        }

        // Si el token es válido, mostramos el éxito
        setStatus('success')
        setMessage('Email verificado correctamente')

        // Después de mostrar el éxito, actualizamos la base de datos
        await fetch(`/api/auth/verify-email?token=${token}&confirm=true`)

      } catch (error) {
        setStatus('error')
        setMessage('Ocurrió un error al verificar el email.')
      }
    }

    verifyEmail()
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          {status === 'loading' && (
            <div className="flex justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-pink-600" />
            </div>
          )}
          {status === 'success' && (
            <div className="flex justify-center">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
          )}
          {status === 'error' && (
            <div className="flex justify-center">
              <XCircle className="h-12 w-12 text-red-500" />
            </div>
          )}
          <CardTitle className="text-2xl font-bold">
            {status === 'loading' && 'Verificando email'}
            {status === 'success' && '¡Email verificado!'}
            {status === 'error' && 'Error de verificación'}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          {status === 'success' && (
            <>
              <p className="text-center text-gray-600">
                Tu cuenta ha sido verificada correctamente. Ahora puedes iniciar sesión.
              </p>
              <Button
                asChild
                className="w-full bg-pink-600 hover:bg-pink-700"
              >
                <Link href="/login">
                  Ir al inicio de sesión
                </Link>
              </Button>
            </>
          )}
          {status === 'error' && (
            <>
              <p className="text-center text-gray-600">
                {message}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <Button
                  asChild
                  className="w-full bg-pink-600 hover:bg-pink-700"
                >
                  <Link href="/login">
                    Ir al inicio de sesión
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full"
                >
                  <Link href="/signup">
                    Volver al registro
                  </Link>
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
