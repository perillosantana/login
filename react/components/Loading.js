import React from 'react'
import { Spinner } from 'vtex.styleguide'

import styles from '../styles.css'

function Loading() {
  return (
    <div className={styles.loading}>
      <div className="w-100 tc c-emphasis pv8">
        <Spinner color="currentColor" size={32} />
      </div>
    </div>
  )
}

export default Loading
