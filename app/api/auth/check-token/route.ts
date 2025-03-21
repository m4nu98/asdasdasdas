import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    console.log('API Check Token - Token recibido:', token);

    if (!token) {
      console.log('API Check Token - Error: Token no proporcionado');
      return NextResponse.json(
        { error: 'Token de verificación requerido' },
        { status: 400 }
      );
    }

    // Buscar token de confirmación
    const tokenConfirmacion = await prisma.tokenConfirmacionEmail.findFirst({
      where: { 
        token,
        utilizado: false,
        expiresAt: {
          gt: new Date() // Verificar que no haya expirado
        }
      }
    });

    console.log('API Check Token - Estado del token:', tokenConfirmacion);

    // Si no se encuentra el token o ha expirado
    if (!tokenConfirmacion) {
      console.log('API Check Token - Token no encontrado o expirado');
      return NextResponse.json(
        { error: 'El enlace de verificación es inválido o ha expirado.' },
        { status: 400 }
      );
    }

    // Token válido y no utilizado
    return NextResponse.json({
      message: 'Token válido',
      valid: true
    });

  } catch (error) {
    console.error('API Check Token - Error en la verificación:', error);
    return NextResponse.json(
      { error: 'Error al verificar el token. Por favor, intenta nuevamente.' },
      { status: 500 }
    );
  }
} 