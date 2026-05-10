package com.zevnda.woland

import android.graphics.Color
import android.os.Bundle
import androidx.activity.enableEdgeToEdge
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import androidx.core.view.WindowInsetsControllerCompat

class MainActivity : TauriActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        val splashScreen = installSplashScreen()

        var keepSplash = true
        splashScreen.setKeepOnScreenCondition { keepSplash }
        android.os.Handler(android.os.Looper.getMainLooper()).postDelayed({
            keepSplash = false
        }, 500)

        enableEdgeToEdge()
        super.onCreate(savedInstanceState)

        window.setBackgroundDrawable(android.graphics.drawable.ColorDrawable(
            android.graphics.Color.parseColor("#fafafa")
        ))

        window.statusBarColor = Color.TRANSPARENT
        window.navigationBarColor = Color.parseColor("#fafafa")

        val controller = WindowInsetsControllerCompat(window, window.decorView)
        controller.isAppearanceLightStatusBars = true
        controller.isAppearanceLightNavigationBars = true
    }
}