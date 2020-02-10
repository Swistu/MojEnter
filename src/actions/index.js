

export const increment = () => {
  return {
    type: 'INCREMENT'
  }
}
export const decrement = () => {
  return {
    type: 'DECREMENT'
  }
}
export const signIn = (user) => {
  return {
    type: 'SIGN_IN',
    payLoad: {
      user: user
    }
  }
}