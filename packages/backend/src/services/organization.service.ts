import { eq, and } from 'drizzle-orm'
import type { Database } from '../db/index.js'
import { organizations, organizationMembers } from '../db/schema.js'
import type { Organization, OrganizationMember } from '../types/index.js'

export class OrganizationService {
  constructor(private db: Database) {}

  /**
   * Create a new organization
   */
  async createOrganization(
    name: string,
    slug: string,
    ownerId: string
  ): Promise<Organization> {
    const [org] = await this.db
      .insert(organizations)
      .values({
        name,
        slug,
        ownerId,
      })
      .returning()

    // Add owner as member
    await this.db.insert(organizationMembers).values({
      organizationId: org.id,
      userId: ownerId,
      role: 'owner',
    })

    return {
      id: org.id,
      name: org.name,
      slug: org.slug,
      ownerId: org.ownerId,
      createdAt: new Date(org.createdAt),
      updatedAt: new Date(org.updatedAt),
    }
  }

  /**
   * Get organization by ID
   */
  async getOrganizationById(orgId: string): Promise<Organization | null> {
    const [org] = await this.db
      .select()
      .from(organizations)
      .where(eq(organizations.id, orgId))
      .limit(1)

    if (!org) {
      return null
    }

    return {
      id: org.id,
      name: org.name,
      slug: org.slug,
      ownerId: org.ownerId,
      createdAt: new Date(org.createdAt),
      updatedAt: new Date(org.updatedAt),
    }
  }

  /**
   * Get organization by slug
   */
  async getOrganizationBySlug(slug: string): Promise<Organization | null> {
    const [org] = await this.db
      .select()
      .from(organizations)
      .where(eq(organizations.slug, slug))
      .limit(1)

    if (!org) {
      return null
    }

    return {
      id: org.id,
      name: org.name,
      slug: org.slug,
      ownerId: org.ownerId,
      createdAt: new Date(org.createdAt),
      updatedAt: new Date(org.updatedAt),
    }
  }

  /**
   * Get organizations for a user
   */
  async getUserOrganizations(userId: string): Promise<Organization[]> {
    const results = await this.db
      .select({
        org: organizations,
      })
      .from(organizationMembers)
      .where(eq(organizationMembers.userId, userId))
      .innerJoin(organizations, eq(organizations.id, organizationMembers.organizationId))

    return results.map((r) => ({
      id: r.org.id,
      name: r.org.name,
      slug: r.org.slug,
      ownerId: r.org.ownerId,
      createdAt: new Date(r.org.createdAt),
      updatedAt: new Date(r.org.updatedAt),
    }))
  }

  /**
   * Add member to organization
   */
  async addMember(
    organizationId: string,
    userId: string,
    role: 'admin' | 'member' = 'member'
  ): Promise<OrganizationMember> {
    const [member] = await this.db
      .insert(organizationMembers)
      .values({
        organizationId,
        userId,
        role,
      })
      .returning()

    return {
      id: member.id,
      organizationId: member.organizationId,
      userId: member.userId,
      role: member.role as 'owner' | 'admin' | 'member',
      createdAt: new Date(member.createdAt),
    }
  }

  /**
   * Remove member from organization
   */
  async removeMember(organizationId: string, userId: string): Promise<boolean> {
    await this.db
      .delete(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organizationId, organizationId),
          eq(organizationMembers.userId, userId)
        )
      )

    return true
  }

  /**
   * Get organization members
   */
  async getMembers(organizationId: string): Promise<OrganizationMember[]> {
    const members = await this.db
      .select()
      .from(organizationMembers)
      .where(eq(organizationMembers.organizationId, organizationId))

    return members.map((m) => ({
      id: m.id,
      organizationId: m.organizationId,
      userId: m.userId,
      role: m.role as 'owner' | 'admin' | 'member',
      createdAt: new Date(m.createdAt),
    }))
  }

  /**
   * Check if user is member of organization
   */
  async isMember(organizationId: string, userId: string): Promise<boolean> {
    const [member] = await this.db
      .select()
      .from(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organizationId, organizationId),
          eq(organizationMembers.userId, userId)
        )
      )
      .limit(1)

    return !!member
  }

  /**
   * Update member role
   */
  async updateMemberRole(
    organizationId: string,
    userId: string,
    role: 'admin' | 'member'
  ): Promise<boolean> {
    await this.db
      .update(organizationMembers)
      .set({ role })
      .where(
        and(
          eq(organizationMembers.organizationId, organizationId),
          eq(organizationMembers.userId, userId)
        )
      )

    return true
  }
}
