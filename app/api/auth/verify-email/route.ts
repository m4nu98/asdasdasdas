import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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

    // Buscar token de confirmación
    const tokenConfirmacion = await prisma.tokenConfirmacionEmail.findFirst({
      where: { 
        token,
        utilizado: false,
        expiresAt: {
          gt: new Date() // Verificar que no haya expirado
        }
      },
      include: {
        usuario: true
      }
    });

    console.log('API - Búsqueda por token:', tokenConfirmacion);

    // Si no se encuentra el token o ha expirado
    if (!tokenConfirmacion) {
      console.log('API - Token no encontrado o expirado');
      return NextResponse.json(
        { error: 'El enlace de verificación es inválido o ha expirado.' },
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
      // Marcar el token como utilizado
      await prisma.tokenConfirmacionEmail.update({
        where: { id: tokenConfirmacion.id },
        data: {
          utilizado: true
        }
      });

      console.log('API - Token marcado como utilizado');

      return NextResponse.json({
        message: 'Email verificado correctamente.',
        user: {
          id: tokenConfirmacion.usuario.id,
          email: tokenConfirmacion.usuario.email
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

