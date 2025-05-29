import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '~/lib/access'
import { Tenant } from '~/payload-types'

export const Products: CollectionConfig = {
  slug: 'products',
  access: {
    create: ({ req }) => {
      if (isSuperAdmin(req.user)) return true
      const tenant = req.user?.tenants?.[0]?.tenant as Tenant
      return Boolean(tenant?.stripeDetailsSubmitted)
    },
    delete: ({ req }) => isSuperAdmin(req.user)
  },
  admin: {
    useAsTitle: 'name',
    description: 'Your must verify your account before creating products'
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true
    },
    {
      name: 'description',
      type: 'richText'
    },
    {
      name: 'price',
      type: 'number',
      required: true
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: false
    },
    {
      name: 'tag',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media'
    },
    {
      name: 'refundPolicy',
      type: 'select',
      options: ['30-day', '14-day', '7-day', '3-day', '1-day', 'no-refund'],
      defaultValue: '30-day'
    },
    {
      name: 'content',
      type: 'richText',
      admin: {
        description:
          'Protected content only visible after purchase. Add product documentation downloadable file, getting started guide and bonus materials. Support markdown formatting.'
      }
    },
    {
      name: 'isArchived',
      label: 'Archived',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Archive product to hide from public view'
      }
    },
    {
      name: 'isPrivate',
      label: 'Private',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'If checked, this product will not be show on public storefront'
      }
    }
  ]
}
