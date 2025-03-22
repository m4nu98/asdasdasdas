import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    // Obtener todas las propiedades del cliente Prisma
    const prismaProperties = Object.keys(prisma);
    
    // Intentar obtener los modelos de manera dinámica
    const dmmfData = (prisma as any)._dmmf?.datamodel?.models || [];
    const modelNames = dmmfData.map((model: any) => model.name);
    
    return NextResponse.json({
      prismaProperties,
      modelNames,
      prismaModels: {
        hasUsuarios: !!prisma.usuarios,
        hasTokenConfirmacionEmail: !!prisma.tokenConfirmacionEmail,
        hasDirecciones: !!(prisma as any).Direcciones,
        hasDireccionesLowercase: !!(prisma as any).direcciones,
      }
    });
  } catch (error) {
    console.error('Error al obtener propiedades de Prisma:', error);
    return NextResponse.json({ error: 'Error al inspeccionar Prisma' }, { status: 500 });
  }
} 