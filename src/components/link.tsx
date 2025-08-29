import * as Headless from '@headlessui/react'
import NextLink, { type LinkProps } from 'next/link'
import { forwardRef } from 'react'

export const Link = forwardRef<
  HTMLAnchorElement,
  LinkProps & React.ComponentPropsWithoutRef<'a'>
>(function Link(props, ref) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <Headless.DataInteractive as={NextLink as any} ref={ref} {...props} />
})
