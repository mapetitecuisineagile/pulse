import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      where: { isActive: true },
      include: {
        members: { where: { status: 'active', countsInCapacity: true } },
        sprints: {
          orderBy: { startDate: 'desc' },
          take: 8,
          include: {
            items: true,
            burndown: { orderBy: { dayNumber: 'asc' } },
          },
        },
      },
    })

    const dashboardData = teams.map(team => {
      const sprints = team.sprints
      const sprintEnCours = sprints.find(s => s.status === 'active')
      const sprintsTermines = sprints.filter(s => s.status === 'done')

      const sprintsAvecMetriques = sprintsTermines.map(sprint => {
        const targetSP = sprint.items
          .filter(i => !i.isAdded)
          .reduce((acc, i) => acc + (i.storyPoints || 0), 0)
        const addSP = sprint.items
          .filter(i => i.isAdded)
          .reduce((acc, i) => acc + (i.storyPoints || 0), 0)
        const doneSP = sprint.burndown.length > 0
          ? (sprint.burndown[0].scopeTotal || 0) - (sprint.burndown[sprint.burndown.length-1].remainingSp || 0)
          : 0
        const totalSP = targetSP + addSP
        const pred = totalSP > 0 ? Math.round(doneSP / totalSP * 100) : 0
        const nbJours = Math.round((new Date(sprint.endDate).getTime() - new Date(sprint.startDate).getTime()) / (1000 * 60 * 60 * 24 * 7)) * 5
        const capaNette = team.members.reduce((acc, m) => acc + nbJours * m.fte, 0)
        const focusFactor = capaNette > 0 ? Math.round(doneSP / capaNette * 100) / 100 : 0
        return { sprint, targetSP, addSP, doneSP, totalSP, pred, capaNette, focusFactor }
      })

      const ffMoyen = sprintsAvecMetriques.length > 0
        ? Math.round(sprintsAvecMetriques.reduce((acc, s) => acc + s.focusFactor, 0) / sprintsAvecMetriques.length * 100) / 100
        : 0

      const predMoyenne = sprintsAvecMetriques.length > 0
        ? Math.round(sprintsAvecMetriques.reduce((acc, s) => acc + s.pred, 0) / sprintsAvecMetriques.length)
        : null

      let sprintEnCoursData = null
      if (sprintEnCours) {
        const scopeTotal = sprintEnCours.items.reduce((acc, i) => acc + (i.storyPoints || 0), 0)
        const dernierBurndown = sprintEnCours.burndown[sprintEnCours.burndown.length - 1]
        const spRestants = dernierBurndown?.remainingSp ?? scopeTotal
        const spDone = scopeTotal - spRestants
        const pct = scopeTotal > 0 ? Math.round(spDone / scopeTotal * 100) : 0
        const jourCourant = sprintEnCours.burndown.length
        sprintEnCoursData = {
          id: sprintEnCours.id,
          label: sprintEnCours.label,
          quarter: sprintEnCours.quarter,
          scopeTotal,
          spRestants,
          spDone,
          pct,
          jourCourant,
          nbItems: sprintEnCours.items.length,
        }
      }

      return {
        team: { id: team.id, name: team.name, slug: team.slug, trigram: team.trigram },
        sprintEnCours: sprintEnCoursData,
        sprintsTermines: sprintsAvecMetriques,
        ffMoyen,
        predMoyenne,
      }
    })

    return NextResponse.json(dashboardData)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}