export const modal = (type, title, component) => {
  return {
    type: type,
    payLoad: {
      title,
      component
    }
  }
}

export const authentication = (firebaseUser, realtimeDatabaseUser) => {
  return {
    type: 'AUTHENTICATION',
    payLoad: {
      firebaseUser,
      realtimeDatabaseUser
    }
  }
}