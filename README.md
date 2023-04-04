# template-rn068-rnelements-sem-expo
Projeto template com React Native 0.68, React Native Elements ^3.4.2 e sem Expo.

## Testado com sucesso com:

Java 11<br />
Node 14 (ou superior)<br />
react-native: 0.68<br />
yarn 1.22.7 (ou superior)<br />
npx 6.14.15<br />

## Variáveis de ambiente

export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64<br />
export ANDROID_HOME=$HOME/Android/Sdk<br />
export PATH=$PATH:$ANDROID_HOME/tools <br />
export PATH=$PATH:$ANDROID_HOME/platform-tools<br />

## Build

Na pasta do projeto execute: 

yarn<br />

## Install

npx react-native run-android<br />

## Uteis

rm -rf /tmp/metro-* && echo 256 | sudo tee -a /proc/sys/fs/inotify/max_user_instances && echo 32768 | sudo tee -a /proc/sys/fs/inotify/max_queued_events && echo 65536 | sudo tee -a /proc/sys/fs/inotify/max_user_watches && watchman watch-del-all && watchman shutdown-server

react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
