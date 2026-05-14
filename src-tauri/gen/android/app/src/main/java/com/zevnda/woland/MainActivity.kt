package com.zevnda.woland

import android.content.ContentValues
import android.graphics.Color
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Environment
import android.provider.MediaStore
import android.view.KeyEvent
import android.webkit.JavascriptInterface
import android.webkit.WebView
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import androidx.core.view.WindowInsetsControllerCompat

class NavBarBridge(
    private val activity: MainActivity,
) {
    @JavascriptInterface
    fun setColor(
        color: String,
        isLight: Boolean,
    ) {
        activity.runOnUiThread {
            activity.window.navigationBarColor = Color.parseColor(color)
            val controller = WindowInsetsControllerCompat(activity.window, activity.window.decorView)
            controller.isAppearanceLightNavigationBars = isLight
        }
    }
}

class FilesBridge(private val activity: MainActivity) {
    var importedJsonData: String = ""

    @Suppress("NewApi")
    @JavascriptInterface
    fun exportDevices(json: String): String {
        return try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                val resolver = activity.contentResolver
                val selection = "${MediaStore.Downloads.DISPLAY_NAME} = ?"
                val cursor = resolver.query(
                    MediaStore.Downloads.EXTERNAL_CONTENT_URI,
                    arrayOf(MediaStore.Downloads._ID),
                    selection,
                    arrayOf("woland_devices.json"),
                    null,
                )
                cursor?.use {
                    while (it.moveToNext()) {
                        val id = it.getLong(it.getColumnIndexOrThrow(MediaStore.Downloads._ID))
                        resolver.delete(
                            Uri.withAppendedPath(MediaStore.Downloads.EXTERNAL_CONTENT_URI, id.toString()),
                            null,
                            null,
                        )
                    }
                }
                val values = ContentValues().apply {
                    put(MediaStore.Downloads.DISPLAY_NAME, "woland_devices.json")
                    put(MediaStore.Downloads.MIME_TYPE, "application/json")
                    put(MediaStore.Downloads.IS_PENDING, 1)
                }
                val uri = resolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values)
                    ?: return "error: failed to create file"
                resolver.openOutputStream(uri)?.use { it.write(json.toByteArray()) }
                values.clear()
                values.put(MediaStore.Downloads.IS_PENDING, 0)
                resolver.update(uri, values, null, null)
                "success"
            } else {
                @Suppress("DEPRECATION")
                val dir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS)
                dir.mkdirs()
                java.io.File(dir, "woland_devices.json").writeText(json)
                "success"
            }
        } catch (e: Exception) {
            "error: ${e.message}"
        }
    }

    @JavascriptInterface
    fun importDevices() {
        activity.launchFilePicker()
    }

    @JavascriptInterface
    fun getImportedJson(): String = importedJsonData
}

class MainActivity : TauriActivity() {
    private lateinit var wv: WebView
    private val filesBridge = FilesBridge(this)

    companion object {
        private var coldStartCompleted = false
    }

    private val filePickerLauncher = registerForActivityResult(
        ActivityResultContracts.OpenDocument(),
    ) { uri: Uri? ->
        if (uri != null) {
            try {
                val stream = contentResolver.openInputStream(uri)
                filesBridge.importedJsonData = stream?.bufferedReader()?.readText() ?: ""
                stream?.close()
            } catch (_: Exception) {
                filesBridge.importedJsonData = ""
            }
        } else {
            filesBridge.importedJsonData = ""
        }
        if (::wv.isInitialized) {
            wv.post {
                wv.evaluateJavascript("if(window.__onDevicesImported)window.__onDevicesImported()", null)
            }
        }
    }

    fun launchFilePicker() {
        filePickerLauncher.launch(arrayOf("application/json", "text/plain", "*/*"))
    }

    override fun onWebViewCreate(webView: WebView) {
        wv = webView
        wv.addJavascriptInterface(NavBarBridge(this), "NavBarBridge")
        wv.addJavascriptInterface(filesBridge, "FilesBridge")
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        if (!coldStartCompleted) {
            installSplashScreen().setKeepOnScreenCondition { false }
            coldStartCompleted = true
        } else {
            setTheme(R.style.Theme_woland)
        }

        enableEdgeToEdge()
        super.onCreate(savedInstanceState)

        window.setBackgroundDrawable(
            android.graphics.drawable.ColorDrawable(
                android.graphics.Color.parseColor("#fafafa"),
            ),
        )

        window.statusBarColor = Color.TRANSPARENT
        window.navigationBarColor = Color.parseColor("#fafafa")

        val controller = WindowInsetsControllerCompat(window, window.decorView)
        controller.isAppearanceLightStatusBars = false
        controller.isAppearanceLightNavigationBars = true
    }

    override fun onKeyDown(
        keyCode: Int,
        event: KeyEvent?,
    ): Boolean {
        if (keyCode == KeyEvent.KEYCODE_BACK) {
            wv.evaluateJavascript(
                """
                (function() {
                    try {
                        var e = new Event('android-back', { cancelable: true });
                        window.dispatchEvent(e);
                        return e.defaultPrevented ? 'handled' : 'unhandled';
                    } catch(_) {
                        return 'unhandled';
                    }
                })()
                """.trimIndent(),
            ) { result ->
                if (result == "\"unhandled\"") {
                    moveTaskToBack(true)
                }
            }
            return true
        }
        return super.onKeyDown(keyCode, event)
    }
}
