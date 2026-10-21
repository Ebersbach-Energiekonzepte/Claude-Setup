# SD-Planer auf dem iPhone (Safari / PWA)

Der SD-Planer kann auf dem iPhone auf zwei Wegen genutzt werden:

1. als installierbare Web-App im Safari (PWA),
2. als native iOS-App aus dem Expo/React-Native-Projekt in `ios-app/`.

Beide Varianten speichern die Daten lokal auf dem Gerät. Es gibt keinen
automatischen Upload an GitHub oder irgendeine Cloud. Fotos und Auftragsdaten
bleiben auf dem jeweiligen iPhone bzw. im lokalen Browser-Speicher liegen.

## 1. PWA im Safari installieren

1. Die HTTPS-Adresse der veröffentlichten App im Safari öffnen.
2. Auf **Teilen** tippen.
3. **Zum Home-Bildschirm** wählen.
4. **Hinzufügen** bestätigen.
5. Danach lässt sich der SD-Planer über das neue Home-Bildschirm-Symbol öffnen.

Wichtig: Für die erste Einrichtung muss die App per HTTPS erreichbar sein.
Danach bleibt sie auch ohne aktive Internetverbindung nutzbar, sofern der
Offline-Cache bereits initialisiert wurde. Aufnahmen bleiben auf genau diesem
Gerät gebunden. Für Sicherung oder Übertragung nutzt man **Auftrag exportieren**.
Nach einer Aktualisierung die Browser-Seite einmal neu laden; eine installierte
PWA bei Bedarf vollständig schließen und erneut öffnen.

## 2. PDF erstellen und teilen

Im SD-Planer die gewünschte Aufnahme öffnen und oben auf **PDF** tippen. Der
druckoptimierte Aufnahmebericht mit Auftragsdaten, Kontakt- und Objektadresse,
den ausgefüllten Angaben je Aufnahmebereich sowie der Fotodokumentation wird
im selben Safari-Fenster geöffnet und die iOS-Druckvorschau direkt gestartet.
Es wird kein zusätzliches Popup-Fenster geöffnet. In der Druckvorschau das PDF
über **Teilen** sichern, zum Beispiel in **Dateien**, per Mail oder per AirDrop.
Nach dem Drucken kannst du über **Zurück zur Aufnahme** wieder zur App wechseln.
Die Aufnahme bleibt zusätzlich lokal in der App gespeichert.

## 3. Außeneinheit und Abstände

Im Bereich **Außeneinheit** zuerst Hersteller, Baureihe und danach die passende
Leistungsstufe bzw. Typnummer auswählen. Die Liste der Leistungsstufen passt
sich an die gewählte Baureihe an. Die Außeneinheit wird standardmäßig als
Bodenaufstellung im Vor- oder Hintergarten aufgenommen; eine Auswahl für
Wand-, Eck- oder Dachaufstellung wird nicht angezeigt. Abstände werden mit
verständlichen Richtungsbeschreibungen erfasst. Wo Vaillant-Maßbuchstaben
hinterlegt sind, erscheinen A–E zusätzlich in der jeweils passenden
Abstandsbeschreibung.

Es werden keine Herstellerquellen oder Links in der Oberfläche angezeigt.
Hinterlegte Gerätewerte dienen weiterhin der Abstands- und Schallorientierung;
gemessene Mindestabstände werden grün oder rot markiert. Für Vaillant-
Baureihen mit Flexible-Space-Unterstützung wird die Funktion standardmäßig
als **Nein** angesetzt und kann bei Bedarf auf **Ja** gestellt werden. Die
Montagehöhe wird für die angenommene Bodenaufstellung mit 0 cm angesetzt.
Für Solvis Pia und Lea Pro werden die R290-Schutzbereiche konservativ mit
einem Mindestabstand für alle Richtungen bewertet.

Für die Vitocal 200-A ie sind vier Baugrößen mit Leistungs- und Schallwerten
aus dem vorläufigen Viessmann-Datenblatt 9444 982-1 (09/2026) hinterlegt.
Vor der Angebots- oder Ausführungsplanung die endgültigen Herstellerdaten
prüfen.

Die Abstands- und Schallanzeige ist eine Vor-Ort-Orientierung und ersetzt weder
die vollständige Montageanleitung noch die Schallprognose oder Prüfung der
örtlichen Anforderungen. Für nicht hinterlegte, ältere oder abweichende
Gerätevarianten werden keine Mindestwerte geschätzt; maßgeblich bleiben die
Unterlagen des konkreten Geräts. Wo für eine Baureihe oder Leistungsstufe
keine eindeutige Zahl hinterlegt ist, bleibt die betreffende Prüfung neutral.

## 4. Hosting und GitHub Pages

Die Dateien `index.html`, `manifest.webmanifest`, `sw.js` und `icons/` müssen
zusammen über HTTPS erreichbar sein. Eine GitHub-Pages-Veröffentlichung macht
sie von einer öffentlichen URL aus aufrufbar.

Der Workflow `Deploy SD-Planer to GitHub Pages` veröffentlicht ausschließlich
die für die Web-App benötigten Dateien. Für die erste Einrichtung muss unter
**Settings → Pages → Build and deployment → Source** einmal **GitHub Actions**
aktiviert werden.

Direktlink zur Seitenkonfiguration:

<https://github.com/Ebersbach-Energiekonzepte/Claude-Setup/settings/pages>

Öffentliche URL der App:

`https://ebersbach-energiekonzepte.github.io/Claude-Setup/`

Diese Adresse funktioniert erst, nachdem die erste GitHub-Pages-Bereitstellung
erfolgreich abgeschlossen ist.

## 5. Native iOS-App (optional)

Die native Variante liegt im Ordner `ios-app/` und nutzt Expo + React Native.
Sie eignet sich vor allem für echte iPhone-Workflows, einfache App-Erfahrung
und die Nutzung des iOS-Teilen-Menüs für Export/Import/PDF.

Für die lokale Entwicklung:

```sh
cd ios-app
npm install
npx expo start
```

Für einen echten iPhone-Build ist ein Apple Developer Account nötig.
Empfohlene Cloud-Route mit EAS:

```sh
cd ios-app
npx eas-cli login
npx eas-cli build --platform ios --profile preview
```

## 6. Sicherheits- und Betriebs-Hinweise

- Keine Auftragsdaten oder Fotos in GitHub, öffentliche Logs oder Screenshots
  hochladen.
- Die PWA-Version bleibt auf genau diesem iPhone-Browser bzw. Gerät gebunden.
- Für Datenaustausch zwischen Geräten: **Auftrag exportieren** verwenden.
- Die iOS-App und die Safari-App sind getrennte lokale Installationen; sie
  synchronisieren ihre Daten nicht automatisch.
