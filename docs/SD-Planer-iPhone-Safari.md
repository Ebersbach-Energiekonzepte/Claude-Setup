# SD-Planer auf dem iPhone (Safari)

Der SD-Planer ist eine installierbare Web-App (PWA). Er wird über eine
HTTPS-Adresse in Safari geöffnet. Die Formulare, Aufnahmen und Fotos bleiben in der lokalen Browser-Speicherung
des jeweiligen iPhones; es gibt keinen automatischen Upload. Aufnahmen werden
unter dem Vornamen angezeigt und lassen sich nach Vorname, vollständigem
Namen, Auftragsnummer und Adresse durchsuchen.

## PDF erstellen und teilen

Im SD-Planer die gewünschte Aufnahme öffnen und oben auf **PDF** tippen. Die
Druckansicht enthält alle Aufnahmebereiche in der Reihenfolge der App und die
zugehörigen Fotos. In der iPhone-Druckvorschau die Vorschau mit zwei Fingern
auseinanderziehen, um das PDF zu öffnen. Über **Teilen** kann es anschließend
zum Beispiel in **Dateien** gesichert, per Mail versendet oder per AirDrop
geteilt werden. Die Aufnahme bleibt zusätzlich lokal in der App gespeichert.

## Auf dem iPhone installieren

1. Den HTTPS-Link zum SD-Planer in **Safari** öffnen.
2. Auf **Teilen** tippen.
3. **Zum Home-Bildschirm** auswählen und **Hinzufügen** bestätigen.
4. Danach lässt sich der SD-Planer über das neue Home-Bildschirm-Symbol öffnen.

Eine einmal geladene Version kann nach erfolgreicher Einrichtung des Offline-
Caches auch ohne Netz geöffnet werden. Für die erste Einrichtung ist eine
Internetverbindung erforderlich. Aufnahmen bleiben an Safari beziehungsweise
die installierte Web-App auf genau diesem Gerät gebunden. Für Sicherung oder
Übertragung **Auftrag exportieren** verwenden.

## Hosting

Die Dateien `index.html`, `manifest.webmanifest`, `sw.js` und `icons/` müssen
gemeinsam über HTTPS auf derselben Website erreichbar sein. Die vorhandene
GitHub-Repository-Adresse ist nicht automatisch der App-Link. Eine GitHub-
Pages-Veröffentlichung macht die App unter einer öffentlichen Website
erreichbar. Der Workflow `Deploy SD-Planer to GitHub Pages` veröffentlicht
ausschließlich die für die Web-App benötigten Dateien.

Für die erste Veröffentlichung muss im Repository unter **Settings → Pages →
Build and deployment → Source** einmal **GitHub Actions** ausgewählt und
gespeichert werden. Die Seiteneinstellung findest du direkt unter:

<https://github.com/Ebersbach-Energiekonzepte/Claude-Setup/settings/pages>

Anschließend den fehlgeschlagenen Lauf unter **Actions** erneut starten oder
Änderungen an der veröffentlichten Branch pushen. Die öffentliche Adresse lautet:

`https://ebersbach-energiekonzepte.github.io/Claude-Setup/`

Diese URL funktioniert, sobald die erste GitHub-Pages-Bereitstellung erfolgreich
abgeschlossen ist. Der Repository-Inhalt ist öffentlich; es werden keine
Aufnahme- oder Fotodaten an GitHub übertragen.
git push origin HEAD:claude/nuos-ios-port-zk07cz
