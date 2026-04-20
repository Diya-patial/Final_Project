function getStatusColor(status) {
  switch (status.toLowerCase()) {
    case 'success':
    case 'running':
    case 'active':
      return '#3fb950'   

    case 'failed':
    case 'error':
    case 'critical':
      return '#f85149'   

    case 'pending':
    case 'building':
    case 'warning':
      return '#d29922'   

    case 'inactive':
    case 'stopped':
      return '#8b949e'  
    default:
      return '#58a6ff'  
  }
}

export default getStatusColor