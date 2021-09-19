 [![Contributors][contributors-shield]][contributors-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
  



<!-- PROJECT LOGO -->
<br />
<p align="center">
    <a href="https://github.com/TRADLY-PLATFORM/Wolverine">
    <img src="https://avatars.githubusercontent.com/u/64465296?s=200&v=4" alt="Logo" width="80" height="80">
  </a>
 
  <h3 align="center">Tradly Platform</h3>
 
 <p align="center">
     An open source React Native Template. Built on top of Tradly Headless API
    <br />
    <a href="https://portal.tradly.app/docs/introduction"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://portal.tradly.app/react-native">View Demo</a>
    ·
    <a href="https://github.com/TRADLY-PLATFORM/Wolverine/issues">Report Bug</a>
    ·
    <a href="https://github.com/TRADLY-PLATFORM/Wolverine/issues">Request Feature</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
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
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <!-- <li><a href="#acknowledgements">Acknowledgements</a></li> -->
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project
This React Native template provides a full fledged event marketplace app. With a few smaller customisation on strings used in the app, it can be personalised for other marketplace types as well. Progressively we will be adding the mobile app configs that will help you to customise things from [Tradly SuperAdmin](https://auth.sandbox.tradly.app/register)
<!-- [![Product Name Screen Shot][product-screenshot]](https://example.com) -->

The below picture is how this react native app is done. There might be small features which may be missing but will be developed as per the Roadmap. 
![Snip20210920_20](https://user-images.githubusercontent.com/61427976/133940821-f7df0364-9c41-4181-9179-2e14924e19c4.png)
![Snip20210920_21](https://user-images.githubusercontent.com/61427976/133940825-8c63d4aa-5f9c-4e58-894d-e75f0fa00f55.png)

### Built With

* [React](https://github.com/facebook/react-native)
 

<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

We recommend installing Node and Watchman using [Homebrew](https://brew.sh). Run the following commands in a Terminal after installing Homebrew:
* Node
  ```sh
  brew install node
  brew install watchman
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/TRADLY-PLATFORM/Wolverine.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
#### iOS
    In the `ios` directory
    * Install Pods: `gem install cocoapods`
    * Install Pods: `pod install`
 
#### Android

* You might need to do this to run it in Android Studio or on real device: `adb reverse tcp:8081 tcp:8081`
* And for the sample server: `adb reverse tcp:3000 tcp:3000`
* To run from command line try: `react-native run-android`



<!-- USAGE EXAMPLES -->
## Usage
Here is some client/app specific things you might need to change. 3rd party integrations with Stripe, Firebase, Sentry need your own account Keys for it to work. 
- TenantID of Tradly can be found from [Tradly Superadmin Dashboard](https://superadmin.sandbox.tradly.app)(Sandbox or Production tenantID/APIkey based on your purchase)
- You might be change these values which are given below

```tsx
// AppConstant.js

    appSharePath: 'abc://',
    stripePublishKey: 'abc',
    dsnSentry: 'https://abc.ingest.sentry.io/5896058',
    firebaseChatPath: '/abc_dev/',
    tenantID:'abc',
```


<!-- ROADMAP -->
## Roadmap
See the [open issues](https://github.com/TRADLY-PLATFORM/Wolverine/issues) for a list of proposed features (and known issues).


<!-- LICENSE -->
## License
Distributed under the MIT License. See `LICENSE` for more information.


## Have a question
- [create an issue](https://github.com/TRADLY-PLATFORM/Wolverine/issues)
- join our [community forum] for further discussion (https://community.tradly.app)
- Tradly Platform   -  hitradly@gmail.com
- Project Link: [https://github.com/github_username/repo_name](https://github.com/TRADLY-PLATFORM/Wolverine)


<!-- ACKNOWLEDGEMENTS -->
<!-- ## Acknowledgements

* []()
* []()
* []()
 -->




<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/TRADLY-PLATFORM/Wolverine 
[contributors-url]: https://github.com/TRADLY-PLATFORM/Wolverine/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/TRADLY-PLATFORM/Wolverine
[forks-url]: https://github.com/TRADLY-PLATFORM/Wolverine/network/members
[stars-shield]: https://img.shields.io/github/stars/TRADLY-PLATFORM/Wolverine
[stars-url]: https://github.com/TRADLY-PLATFORM/Wolverine/stargazers
[issues-shield]: https://img.shields.io/github/issues/TRADLY-PLATFORM/Wolverine
[issues-url]: https://github.com/TRADLY-PLATFORM/Wolverine/issues
[license-shield]: https://img.shields.io/github/license/TRADLY-PLATFORM/repo.svg?style=for-the-badge
[license-url]: https://github.com/TRADLY-PLATFORM/Wolverine/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/github_username
