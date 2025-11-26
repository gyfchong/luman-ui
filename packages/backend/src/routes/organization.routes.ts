import { Router } from 'express'
import type { Database } from '../db/index.js'
import { OrganizationService } from '../services/organization.service.js'
import { authenticateJWT } from '../middleware/auth.middleware.js'
import type { AuthRequest } from '../types/index.js'
import { z } from 'zod'

const createOrgSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
})

const addMemberSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(['admin', 'member']).default('member'),
})

const updateRoleSchema = z.object({
  role: z.enum(['admin', 'member']),
})

export function createOrganizationRoutes(db: Database) {
  const router = Router()
  const orgService = new OrganizationService(db)

  // All routes require authentication
  router.use(authenticateJWT(db))

  /**
   * GET /organizations - Get user's organizations
   */
  router.get('/', async (req, res) => {
    try {
      const user = (req as AuthRequest).user!
      const organizations = await orgService.getUserOrganizations(user.id)
      res.json({ organizations })
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch organizations' })
    }
  })

  /**
   * POST /organizations - Create organization
   */
  router.post('/', async (req, res) => {
    try {
      const user = (req as AuthRequest).user!
      const body = createOrgSchema.parse(req.body)

      // Check if slug already exists
      const existing = await orgService.getOrganizationBySlug(body.slug)
      if (existing) {
        return res.status(400).json({ error: 'Organization slug already taken' })
      }

      const org = await orgService.createOrganization(
        body.name,
        body.slug,
        user.id
      )

      res.json({ organization: org })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid request', details: error.errors })
      }
      res.status(500).json({ error: 'Failed to create organization' })
    }
  })

  /**
   * GET /organizations/:slug - Get organization by slug
   */
  router.get('/:slug', async (req, res) => {
    try {
      const user = (req as AuthRequest).user!
      const { slug } = req.params

      const org = await orgService.getOrganizationBySlug(slug)
      if (!org) {
        return res.status(404).json({ error: 'Organization not found' })
      }

      // Check if user is a member
      const isMember = await orgService.isMember(org.id, user.id)
      if (!isMember) {
        return res.status(403).json({ error: 'Access denied' })
      }

      res.json({ organization: org })
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch organization' })
    }
  })

  /**
   * GET /organizations/:slug/members - Get organization members
   */
  router.get('/:slug/members', async (req, res) => {
    try {
      const user = (req as AuthRequest).user!
      const { slug } = req.params

      const org = await orgService.getOrganizationBySlug(slug)
      if (!org) {
        return res.status(404).json({ error: 'Organization not found' })
      }

      // Check if user is a member
      const isMember = await orgService.isMember(org.id, user.id)
      if (!isMember) {
        return res.status(403).json({ error: 'Access denied' })
      }

      const members = await orgService.getMembers(org.id)
      res.json({ members })
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch members' })
    }
  })

  /**
   * POST /organizations/:slug/members - Add member to organization
   */
  router.post('/:slug/members', async (req, res) => {
    try {
      const user = (req as AuthRequest).user!
      const { slug } = req.params
      const body = addMemberSchema.parse(req.body)

      const org = await orgService.getOrganizationBySlug(slug)
      if (!org) {
        return res.status(404).json({ error: 'Organization not found' })
      }

      // Check if user is admin or owner
      const members = await orgService.getMembers(org.id)
      const userMember = members.find((m) => m.userId === user.id)
      if (!userMember || (userMember.role !== 'admin' && userMember.role !== 'owner')) {
        return res.status(403).json({ error: 'Access denied' })
      }

      const member = await orgService.addMember(org.id, body.userId, body.role)
      res.json({ member })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid request', details: error.errors })
      }
      res.status(500).json({ error: 'Failed to add member' })
    }
  })

  /**
   * DELETE /organizations/:slug/members/:userId - Remove member
   */
  router.delete('/:slug/members/:userId', async (req, res) => {
    try {
      const user = (req as AuthRequest).user!
      const { slug, userId } = req.params

      const org = await orgService.getOrganizationBySlug(slug)
      if (!org) {
        return res.status(404).json({ error: 'Organization not found' })
      }

      // Check if user is admin or owner
      const members = await orgService.getMembers(org.id)
      const userMember = members.find((m) => m.userId === user.id)
      if (!userMember || (userMember.role !== 'admin' && userMember.role !== 'owner')) {
        return res.status(403).json({ error: 'Access denied' })
      }

      // Cannot remove owner
      const targetMember = members.find((m) => m.userId === userId)
      if (targetMember?.role === 'owner') {
        return res.status(400).json({ error: 'Cannot remove organization owner' })
      }

      await orgService.removeMember(org.id, userId)
      res.json({ success: true })
    } catch (error) {
      res.status(500).json({ error: 'Failed to remove member' })
    }
  })

  /**
   * PATCH /organizations/:slug/members/:userId - Update member role
   */
  router.patch('/:slug/members/:userId', async (req, res) => {
    try {
      const user = (req as AuthRequest).user!
      const { slug, userId } = req.params
      const body = updateRoleSchema.parse(req.body)

      const org = await orgService.getOrganizationBySlug(slug)
      if (!org) {
        return res.status(404).json({ error: 'Organization not found' })
      }

      // Check if user is admin or owner
      const members = await orgService.getMembers(org.id)
      const userMember = members.find((m) => m.userId === user.id)
      if (!userMember || (userMember.role !== 'admin' && userMember.role !== 'owner')) {
        return res.status(403).json({ error: 'Access denied' })
      }

      // Cannot change owner role
      const targetMember = members.find((m) => m.userId === userId)
      if (targetMember?.role === 'owner') {
        return res.status(400).json({ error: 'Cannot change owner role' })
      }

      await orgService.updateMemberRole(org.id, userId, body.role)
      res.json({ success: true })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid request', details: error.errors })
      }
      res.status(500).json({ error: 'Failed to update member role' })
    }
  })

  return router
}
