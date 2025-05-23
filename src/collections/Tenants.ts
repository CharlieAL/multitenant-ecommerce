import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '~/lib/access'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  access: {
    create: ({ req }) => isSuperAdmin(req.user),
    delete: ({ req }) => isSuperAdmin(req.user)
  },
  admin: {
    useAsTitle: 'slug'
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Store Name',
      admin: {
        description: `This is the name of the store (e.g. John's Store)`
      }
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: `This is the subdomain of the store (e.g. [slug].funroad.com)`
      },
      access: { update: ({ req }) => isSuperAdmin(req.user) }
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media'
    },
    {
      name: 'stripeAccountId',
      type: 'text',
      required: true,
      access: {
        update: ({ req }) => isSuperAdmin(req.user)
      },
      admin: {
        description: 'Stripe Account ID associated with your shop'
      }
    },
    {
      name: 'stripeDetailsSubmitted',
      type: 'checkbox',
      access: {
        update: ({ req }) => isSuperAdmin(req.user)
      },
      admin: {
        description: 'You cannot create products until you submit your Stripe details'
      }
    }
  ]
}
