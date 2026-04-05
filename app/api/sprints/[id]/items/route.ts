import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: any }
) {
  const { id } = await params
  try {
    const items = await prisma.sprintItem.findMany({
      where: { sprintId: id },
      orderBy: { createdAt: 'asc' },
    })
    return NextResponse.json(items)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: any }
) {
  const { id } = await params
  try {
    const body = await request.json()
    const item = await prisma.sprintItem.create({
      data: {
        sprintId: id,
        jiraKey: body.jiraKey || null,
        title: body.title,
        type: body.type,
        scope: body.scope,
        storyPoints: body.storyPoints || null,
        status: 'todo',
      },
    })
    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur création' }, { status: 500 })
  }
}