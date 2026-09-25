const { withAppBuildGradle } = require('expo/config-plugins');

// Signs release builds with the upload key defined in ~/.gradle/gradle.properties.
// Falls back to debug signing when those properties are missing.
const RELEASE_SIGNING = `
        release {
            if (project.hasProperty('WELLLITE_UPLOAD_STORE_FILE')) {
                storeFile file(WELLLITE_UPLOAD_STORE_FILE)
                storePassword WELLLITE_UPLOAD_STORE_PASSWORD
                keyAlias WELLLITE_UPLOAD_KEY_ALIAS
                keyPassword WELLLITE_UPLOAD_KEY_PASSWORD
            }
        }`;

module.exports = function withReleaseSigning(config) {
  return withAppBuildGradle(config, (config) => {
    let gradle = config.modResults.contents;
    if (gradle.includes('WELLLITE_UPLOAD_STORE_FILE')) return config;

    gradle = gradle.replace(/signingConfigs \{/, `signingConfigs {${RELEASE_SIGNING}`);
    gradle = gradle.replace(
      /(release \{[^}]*?)signingConfig signingConfigs\.debug/,
      `$1signingConfig project.hasProperty('WELLLITE_UPLOAD_STORE_FILE') ? signingConfigs.release : signingConfigs.debug`,
    );
    config.modResults.contents = gradle;
    return config;
  });
};
