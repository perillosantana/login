import React from 'react'
import { Spinner } from 'vtex.styleguide'

function Loading() {
  return (
    <div className="w-100 tc c-emphasis pv8">
      <Spinner color="currentColor" size={32} />
    </div>
  )
}

export default Loading
