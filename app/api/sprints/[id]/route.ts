import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: any }
) {
  const { id } = await params
  try {
    const sprint = await prisma.sprint.findUnique({
      where: { id },
      include: { items: true, burndown: { orderBy: { dayNumber: 'asc' } } },
    })
    if (!sprint) return NextResponse.json({ error: 'Sprint introuvable' }, { status: 404 })
    return NextResponse.json(sprint)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: any }
) {
  const { id } = await params
  try {
    const body = await request.json()
    const sprint = await prisma.sprint.update({
      where: { id },
      data: {
        status: body.status,
        sprintGoal: body.sprintGoal,
        teamMood: body.teamMood,
      },
    })
    return NextResponse.json(sprint)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur mise à jour' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: any }
) {
  const { id } = await params
  try {
    await prisma.sprintItem.deleteMany({ where: { sprintId: id } })
    await prisma.burndownEntry.deleteMany({ where: { sprintId: id } })
    await prisma.absence.deleteMany({ where: { sprintId: id } })
    await prisma.sprint.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur suppression' }, { status: 500 })
  }
}