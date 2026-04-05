import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: any }
) {
  const { id } = await params
  try {
    const entries = await prisma.burndownEntry.findMany({
      where: { sprintId: id },
      orderBy: { dayNumber: 'asc' },
    })
    return NextResponse.json(entries)
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
    const entry = await prisma.burndownEntry.upsert({
      where: {
        id: body.entryId || 'new',
      },
      create: {
        sprintId: id,
        dayNumber: body.dayNumber,
        date: new Date(body.date),
        remainingSp: body.remainingSp,
        doneSp: body.doneSp,
        addedSp: body.addedSp || 0,
        removedSp: body.removedSp || 0,
        scopeTotal: body.scopeTotal,
      },
      update: {
        remainingSp: body.remainingSp,
        doneSp: body.doneSp,
      },
    })
    return NextResponse.json(entry, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur création' }, { status: 500 })
  }
}