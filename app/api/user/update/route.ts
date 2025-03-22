import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function PUT(request: Request) {
  try {
    console.log('Iniciando actualización de usuario...')
    
    const session = await getServerSession(authOptions)
    console.log('Sesión:', session?.user?.email)
    
    if (!session?.user?.email) {
      console.log('No hay sesión activa')
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    console.log('Datos recibidos:', body)

    const { nombre, apellido, telefono, fechaDeNacimiento } = body

    // Validar que los campos requeridos estén presentes
    if (!nombre || !apellido || !telefono || !fechaDeNacimiento) {
      console.log('Campos faltantes:', { nombre, apellido, telefono, fechaDeNacimiento })
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    // Validar que la fecha sea válida
    const fechaNacimiento = new Date(fechaDeNacimiento)
    if (isNaN(fechaNacimiento.getTime())) {
      console.log('Fecha de nacimiento inválida:', fechaDeNacimiento)
      return NextResponse.json(
        { error: 'La fecha de nacimiento no es válida' },
        { status: 400 }
      )
    }

    console.log('Buscando usuario en la base de datos...')
    // Buscar el usuario primero para verificar que existe
    const existingUser = await prisma.usuarios.findUnique({
      where: { email: session.user.email }
    })

    if (!existingUser) {
      console.log('Usuario no encontrado:', session.user.email)
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    console.log('Usuario encontrado, procediendo a actualizar...')
    // Actualizar el usuario
    const updatedUser = await prisma.usuarios.update({
      where: {
        email: session.user.email
      },
      data: {
        nombre,
        apellido,
        telefono,
        fechaDeNacimiento: fechaNacimiento
      }
    })

    console.log('Usuario actualizado exitosamente:', updatedUser)

    // Transformar la respuesta para el frontend
    const transformedUser = {
      nombre: updatedUser.nombre,
      apellido: updatedUser.apellido,
      email: updatedUser.email,
      telefono: updatedUser.telefono,
      fechaDeNacimiento: updatedUser.fechaDeNacimiento.toISOString()
    }

    console.log('Enviando respuesta al frontend:', transformedUser)
    return NextResponse.json(transformedUser)
  } catch (error) {
    console.error('Error detallado al actualizar usuario:', error)
    // Asegurarse de que el error sea un objeto JSON válido
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    console.error('Mensaje de error:', errorMessage)
    return NextResponse.json(
      { 
        error: 'Error al actualizar los datos del usuario',
        details: errorMessage
      },
      { status: 500 }
    )
  }
} 