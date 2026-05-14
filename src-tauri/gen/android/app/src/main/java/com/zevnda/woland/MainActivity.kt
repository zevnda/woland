package com.zevnda.woland

import android.graphics.Color
import android.os.Bundle
import android.view.KeyEvent
import android.webkit.JavascriptInterface
import android.webkit.WebView
import androidx.activity.enableEdgeToEdge
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

class MainActivity : TauriActivity() {
    private lateinit var wv: WebView

    override fun onWebViewCreate(webView: WebView) {
        wv = webView
        wv.addJavascriptInterface(NavBarBridge(this), "NavBarBridge")
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        val splashScreen = installSplashScreen()
        splashScreen.setKeepOnScreenCondition { false }

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
                    finish()
                }
            }
            return true
        }
        return super.onKeyDown(keyCode, event)
    }
}
