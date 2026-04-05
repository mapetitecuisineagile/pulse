import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      where: { isActive: true },
      include: {
        members: true,
        tribe: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(teams)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const team = await prisma.team.create({
      data: {
        name: body.name,
        slug: body.slug,
        trigram: body.trigram,
        color: body.color || '#00d4ff',
        description: body.description,
        sprintDurationWeeks: body.sprintDurationWeeks || 3,
        pctBau: body.pctBau || 0.30,
        pctRisk: body.pctRisk || 0.10,
        pctCerem: body.pctCerem || 0,
        pctOther: body.pctOther || 0,
        predMode: body.predMode || 'sp',
        tribeId: body.tribeId || null,
      },
      include: {
        members: true,
        tribe: true,
      },
    })
    return NextResponse.json(team, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur création' }, { status: 500 })
  }
}