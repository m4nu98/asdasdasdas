import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/email';

// Función para generar un token de verificación único
function generateVerificationToken() {
  return crypto.randomBytes(32).toString('hex');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, birthDate, password } = body;

    if (!firstName || !lastName || !email || !phone || !birthDate || !password) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 400 }
      );
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generar token de verificación
    const verificationToken = generateVerificationToken();
    console.log('Token generado:', verificationToken); // Log para depuración

    // Crear el usuario
    const user = await prisma.user.create({
      data: {
        id: uuidv4(),
        email,
        password: hashedPassword,
        nombre: firstName,
        apellido: lastName,
        telefono: phone,
        fechaDeNacimiento: new Date(birthDate),
        verificationToken,
        emailVerified: false
      }
    });

    console.log('Usuario creado:', user); // Log para depuración

    // Enviar email de verificación
    const emailSent = await sendVerificationEmail(email, verificationToken);

    if (!emailSent) {
      console.error('Error al enviar el email de verificación');
      // No retornamos error al usuario, solo lo registramos
    }

    // Eliminar la contraseña del objeto de respuesta
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { 
        message: 'Usuario registrado exitosamente. Por favor, verifica tu email.',
        user: userWithoutPassword 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error en el registro:', error);
    return NextResponse.json(
      { error: 'Error al registrar el usuario' },
      { status: 500 }
    );
  }
}
