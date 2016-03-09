<img src="https://cloud.githubusercontent.com/assets/668093/12567089/0ac42774-c372-11e5-97eb-00baf0fccc37.jpg" alt="OpenMRS"/>

# Concept Dictionary
[![Build Status](https://img.shields.io/travis/psbrandt/openmrs-owa-conceptdictionary/setup-testing.svg?style=flat-square)](https://travis-ci.org/psbrandt/openmrs-owa-conceptdictionary)

This repository contains the Concept Dictionary OpenMRS Open Web App.

> Concept dictionary functionality implemented as an OWA

For further documentation about OpenMRS Open Web Apps see [the wiki page](https://wiki.openmrs.org/display/docs/Open+Web+Apps+Module).

## Development

### Setup OpenMRS server

You will need JDK 1.7, maven and OpenMRS SDK. Please refer to [the wiki page] (https://wiki.openmrs.org/display/docs/OpenMRS+SDK#OpenMRSSDK-Installation) for installation instructions.

You need to setup a server (first time only) as follows:

````
mvn openmrs-sdk:setup-platform -DserverId=conceptdictionary
mvn openmrs-sdk:install -DartifactId=owa -Dversion=1.4-SNAPSHOT -DserverId=conceptdictionary
mvn openmrs-sdk:install -DartifactId=webservices.rest -Dversion=2.13 -DserverId=conceptdictionary
mvn openmrs-sdk:install -DartifactId=uiframework -Dversion=3.6 -DserverId=conceptdictionary
mvn openmrs-sdk:install -DartifactId=uicommons -Dversion=1.7 -DserverId=conceptdictionary
````

Now you can run the server:
````
mvn openmrs-sdk:run -DserverId=conceptdictionary
````
Once it says "Started Jetty Server", visit http://localhost:8080/openmrs in your browser.

### Production Build

You will need NodeJS 4+ installed to do this. See the install instructions [here](https://nodejs.org/en/download/package-manager/).

Once you have NodeJS installed, you need to install Gulp and Bower (first time only) as follows:
````
npm install -g gulp bower
````

Install the dependencies (first time only):

```
npm install && bower install
```

Build the distributable using [Gulp](http://gulpjs.com/) as follows:

````
gulp
````

This will create a file called `conceptdictionary.zip` file in the `dist` directory, which can be uploaded to the OpenMRS Open Web Apps module.

### Local Deploy

To deploy directly to your local Open Web Apps directory, run:

````
gulp deploy-local
````

This will build and deploy the app to the `C:\Users\Rafal\openmrs\conceptdictionary` directory. To change the deploy directory, edit the `LOCAL_OWA_FOLDER` value in `config.json`. You can find your deploy directory running:

````
 mvn openmrs-sdk:run -DserverId=conceptdictionary
````
Look at the tmp directory location. The tmp directory is created in your deploy directory so just skip \tmp.
````
[INFO] --- openmrs-sdk-maven-plugin:2.1.2:run (default-cli) @ standalone-pom ---
[INFO] Configuring Jetty for project: Maven Stub Project (No POM)
[INFO] Context path = /openmrs
[INFO] Tmp directory = C:\Users\Rafal\openmrs\conceptdictionary\tmp
````

It is also possible to configure the project so that whenever a file is changed it is deployed to a server and a
browser is refreshed. First please make sure the APP_ENTRY_POINT is set in config.json as follows:

````
{
  "LOCAL_OWA_FOLDER": "C:\\\\Users\\\\rafal\\\\openmrs\\\\conceptdictionary\\\\owa\\\\",
  "APP_ENTRY_POINT":"http://localhost:8080/openmrs/owa/conceptdictionary/index.html"
}
````

Next run:
````
gulp watch
````

While it runs, it watches all files for changes and automatically updates your browser.

### Extending

Install [Bower](http://bower.io/) packages dependencies as follows:

````
bower install --save <package>
````

Be sure to include the following in your `html` files at the position you want the Bower dependencies injected:

````
<!-- bower:js -->
<!-- endbower -->
````
Do the same for your Bower stylesheet dependencies, but replace `js` with `css`.

Any files that you add manually must be added in the `app` directory.

## License

[MPL 2.0 w/ HD](http://openmrs.org/license/) © [OpenMRS Inc.](http://www.openmrs.org/)
