# NuOS → iOS: Technisches Konzept & Umsetzungsplan

**Projekt:** Portierung / Neubau der NuOS-App für iOS (und Android aus einer Codebasis)
**Auftraggeber:** Ebersbach Energiekonzepte
**Stand:** 2026-07-22
**Status:** Konzeptphase (noch kein Code)

---

## 1. Ausgangslage

Aktuell gibt es die App **NuOS**, die im Außendienst beim Kunden für die
Heizungs-/Wärmepumpen-Berechnung und den Kundenauftrag eingesetzt wird. Sie
kann heute:

- **Fotos aufnehmen** direkt vor Ort beim Kunden
- Fotos **nach definierten Punkten/Kategorien sortieren**
- zu jedem Punkt einen **erklärenden Text / Notizen** erfassen
- den **kompletten Auftrag an Airtable senden**, wo er sich automatisch
  in die richtige Struktur einsortiert

**Problem:** NuOS läuft ausschließlich auf **Android**. Mitarbeiter mit iPhone
können die App nicht nutzen.

**Ziel:** Eine App, die dieselben Abläufe auf **iOS und Android** identisch
abbildet — idealerweise aus **einer gemeinsamen Codebasis**, damit langfristig
nur einmal gewartet werden muss.

> **Offener Punkt:** Der bestehende Android-Quellcode liegt noch **nicht** in
> diesem Repository. Für den eigentlichen Port bzw. das originalgetreue
> Nachbauen brauche ich ihn (siehe Abschnitt 9).

---

## 2. Zielbild

Eine plattformübergreifende App „NuOS" mit folgenden Kern-Eigenschaften:

- Läuft nativ auf **iPhone/iPad (iOS)** und weiterhin auf **Android**
- **Ein Quellcode** für beide Plattformen
- **Offline-fähig**: Fotos und Auftragsdaten werden lokal gespeichert und
  gehen verlässlich raus, sobald wieder Netz da ist (wichtig im Heizungskeller
  ohne Empfang!)
- **Identischer Airtable-Sync** wie heute
- Optisch und im Ablauf **so nah wie möglich am gewohnten NuOS**, damit das
  Team keine Umgewöhnung braucht

---

## 3. Empfohlene Technik

### Empfehlung: React Native + Expo (mit EAS Build)

| Kriterium | Warum das für euch passt |
|---|---|
| **Eine Codebasis** | iOS + Android aus demselben Code — halbe Wartung |
| **iOS-Build ohne eigenen Mac** | Expo **EAS Build** erstellt die iOS-App in der Cloud. Ihr braucht keinen Mac zum Bauen, nur einen Apple-Developer-Account zum Veröffentlichen |
| **Kamera / Fotos** | ausgereifte Standard-Module (expo-camera, expo-image-picker) |
| **Offline-Speicher** | lokale Datenbank (SQLite) + Datei-Speicher, robuste Sync-Queue |
| **Updates** | kleinere Änderungen über „Over-the-air"-Updates ohne neuen Store-Release |
| **Airtable** | reine REST-API — problemlos anbindbar |

**Alternative:** *Flutter* wäre technisch ebenso geeignet. Wir wählen React
Native/Expo, weil der Cloud-Build ohne Mac für ein kleines Team der
praktischste Weg zum iOS-Launch ist. (Falls euer Android-Code bereits Flutter
ist, drehen wir die Empfehlung um — dann portieren wir das bestehende Flutter-
Projekt direkt auf iOS.)

---

## 4. Feature-Mapping — was die App können muss

| # | Funktion | Umsetzung |
|---|---|---|
| 1 | Auftrag/Kunde anlegen | Formular mit Stammdaten (Name, Adresse, Auftragsnr. …) |
| 2 | Fotos aufnehmen | In-App-Kamera, mehrere Fotos pro Punkt |
| 3 | Foto einer Kategorie/„Punkt" zuordnen | Feste, konfigurierbare Punkteliste (z. B. Heizraum, Zähler, Schornstein …) |
| 4 | Notiz/Text je Punkt | Textfeld pro Kategorie/Foto |
| 5 | Zwischenspeichern (Entwurf) | Lokale Speicherung, Weiterarbeiten möglich |
| 6 | Auftrag absenden | Upload aller Fotos + Daten an Airtable |
| 7 | Auto-Einsortierung in Airtable | Über die passende Airtable-Tabellen-/Feldstruktur |
| 8 | Offline-Betrieb | Sync-Queue: sendet automatisch nach, sobald online |
| 9 | Status / Bestätigung | Sichtbar, welche Aufträge gesendet/ausstehend sind |

> Die **genaue Punkteliste** und die **Airtable-Feldstruktur** übernehme ich
> 1:1 aus dem bestehenden NuOS (siehe Abschnitt 9).

---

## 5. Airtable-Anbindung

- Anbindung über die **Airtable REST-API** (bzw. Web-API mit Personal Access
  Token — Airtable hat die alten API-Keys abgelöst).
- Der **API-Token darf nicht fest in die App** (er läge sonst offen im
  App-Paket). Empfohlen: ein kleiner **Vermittler-Dienst** (Proxy/Serverless-
  Funktion), der den Token sicher hält und die Uploads an Airtable weiterreicht.
  Alternativ, wenn es schnell gehen soll: Token pro Gerät gesichert hinterlegen
  — mit dem Hinweis auf das höhere Risiko.
- **Fotos**: Airtable-Anhänge werden über URLs referenziert. Wir laden Bilder
  daher zunächst in einen Speicher (z. B. den Proxy-Dienst / Cloud-Storage) und
  hängen sie dann an den Airtable-Datensatz. Diesen Ablauf klären wir anhand der
  heutigen NuOS-Logik.

---

## 6. Datenfluss (vereinfacht)

```
[iPhone/Android App]
   |  Foto + Notiz + Auftragsdaten (lokal gespeichert)
   v
[Lokale Sync-Queue]  --- offline? wartet ---
   |  sobald online
   v
[Sicherer Vermittler-Dienst / Proxy]  (hält Airtable-Token)
   |
   v
[Airtable]  --> sortiert sich automatisch in die richtige Struktur
```

---

## 7. Roadmap in Phasen

### Phase 0 — Grundlagen klären *(als Nächstes)*
- Android-Quellcode ins Repo laden **oder** technischen Aufbau beschreiben
- Airtable-Struktur (Tabellen, Felder, Punkteliste) dokumentieren
- Zugänge klären (Apple Developer Account, Airtable-Token)

### Phase 1 — Projekt-Gerüst
- React-Native/Expo-Projekt aufsetzen, läuft leer auf iOS + Android
- Navigation, Grundlayout im NuOS-Look

### Phase 2 — Kernfunktionen
- Auftrag anlegen, Kamera, Foto-zu-Punkt-Zuordnung, Notizen
- Lokale Speicherung (Entwürfe)

### Phase 3 — Airtable-Sync
- Vermittler-Dienst + Upload-Logik
- Offline-Queue mit automatischem Nachsenden

### Phase 4 — Test & Feinschliff
- Test auf echten iPhones (über TestFlight)
- Abgleich 1:1 mit NuOS-Ablauf

### Phase 5 — Launch
- Store-Assets (Icon, Screenshots, Beschreibung)
- Einreichung bei Apple (App Store) — **braucht euren Apple-Developer-Account**
- Optional: Android-Version aus derselben Codebasis mitliefern

---

## 8. Kosten & Accounts (einmalig zu klären)

| Posten | Wer | Hinweis |
|---|---|---|
| **Apple Developer Program** | Ebersbach | 99 $ / Jahr — Pflicht für iOS-Veröffentlichung |
| **Expo/EAS** | Ebersbach | kostenloser Tarif reicht zum Start; Cloud-Builds ggf. kostenpflichtig bei viel Nutzung |
| **Airtable** | vorhanden | bestehender Account + Personal Access Token |
| **Vermittler-Dienst** | tbd | geringe/keine Kosten bei kleinem Volumen (Serverless) |

---

## 9. Was ich als Nächstes von dir brauche

Damit aus dem Konzept echter Code wird, brauche ich von dir:

1. **Den Android-Quellcode von NuOS** — ins Repo laden oder mir sagen, wo er
   liegt. Wichtig zu wissen: Womit ist NuOS gebaut? (z. B. Kotlin/Java nativ,
   Flutter, React Native, oder eine No-Code-Plattform wie FlutterFlow/AppSheet?)
2. **Die Airtable-Struktur**: Screenshot oder Export der Tabelle(n) + welche
   Felder befüllt werden.
3. **Die Punkteliste**: nach welchen Punkten/Kategorien werden die Fotos heute
   sortiert?
4. **Screenshots von NuOS** (jeder Bildschirm), damit ich Look & Ablauf treffe.
5. Info, ob ihr schon einen **Apple-Developer-Account** habt.

---

## 10. Offene Fragen

- Ist NuOS nativ (Kotlin/Java), Flutter, React Native — oder auf einer
  No-Code-Plattform gebaut? *(entscheidet, ob echter „Port" oder Nachbau)*
- Sollen bestehende Android-Nutzer später auf die neue App umziehen, oder läuft
  die alte Android-App parallel weiter?
- Braucht es Nutzer-Login / mehrere Monteure mit eigenen Zugängen?
- Müssen alte Aufträge migriert werden, oder startet iOS „frisch"?
