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

        // enableEdgeToEdge()
        super.onCreate(savedInstanceState)

        // Set window background to your app color to hide the flash
        window.setBackgroundDrawable(android.graphics.drawable.ColorDrawable(
        android.graphics.Color.parseColor("#0c0c0f")
    ))

        window.statusBarColor = Color.parseColor("#0c0c0f")
        window.navigationBarColor = Color.parseColor("#0c0c0f")
        val controller = WindowInsetsControllerCompat(window, window.decorView)
        controller.isAppearanceLightStatusBars = false
        controller.isAppearanceLightNavigationBars = false
    }
}