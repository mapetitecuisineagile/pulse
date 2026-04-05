import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: any }
) {
  const { id } = await params
  try {
    const body = await request.json()
    const item = await prisma.sprintItem.update({
      where: { id },
      data: {
        status: body.status,
        storyPoints: body.storyPoints,
        title: body.title,
      },
    })
    return NextResponse.json(item)
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
    await prisma.sprintItem.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur suppression' }, { status: 500 })
  }
}