import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const data = await request.json()
    
    const updatedUser = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        nombre: data.nombre,
        apellido: data.apellido,
        telefono: data.telefono,
        fechaDeNacimiento: new Date(data.fechaDeNacimiento),
      },
    })

    return NextResponse.json({
      message: 'Usuario actualizado correctamente',
      user: updatedUser,
    })
  } catch (error) {
    console.error('Error al actualizar usuario:', error)
    return NextResponse.json(
      { error: 'Error al actualizar los datos del usuario' },
      { status: 500 }
    )
  }
} 