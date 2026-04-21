import ChartInterface from '@/components/Chat';
import React from 'react'

const Page = async ({ params }: {
  params: Promise<{ slugid: string }>
}) => {
  const { slugid } = await params;
  return (
    <div>
      <ChartInterface
        key={slugid}
        isProjectPage={true}
        slugId={slugid}
      />
    </div>
  )
}

export default Page