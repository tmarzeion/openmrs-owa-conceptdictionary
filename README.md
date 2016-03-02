<img src="https://cloud.githubusercontent.com/assets/668093/12567089/0ac42774-c372-11e5-97eb-00baf0fccc37.jpg" alt="OpenMRS"/>

# Concept Dictionary

This repository contains the Concept Dictionary OpenMRS Open Web App.

> Add a description of what your app does here.

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

This will build and deploy the app to the `C:\Users\Rafal\openmrs\conceptdictionary` directory. To change the deploy directory, edit the `LOCAL_OWA_FOLDER` variable in `gulpfile.js`.

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
