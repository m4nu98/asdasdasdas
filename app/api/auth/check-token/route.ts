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

    // Solo verificar si existe el token y el estado del usuario
    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
      select: {
        emailVerified: true,
      },
    });

    console.log('API Check Token - Estado del token:', user);

    // Si no se encuentra el token
    if (!user) {
      console.log('API Check Token - Token no encontrado');
      return NextResponse.json(
        { error: 'El enlace de verificación es inválido o ha expirado.' },
        { status: 400 }
      );
    }

    // Si el usuario ya está verificado
    if (user.emailVerified) {
      console.log('API Check Token - Email ya verificado');
      return NextResponse.json(
        { error: 'Este email ya ha sido verificado anteriormente.' },
        { status: 400 }
      );
    }

    // Token válido y no verificado
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