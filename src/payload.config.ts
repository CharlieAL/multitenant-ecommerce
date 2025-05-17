// storage-adapter-import-placeholder
import path from 'path'
import sharp from 'sharp'

import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'

import { Tags } from './collections/Tags'
import { Media } from './collections/Media'
import { Users } from './collections/Users'
import { Tenants } from './collections/Tenants'
import { Products } from './collections/Products'
import { Categories } from './collections/Categories'

import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import { Orders } from './collections/Orders'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname)
    }
  },
  collections: [Users, Media, Categories, Products, Tags, Tenants, Orders],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts')
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || ''
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    multiTenantPlugin({
      collections: {
        products: {},
        orders: {}
      },
      tenantsArrayField: {
        includeDefaultField: true
      },
      userHasAccessToAllTenants: (user) => Boolean(user?.roles?.includes('super-admin'))
    })
    // storage-adapter-placeholder
  ]
})
