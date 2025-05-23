import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '~/lib/access'

export const Tags: CollectionConfig = {
  slug: 'tags',
  access: {
    read: () => true,
    update: ({ req }) => isSuperAdmin(req.user),
    create: ({ req }) => isSuperAdmin(req.user),
    delete: ({ req }) => isSuperAdmin(req.user)
  },
  admin: {
    useAsTitle: 'name',
    hidden: ({ user }) => !isSuperAdmin(user)
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true
    },
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true
    }
  ]
}
