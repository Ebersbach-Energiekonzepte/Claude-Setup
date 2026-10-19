# SD-Planer für iPhone

Diese App bündelt die vorhandene SD-Planer-Aufnahme in eine installierbare
iPhone-App. Die Formulare, Aufnahmen und Entwürfe bleiben lokal auf dem Gerät.
Fotos lassen sich über die Kamera oder die Fotomediathek hinzufügen. Aufträge
können über das iOS-Teilen-Menü exportiert und aus der Dateien-App wieder
importiert werden. Der **PDF**-Button erstellt einen strukturierten
Aufnahmebericht und öffnet danach direkt das Teilen-Menü für PDF-Export oder
Sicherung.

## 1. Lokales Entwickeln

Voraussetzung: Node.js + npm.

```sh
cd ios-app
npm install
npx expo start
```

Für die lokale iOS-Vorschau auf einem Mac:

```sh
npx expo start --ios
```

Wenn der Code in der Expo-Entwicklungslaufzeit auf einem echten iPhone getestet
werden soll, ist ein physisches Gerät oder ein Simulator nötig. Für den echten
Gerätetest mit TestFlight oder App Store ist zusätzlich ein Apple-Developer-
Account erforderlich.

## 2. iOS-Build mit Expo EAS

Für einen Cloud-Build ohne lokalen Mac:

```sh
cd ios-app
npx eas-cli login
npx eas-cli init
npx eas-cli build --platform ios --profile preview
```

Der Preview-Build eignet sich für interne Tests. Für TestFlight / App Store
wird ein Produktionsbuild benötigt:

```sh
npx eas-cli build --platform ios --profile production
npx eas-cli submit --platform ios --latest
```

## 3. Apple-Setup und Signierung

Vor dem ersten echten iOS-Build müssen folgende Punkte geklärt sein:

- aktives Apple Developer Program für den jeweiligen Eigentümer,
- passende Bundle-ID in `ios-app/app.json`,
- registriertes Testgerät oder TestFlight-Setup,
- gültige Signatur-/Provisioning-Konfiguration in EAS oder Xcode.

Die Bundle-ID muss exakt zu dem Apple-Konto und der App-Registrierung passen,
sonst schlägt der Build fehl.

## 4. Parallel zur PWA/Browser-Version

Der SD-Planer funktioniert zusätzlich als installierbare Web-App im Safari.
Die Browser-Version ist für schnelle Einsatzfälle gut geeignet; die native iOS-
App ist die besser geeignete Option für den echten iPhone-Workflow, wenn der
Ablauf auf dem Gerät vollständig in eine App eingebettet werden soll.

## 5. Wichtige Hinweise

- Korrekte App- und Bundle-IDs vor dem Build prüfen.
- Keine Kunden- oder Foto-Daten in GitHub oder öffentliche Logs hochladen.
- Für die produktive Nutzung sind die App- und PWA-Variante auf demselben Gerät
  nur als separate lokale Installationen nutzbar; Daten werden nicht automatisch
  zwischen Safari- und iOS-App synchronisiert.
- Die App speichert Daten lokal auf dem Gerät und exportiert/teilt sie über das
  iOS-Teilen-Menü.
