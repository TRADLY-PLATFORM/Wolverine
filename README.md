# Tradly Event App

At [Tradly](https://tradly.app), we are trying to understand the best way to build React Native apps. This app is a working app in which we implement new ideas or those that have worked for us so far.

## Usage example
* You might be change these values which are given below

```tsx
// AppConstant.js
    {
      appSharePath: 'abc://',
      stripePublishKey: 'abc',
      dsnSentry: 'https://abc.ingest.sentry.io/5896058',
      firebaseChatPath: '/abc_dev/',
    }
```

### iOS
In the root directory
* Install dependencies: `npm install`

In the `ios` directory

* Install Pods: `gem install cocoapods`
* Install Pods: `pod install`


### Android

* You might need to do this to run it in Android Studio or on real device: `adb reverse tcp:8081 tcp:8081`
* And for the sample server: `adb reverse tcp:3000 tcp:3000`
* To run from command line try: `react-native run-android`

### Server

There is a server that the app hits for data. The data is only stored in memory, but it should produce a more realistic environment.

In the `server` directory

* Install nvm and node-4.2.3
* Install dependencies: `npm install`
* Run it: `npm start`

It has sample data in the `models.js` file. For example, there is a user bleonard (password: "sample") that you can log in as.


### Compiling

You can compile and put it on the phone with: `npm run install:staging`

Not that there's a staging server at this point, but it's an example of how to compile things via the command line.

### Android

We'll get there, but we're still working on the iOS version.

# Current Concepts

#### Environment

There is a model called Environment that gets bootstrapped from Objective-C. It knows things that are different per environment like what API server to talk to.

#### Data storage

Info is currently stored as json to the local file system.

#### Shared CSS

It uses the `cssVar` pattern from the sample Facebook apps.

#### API

It uses superagent to do HTTP requests and sets headers and other things like that.

#### Components

Some shared components that might be helpful

* SegmentedControl: Non-iOS specific version of that control
* SimpleList: make a list out of the props set
* Button: Helper to make them all similiar

## Have a question
- create an issue
- join our developer [community](https://community.tradly.app)
