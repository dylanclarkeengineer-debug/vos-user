export const metadata = {
  title: 'Sign In - VGC User Portal',
  description:
    'Secure access to VGC Ecosystem services including Classifieds, Business Hub, and Editorial News.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
}

export default function SignInLayout({ children }) {
  return <>{children}</>
}
