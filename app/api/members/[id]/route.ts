import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: any }
) {
  const { id } = await params
  try {
    const body = await request.json()
    const member = await prisma.member.update({
      where: { id },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        role: body.role,
        fte: body.fte,
        countsInCapacity: body.countsInCapacity,
      },
    })
    return NextResponse.json(member)
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
    const member = await prisma.member.update({
      where: { id },
      data: { status: 'inactive' },
    })
    return NextResponse.json(member)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur désactivation' }, { status: 500 })
  }
}