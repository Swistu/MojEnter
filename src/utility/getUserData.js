import { auth, database } from 'firebase';

export const getUserData = async () => {
  const userData = await database().ref("users/" + auth().currentUser.uid).once("value");

  return userData.val();
}
