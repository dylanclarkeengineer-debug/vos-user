import { redirect } from 'next/navigation'

export const metadata = {
  title: 'VGC News Agency | Global Editorial Workspace',
  description: 'The standard for modern digital journalism.',
}

export default function LandingPage() {
  redirect('/signin')
}
