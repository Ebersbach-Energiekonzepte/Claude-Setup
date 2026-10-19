import { Asset } from "expo-asset";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import WebView, { WebViewMessageEvent } from "react-native-webview";

const LOCAL_ORIGIN = "https://sd-planer.local";
const HTML_ASSET = require("./assets/SD-Planer.html");

type BridgeMessage =
  | { type: "export"; filename: string; data: unknown }
  | { type: "import" }
  | { type: "print"; html: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseBridgeMessage(raw: string): BridgeMessage {
  const value: unknown = JSON.parse(raw);
  if (!isRecord(value) || typeof value.type !== "string") {
    throw new Error("Unbekannte Nachricht aus der Aufnahme-App.");
  }

  if (
    value.type === "export" &&
    typeof value.filename === "string" &&
    isRecord(value.data)
  ) {
    return { type: "export", filename: value.filename, data: value.data };
  }

  if (value.type === "import") {
    return { type: "import" };
  }

  if (value.type === "print" && typeof value.html === "string") {
    return { type: "print", html: value.html };
  }

  throw new Error("Die Aufnahme-App hat eine ungültige Nachricht gesendet.");
}

function AppContent() {
  const webView = useRef<WebView>(null);
  const [html, setHtml] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadApp() {
      try {
        const asset = Asset.fromModule(HTML_ASSET);
        await asset.downloadAsync();
        if (!asset.localUri) {
          throw new Error("Die App-Datei konnte nicht geladen werden.");
        }

        const content = await FileSystem.readAsStringAsync(asset.localUri);
        if (mounted) setHtml(content);
      } catch (error) {
        console.error("SD-Planer konnte nicht gestartet werden.", error);
        if (mounted) {
          setLoadError(
            "Die App konnte nicht gestartet werden. Bitte schließe sie und öffne sie erneut.",
          );
        }
      }
    }

    void loadApp();
    return () => {
      mounted = false;
    };
  }, []);

  async function importProject() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
        copyToCacheDirectory: true,
        multiple: false,
      });
      if (result.canceled) return;

      const serialized = await FileSystem.readAsStringAsync(
        result.assets[0].uri,
      );
      webView.current?.injectJavaScript(
        `window.__sdPlanerImport(${JSON.stringify(serialized)}); true;`,
      );
    } catch (error) {
      console.error("Aufnahme konnte nicht importiert werden.", error);
      Alert.alert(
        "Import fehlgeschlagen",
        "Die Datei konnte nicht geöffnet werden. Bitte wähle eine SD-Planer-Sicherungsdatei.",
      );
    }
  }

  async function exportProject(message: Extract<BridgeMessage, { type: "export" }>) {
    try {
      const directory = FileSystem.cacheDirectory;
      if (!directory) throw new Error("Kein lokaler Speicher verfügbar.");

      const filename =
        message.filename.replace(/[\\/:*?"<>|]/g, "-") || "aufnahme.json";
      const uri = `${directory}${filename}`;
      await FileSystem.writeAsStringAsync(
        uri,
        JSON.stringify(message.data),
        { encoding: FileSystem.EncodingType.UTF8 },
      );

      if (!(await Sharing.isAvailableAsync())) {
        throw new Error("Das Teilen von Dateien ist auf diesem Gerät nicht verfügbar.");
      }

      await Sharing.shareAsync(uri, {
        dialogTitle: "SD-Planer-Aufnahme exportieren",
        mimeType: "application/json",
        UTI: "public.json",
      });
    } catch (error) {
      console.error("Aufnahme konnte nicht exportiert werden.", error);
      Alert.alert(
        "Export fehlgeschlagen",
        "Die Aufnahme konnte nicht geteilt werden. Bitte prüfe den freien Speicherplatz und versuche es erneut.",
      );
    }
  }

  async function printReport(html: string) {
    try {
      const { uri } = await Print.printToFileAsync({ html });
      if (!(await Sharing.isAvailableAsync())) {
        throw new Error("Das Teilen von Dateien ist auf diesem Gerät nicht verfügbar.");
      }

      await Sharing.shareAsync(uri, {
        dialogTitle: "SD-Planer-Bericht als PDF teilen",
        mimeType: "application/pdf",
        UTI: "com.adobe.pdf",
      });
    } catch (error) {
      console.error("PDF-Bericht konnte nicht erstellt oder geteilt werden.", error);
      Alert.alert(
        "PDF-Erstellung fehlgeschlagen",
        "Der Bericht konnte nicht als PDF erstellt oder geteilt werden. Bitte versuche es erneut.",
      );
    }
  }

  async function handleMessage(event: WebViewMessageEvent) {
    try {
      const message = parseBridgeMessage(event.nativeEvent.data);
      if (message.type === "import") {
        await importProject();
      } else if (message.type === "export") {
        await exportProject(message);
      } else {
        await printReport(message.html);
      }
    } catch (error) {
      console.error("Ungültige Nachricht aus der Aufnahme-App.", error);
      Alert.alert(
        "Aktion nicht möglich",
        "Die Anfrage aus der Aufnahme-App konnte nicht verarbeitet werden.",
      );
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "right", "bottom", "left"]}>
      <StatusBar style="dark" />
      {loadError ? (
        <View style={styles.message}>
          <Text style={styles.messageText}>{loadError}</Text>
        </View>
      ) : html ? (
        <WebView
          ref={webView}
          style={styles.webView}
          source={{ html, baseUrl: LOCAL_ORIGIN }}
          originWhitelist={[LOCAL_ORIGIN]}
          javaScriptEnabled
          domStorageEnabled
          onMessage={handleMessage}
          onRenderProcessGone={() =>
            setLoadError("Die App wurde unerwartet beendet. Bitte öffne sie erneut.")
          }
          onError={(event) => {
            console.error("Fehler beim Anzeigen der App.", event.nativeEvent);
            setLoadError("Die App konnte nicht angezeigt werden. Bitte öffne sie erneut.");
          }}
          startInLoadingState
          renderLoading={() => (
            <View style={styles.message}>
              <ActivityIndicator color="#173f36" />
              <Text style={styles.loadingText}>SD-Planer wird gestartet …</Text>
            </View>
          )}
        />
      ) : (
        <View style={styles.message}>
          <ActivityIndicator color="#173f36" />
          <Text style={styles.loadingText}>SD-Planer wird gestartet …</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f3f4ee",
  },
  webView: {
    flex: 1,
    backgroundColor: "#f3f4ee",
  },
  message: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f3f4ee",
  },
  loadingText: {
    marginTop: 12,
    color: "#465249",
    fontSize: 15,
  },
  messageText: {
    color: "#465249",
    fontSize: 16,
    lineHeight: 23,
    textAlign: "center",
  },
});
