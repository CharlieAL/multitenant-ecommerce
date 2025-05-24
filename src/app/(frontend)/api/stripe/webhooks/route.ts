import type { Stripe } from 'stripe'
import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

import { stripe } from '~/lib/stripe'
import { ExpandedLineItem } from '~/modules/checkout/types'

export async function POST(req: Request) {
  let event: Stripe.Event
  try {
    // const body = await req.text()
    event = stripe.webhooks.constructEvent(
      await (await req.blob()).text(),
      req.headers.get('stripe-signature') as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    if (error! instanceof Error) console.log('❌💀 Error message : ', errorMessage)

    console.log('❌ Error message: ', errorMessage)

    return NextResponse.json({ error: `Webhook error: ${errorMessage}` }, { status: 400 })
  }

  console.log('✅ Webhook received: ', event.type)

  const permittedEvent: string[] = ['checkout.session.completed', 'account.updated']

  const payload = await getPayload({
    config
  })

  if (permittedEvent.includes(event.type)) {
    let data
    try {
      switch (event.type) {
        case 'checkout.session.completed':
          data = event.data.object as Stripe.Checkout.Session
          if (!data.metadata?.userId) {
            throw new Error('Webhook error: Missing userId')
          }
          const user = await payload.findByID({
            collection: 'users',
            id: data.metadata.userId
          })
          if (!user) {
            throw new Error('Webhook error: User not found')
          }

          const expandedSession = await stripe.checkout.sessions.retrieve(
            data.id,
            {
              expand: ['line_items.data.price.product']
            },
            {
              stripeAccount: event.account
            }
          )

          if (!expandedSession.line_items?.data || !expandedSession.line_items?.data.length) {
            throw new Error('Webhook error: Line items not found')
          }
          const lineItems = expandedSession.line_items.data as ExpandedLineItem[]

          for (const item of lineItems) {
            await payload.create({
              collection: 'orders',
              data: {
                stripeCheckoutSessionId: data.id,
                stripeAccountId: event.account,
                user: user.id,
                product: item.price.product.metadata.id,
                name: item.price.product.name
              }
            })
          }
          break
        case 'account.updated':
          data = event.data.object as Stripe.Account
          await payload.update({
            collection: 'tenants',
            where: {
              stripeAccountId: {
                equals: data.id
              }
            },
            data: {
              stripeDetailsSubmitted: data.details_submitted
            }
          })
          break

        default:
          throw new Error('Webhook error: Unhandled event type: ' + event.type)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'

      if (error! instanceof Error) console.log('❌💀 Error message : ', errorMessage)
      return NextResponse.json({ error: `${errorMessage}` }, { status: 500 })
    }
  }

  return NextResponse.json({ message: 'Recived ' }, { status: 200 })
}
