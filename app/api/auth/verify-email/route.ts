import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const isCheck = searchParams.get('check') === 'true';
    const isConfirm = searchParams.get('confirm') === 'true';

    console.log('API - Token recibido:', token);
    console.log('API - Modo:', isCheck ? 'verificación' : isConfirm ? 'confirmación' : 'desconocido');

    if (!token) {
      console.log('API - Error: Token no proporcionado');
      return NextResponse.json(
        { error: 'Token de verificación requerido' },
        { status: 400 }
      );
    }

    // Buscar usuario por token
    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        verificationToken: true,
      },
    });

    console.log('API - Búsqueda por token:', user);

    // Si no se encuentra el token
    if (!user) {
      console.log('API - Token no encontrado');
      return NextResponse.json(
        { error: 'El enlace de verificación es inválido o ha expirado.' },
        { status: 400 }
      );
    }

    // Si ya está verificado
    if (user.emailVerified) {
      console.log('API - Email ya verificado');
      return NextResponse.json(
        { error: 'Este email ya ha sido verificado anteriormente.' },
        { status: 400 }
      );
    }

    // Si solo es verificación, retornamos éxito
    if (isCheck) {
      return NextResponse.json({
        message: 'Token válido',
        valid: true
      });
    }

    // Si es confirmación, actualizamos la base de datos
    if (isConfirm) {
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: true,
          verificationToken: null,
        },
        select: {
          id: true,
          email: true,
          emailVerified: true,
        },
      });

      console.log('API - Usuario verificado exitosamente:', updatedUser);
      return NextResponse.json({
        message: 'Email verificado correctamente.',
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          emailVerified: updatedUser.emailVerified,
        },
      });
    }

    // Si no es ni check ni confirm, error
    return NextResponse.json(
      { error: 'Operación no válida' },
      { status: 400 }
    );

  } catch (error) {
    console.error('API - Error en la verificación:', error);
    return NextResponse.json(
      { error: 'Error al verificar el email. Por favor, intenta nuevamente.' },
      { status: 500 }
    );
  }
}

