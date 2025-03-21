import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/email';

// Función para generar un token de verificación único
function generateVerificationToken() {
  return crypto.randomBytes(32).toString('hex');
}

export async function POST(request: Request) {
  try {
    console.log('Iniciando proceso de registro...');
    const body = await request.json();
    console.log('Datos recibidos:', body);
    
    const { nombre, apellido, email, telefono, fechaDeNacimiento, password, proveedor, id_proveedor } = body;

    // Validar campos requeridos según el proveedor
    if (proveedor === "google") {
      if (!nombre || !apellido || !email || !id_proveedor) {
        console.log('Error: Faltan campos requeridos para registro con Google');
        return NextResponse.json(
          { error: 'Los campos nombre, apellido, email y id_proveedor son requeridos para registro con Google' },
          { status: 400 }
        );
      }
    } else {
      if (!nombre || !apellido || !email || !password) {
        console.log('Error: Faltan campos requeridos para registro normal');
        return NextResponse.json(
          { error: 'Los campos nombre, apellido, email y contraseña son requeridos' },
          { status: 400 }
        );
      }
    }

    // Verificar si el usuario ya existe
    console.log('Verificando si el usuario existe...');
    const existingUser = await prisma.usuarios.findUnique({
      where: {
        email: email
      }
    });

    if (existingUser) {
      console.log('Error: El email ya está registrado');
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 400 }
      );
    }

    // Preparar datos del usuario
    console.log('Preparando datos del usuario...');
    const userData: any = {
      id: uuidv4(),
      email,
      nombre,
      apellido,
      telefono: telefono || null,
      fechaDeNacimiento: fechaDeNacimiento ? new Date(fechaDeNacimiento) : null,
      proveedor: proveedor || "email",
      id_proveedor: id_proveedor || null
    };

    // Si es registro normal, agregar contraseña hasheada
    if (proveedor !== "google") {
      console.log('Generando hash de la contraseña...');
      userData.password = await bcrypt.hash(password, 10);
    }

    let verificationToken: string | undefined;

    // Si es registro normal, crear token de confirmación
    if (proveedor !== "google") {
      console.log('Generando token de confirmación...');
      verificationToken = generateVerificationToken();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24); // Token expira en 24 horas

      userData.tokensConfirmacion = {
        create: {
          token: verificationToken,
          expiresAt: expiresAt,
          utilizado: false
        }
      };
    }

    console.log('Intentando crear usuario en la base de datos...');
    // Crear el usuario
    const user = await prisma.usuarios.create({
      data: userData
    });

    console.log('Usuario creado exitosamente:', user);

    // Enviar email de verificación solo para registro normal
    if (proveedor !== "google" && verificationToken) {
      console.log('Intentando enviar email de verificación...');
      const emailSent = await sendVerificationEmail(email, verificationToken);

      if (!emailSent) {
        console.error('Error al enviar el email de verificación');
        // No retornamos error al usuario, solo lo registramos
      } else {
        console.log('Email de verificación enviado exitosamente');
      }
    }

    // Eliminar la contraseña del objeto de respuesta
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { 
        message: proveedor === "google" 
          ? 'Usuario registrado exitosamente con Google.'
          : 'Usuario registrado exitosamente. Por favor, verifica tu email.',
        user: userWithoutPassword 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error detallado en el registro:', error);
    // Si es un error de Prisma, mostrar más detalles
    if (error.code) {
      console.error('Código de error:', error.code);
      console.error('Mensaje de error:', error.message);
    }
    return NextResponse.json(
      { 
        error: 'Error al registrar el usuario',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
