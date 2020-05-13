import { auth } from 'firebase';

export const checkAccounType = async () => {
  const accountType = await auth().currentUser.getIdTokenResult()
    .then((idTokenResult) => {
      if (idTokenResult.claims.admin === true)
        return "admin"
      else if (idTokenResult.claims.worker === true)
        return "worker"
      else
        return "user"
    })

  return accountType;
}
