import type { CollectionConfig } from 'payload'

import { tenantsArrayField } from '@payloadcms/plugin-multi-tenant/fields'
import { isSuperAdmin } from '~/lib/access'

const defaultTenantArrayField = tenantsArrayField({
  tenantsArrayFieldName: 'tenant',
  tenantsCollectionSlug: 'tenants',
  tenantsArrayTenantFieldName: 'tenant',
  arrayFieldAccess: {
    read: () => true,
    update: ({ req }) => isSuperAdmin(req.user),
    create: ({ req }) => isSuperAdmin(req.user)
  },
  tenantFieldAccess: {
    read: () => true,
    update: ({ req }) => isSuperAdmin(req.user),
    create: ({ req }) => isSuperAdmin(req.user)
  }
})

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    read: () => true,
    update: ({ req, id }) => {
      if (isSuperAdmin(req.user)) return true
      if (req.user?.id === id) return true
      return false
    },
    create: ({ req }) => isSuperAdmin(req.user),
    delete: ({ req }) => isSuperAdmin(req.user)
  },
  admin: {
    useAsTitle: 'email',
    hidden: ({ user }) => !isSuperAdmin(user)
  },

  auth: true,
  fields: [
    {
      name: 'username',
      type: 'text',
      required: true,
      unique: true
    },
    {
      admin: {
        position: 'sidebar'
      },
      name: 'roles',
      type: 'select',
      defaultValue: ['user'],
      hasMany: true,
      options: ['super-admin', 'user'],
      access: {
        update: ({ req }) => isSuperAdmin(req.user)
      }
    },
    {
      ...defaultTenantArrayField,
      admin: {
        ...(defaultTenantArrayField.admin || {}),
        position: 'sidebar'
      }
    }
  ]
}
