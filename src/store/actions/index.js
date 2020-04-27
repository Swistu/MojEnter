export const modal = (type, title, component) => {
  return {
    type: type,
    payLoad: {
      title,
      component
    }
  }
}

export const authentication = (firebaseUser, data) => {
  return {
    type: 'AUTHENTICATION',
    payLoad: {
      firebaseUser,
      data
    }
  }
}