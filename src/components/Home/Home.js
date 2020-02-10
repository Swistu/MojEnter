import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { auth } from 'firebase';
import Card from '../UI/Card/Card';

const Home = () => {
  const user = useSelector(state => state.authenticationReducer.user);

  return (
    <React.Fragment>
      <p>Witaj{user.displayName !== null ? ", " + user.displayName : null} w panelu.</p>
      <p></p>
      <h4 className="page__title">Najnowsze wiadomości</h4>
      <Card>
        <h2 className="card__title">Zniżki</h2>
        <p>Przypominamy, że do 10-02-2020 zniżki na cały asortyment. Nawet do 50%!</p>
      </Card>
      <Card>
        <h2 className="card__title">Informacja</h2>
        <p>
          W najbliższy czwartek 6-02-2020 serwis nieczynny.
        </p>
      </Card>
      <Card>
        <h2 className="card__title">Zmiany pracy serwisu</h2>
        <p>
          Serwis czynny w godzinach: 
        </p>
        <p>
          pn-pt 9:00-17:00
        </p>
      </Card>
    </React.Fragment>
  )
}

export default Home;