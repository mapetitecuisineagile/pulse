import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const teamId = searchParams.get('teamId')

  try {
    const sprints = await prisma.sprint.findMany({
      where: teamId ? { teamId } : {},
      include: { items: true, burndown: true },
      orderBy: { startDate: 'desc' },
    })
    return NextResponse.json(sprints)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const sprint = await prisma.sprint.create({
      data: {
        teamId: body.teamId,
        label: body.label,
        quarter: body.quarter,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        status: 'planned',
        sprintGoal: body.sprintGoal || null,
        durationWeeks: body.durationWeeks || 3,
        pctBau: body.pctBau || 0.30,
        pctRisk: body.pctRisk || 0.10,
        pctCerem: body.pctCerem || 0,
        pctOther: body.pctOther || 0,
      },
    include: {
    items: true,
    burndown: true,
  },
    })
    return NextResponse.json(sprint, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur création' }, { status: 500 })
  }
}