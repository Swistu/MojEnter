export const modal = (type, title, component) => {
  return {
    type: type,
    payLoad: {
      title,
      component
    }
  }
}

export const authentication = (realtimeDatabaseUser) => {
  return {
    type: 'AUTHENTICATION',
    payLoad: {
      realtimeDatabaseUser
    }
  }
}