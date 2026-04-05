import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const teamId = searchParams.get('teamId')

  try {
    const members = await prisma.member.findMany({
      where: teamId ? { teamId } : {},
      orderBy: { firstName: 'asc' },
    })
    return NextResponse.json(members)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const member = await prisma.member.create({
      data: {
        teamId: body.teamId,
        firstName: body.firstName,
        lastName: body.lastName,
        role: body.role,
        fte: body.fte || 1.0,
        countsInCapacity: body.countsInCapacity ?? true,
        status: 'active',
      },
    })
    return NextResponse.json(member, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur création' }, { status: 500 })
  }
}