import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { Prisma } from '@prisma/client'

// Asegurarnos de que TypeScript reconozca el modelo Direcciones
declare global {
  var prisma: PrismaClient & {
    Direcciones: Prisma.DireccionesDelegate<DefaultArgs>
  }
}

interface SessionUser {
  email?: string | null;
  name?: string | null;
  image?: string | null;
  id?: string;
}

interface Session {
  user?: SessionUser;
  expires: string;
}

// Obtener direcciones del usuario
export async function GET(request: Request) {
  try {
    console.log('Iniciando obtención de direcciones...')
    
    const session = await getServerSession(authOptions as any) as Session | null
    console.log('Sesión:', session?.user?.email)
    
    if (!session?.user?.email) {
      console.log('No hay sesión activa')
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Buscar usuario por email
    const usuario = await prisma.usuarios.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!usuario) {
      console.log('Usuario no encontrado')
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // @ts-ignore - El modelo existe en la base de datos
    const direcciones = await prisma.Direcciones.findMany({
      where: {
        userId: usuario.id
      },
      orderBy: {
        predeterminada: 'desc'
      }
    })

    console.log('Direcciones encontradas:', direcciones)
    return NextResponse.json(direcciones)
  } catch (error) {
    console.error('Error al obtener direcciones:', error)
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    return NextResponse.json(
      { 
        error: 'Error al obtener las direcciones',
        details: errorMessage
      },
      { status: 500 }
    )
  }
}

// Crear nueva dirección
export async function POST(request: Request) {
  try {
    console.log('Iniciando creación de dirección...')
    
    const session = await getServerSession(authOptions as any) as Session | null
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

    const { calle, numeroExterior, numeroInterior, colonia, ciudad, estado, codigoPostal, predeterminada } = body

    // Validar campos requeridos
    if (!calle || !numeroExterior || !colonia || !ciudad || !estado || !codigoPostal) {
      console.log('Campos faltantes')
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Buscar usuario por email
    const usuario = await prisma.usuarios.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!usuario) {
      console.log('Usuario no encontrado')
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Si la dirección será predeterminada, actualizar las demás direcciones
    if (predeterminada) {
      // @ts-ignore - El modelo existe en la base de datos
      await prisma.Direcciones.updateMany({
        where: {
          userId: usuario.id,
          predeterminada: true
        },
        data: {
          predeterminada: false
        }
      })
    }

    // Crear nueva dirección
    // @ts-ignore - El modelo existe en la base de datos
    const nuevaDireccion = await prisma.Direcciones.create({
      data: {
        userId: usuario.id,
        calle,
        numeroExterior,
        numeroInterior: numeroInterior || null,
        colonia,
        ciudad,
        estado,
        codigoPostal,
        predeterminada: predeterminada || false
      }
    })

    console.log('Dirección creada:', nuevaDireccion)
    return NextResponse.json(nuevaDireccion, { status: 201 })
  } catch (error) {
    console.error('Error al crear dirección:', error)
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    return NextResponse.json(
      { 
        error: 'Error al crear la dirección',
        details: errorMessage
      },
      { status: 500 }
    )
  }
}

// Eliminar dirección
export async function DELETE(request: Request) {
  try {
    console.log('Iniciando eliminación de dirección...')
    
    const session = await getServerSession(authOptions as any) as Session | null
    console.log('Sesión:', session?.user?.email)
    
    if (!session?.user?.email) {
      console.log('No hay sesión activa')
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    // Obtener el ID de la dirección de la URL
    const { searchParams } = new URL(request.url)
    const direccionId = searchParams.get('id')

    if (!direccionId) {
      console.log('ID de dirección no proporcionado')
      return NextResponse.json(
        { error: 'ID de dirección no proporcionado' },
        { status: 400 }
      )
    }

    // Buscar usuario por email
    const usuario = await prisma.usuarios.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!usuario) {
      console.log('Usuario no encontrado')
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Verificar que la dirección pertenezca al usuario
    // @ts-ignore - El modelo existe en la base de datos
    const direccion = await prisma.Direcciones.findUnique({
      where: {
        id: direccionId,
        userId: usuario.id
      }
    })

    if (!direccion) {
      console.log('Dirección no encontrada o no pertenece al usuario')
      return NextResponse.json(
        { error: 'Dirección no encontrada o no pertenece al usuario' },
        { status: 404 }
      )
    }

    // Eliminar la dirección
    // @ts-ignore - El modelo existe en la base de datos
    await prisma.Direcciones.delete({
      where: {
        id: direccionId
      }
    })

    console.log('Dirección eliminada:', direccionId)
    return NextResponse.json({ message: 'Dirección eliminada correctamente' })
  } catch (error) {
    console.error('Error al eliminar dirección:', error)
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    return NextResponse.json(
      { 
        error: 'Error al eliminar la dirección',
        details: errorMessage
      },
      { status: 500 }
    )
  }
} 