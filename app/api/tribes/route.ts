import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const tribes = await prisma.tribe.findMany({
      where: { isActive: true },
      include: {
        teams: {
          where: { isActive: true },
          include: { members: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(tribes)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const tribe = await prisma.tribe.create({
      data: {
        name: body.name,
        slug: body.slug,
        color: body.color || '#7b61ff',
        description: body.description,
      },
    })
    return NextResponse.json(tribe, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur création' }, { status: 500 })
  }
}