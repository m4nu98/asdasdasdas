import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(request: Request) {
  try {
    console.log('Iniciando obtención de datos de usuario...')
    
    const session = await getServerSession(authOptions)
    console.log('Sesión:', session?.user?.email)
    
    if (!session?.user?.email) {
      console.log('No hay sesión activa')
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    console.log('Email recibido:', email)

    if (!email) {
      console.log('No se proporcionó email')
      return NextResponse.json(
        { error: 'Email no proporcionado' },
        { status: 400 }
      )
    }

    console.log('Buscando usuario en la base de datos...')
    const user = await prisma.usuarios.findUnique({
      where: { email },
      select: {
        nombre: true,
        apellido: true,
        email: true,
        telefono: true,
        fechaDeNacimiento: true
      }
    })

    if (!user) {
      console.log('Usuario no encontrado')
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    console.log('Usuario encontrado:', user)

    // Transformar la respuesta para el frontend
    const transformedUser = {
      nombre: user.nombre || '',
      apellido: user.apellido || '',
      email: user.email,
      telefono: user.telefono || '',
      fechaDeNacimiento: user.fechaDeNacimiento ? user.fechaDeNacimiento.toISOString() : ''
    }

    console.log('Enviando respuesta al frontend:', transformedUser)
    return NextResponse.json(transformedUser)
  } catch (error) {
    console.error('Error detallado al obtener usuario:', error)
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    console.error('Mensaje de error:', errorMessage)
    return NextResponse.json(
      { 
        error: 'Error al obtener los datos del usuario',
        details: errorMessage
      },
      { status: 500 }
    )
  }
} 