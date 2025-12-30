'use client'

import dynamic from 'next/dynamic'

const SiteLogCapture = dynamic(
  () => import('./SiteLogCapture').then((mod) => mod.SiteLogCapture),
  { ssr: false }
)

export default function SiteLogCaptureWrapper(props: any) {
  return <SiteLogCapture {...props} />
}
