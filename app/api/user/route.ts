import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')

  console.log('📧 Email recibido:', email)

  if (!email) {
    console.log('❌ Email no proporcionado')
    return NextResponse.json({ error: 'Email es requerido' }, { status: 400 })
  }

  try {
    console.log('🔍 Buscando usuario con email:', email)
    
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        nombre: true,
        apellido: true,
        fechaDeNacimiento: true,
        telefono: true,
      },
    })

    console.log('📝 Datos obtenidos de la base de datos:', JSON.stringify(user, null, 2))

    if (!user) {
      console.log('❌ Usuario no encontrado para el email:', email)
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Asegurarnos de que la fecha se formatea correctamente
    const formattedUser = {
      ...user,
      fechaDeNacimiento: user.fechaDeNacimiento ? new Date(user.fechaDeNacimiento).toISOString() : null,
    }

    console.log('✅ Datos formateados a enviar:', JSON.stringify(formattedUser, null, 2))
    return NextResponse.json(formattedUser)
  } catch (error) {
    console.error('❌ Error detallado al obtener usuario:', error)
    
    return NextResponse.json(
      { 
        error: 'Error al obtener los datos del usuario',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
} 