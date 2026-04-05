import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: any }
) {
  const { slug } = await params
  try {
    const team = await prisma.team.findUnique({
      where: { slug },
      include: { members: true, tribe: true },
    })
    if (!team) return NextResponse.json({ error: 'Équipe introuvable' }, { status: 404 })
    return NextResponse.json(team)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: any }
) {
  const { slug } = await params
  try {
    const body = await request.json()
    const team = await prisma.team.update({
      where: { slug },
      data: {
        name: body.name,
        trigram: body.trigram,
        color: body.color,
        description: body.description,
        sprintDurationWeeks: body.sprintDurationWeeks,
        pctBau: body.pctBau,
        pctRisk: body.pctRisk,
        pctCerem: body.pctCerem,
        pctOther: body.pctOther,
        predMode: body.predMode,
      },
    })
    return NextResponse.json(team)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur mise à jour' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: any }
) {
  const { slug } = await params
  try {
    const team = await prisma.team.findUnique({ where: { slug } })
    if (!team) return NextResponse.json({ error: 'Équipe introuvable' }, { status: 404 })
    await prisma.team.update({
      where: { slug },
      data: { isActive: false }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur suppression' }, { status: 500 })
  }
}