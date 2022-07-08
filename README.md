<div id="top">
<br />
<div align="center">
<h3 align="center">MojEnter</h3>
  <p align="center">
    Web application for computer services
    <br />
    <a href="http://serwis.szymonswist.pl/">Demo</a>
    ·
    <a href="https://github.com/Swistu/MojEnter/issues">Report Bug</a>
    ·
    <a href="https://github.com/Swistu/MojEnter/issues">Request Feature</a>
  </p>
</div>



<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#demo">Demo</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>


## About The Project
<br />
A project created for any service centre accepting equipment for repair.
<br />
<br />
This web application contains a registration/log-in system that is integrated with firebase. It includes the possibility of logging in with a Google account. With this app you can create new orders, edit the status of orders, open private live text chats with customers. The app also has a notification system.
<br />
<br />

### Built With

- [React.js](https://reactjs.org/)
- [Redux](https://redux.js.org/)
- [RxJS](https://rxjs.dev/)
- [Firebase](https://firebase.google.com/)

<p align="right">(<a href="#top">back to top</a>)</p>

## Getting Started

### Prerequisites

* npm
  ```sh
  npm install npm@latest -g
  ```
* Create new project at [Firebase](https://firebase.google.com/)

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/Swistu/MojEnter.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Edit `index.js` file with firebase settings
  ```js
  const firebaseConfig = {
    apiKey: "API_KEY",
    authDomain: "example-project.firebaseapp.com",
    databaseURL: "https://example-project.firebaseio.com",
    projectId: "example-project",
    appId: "APP_ID"
  };
  ```

<p align="right">(<a href="#top">back to top</a>)</p>


## Demo

Demo is avaible at [serwis.szymonswist.pl](http://serwis.szymonswist.pl/)

<div align="center">
<img src="https://i.ibb.co/Wn7StyD/Image.png" alt="" >
</div>
<br />
<b>Admin account:</b>
<br />
<div>Email: admin@admin.pl</div>
<div>Password: admin123</div>

<p align="right">(<a href="#top">back to top</a>)</p>


## License
Distributed under the GPL-3.0 License. See `LICENSE.md` for more information.
<p align="right">(<a href="#top">back to top</a>)</p>

## Contact

Szymon Świst - [szymonswist97@gmail.com](mailto:szymonswist97@gmail.com)

Project Link: [github.com/Swistu/MojEnter](https://github.com/Swistu/MojEnter)

<p align="right">(<a href="#top">back to top</a>)</p>
