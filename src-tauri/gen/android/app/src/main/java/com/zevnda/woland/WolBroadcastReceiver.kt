package com.zevnda.woland

import android.appwidget.AppWidgetManager
import android.content.BroadcastReceiver
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.os.Handler
import android.os.Looper
import android.widget.Toast
import java.net.DatagramPacket
import java.net.DatagramSocket
import java.net.InetAddress

class WolBroadcastReceiver : BroadcastReceiver() {
    override fun onReceive(
        context: Context,
        intent: Intent,
    ) {
        val mac = intent.getStringExtra("device_mac") ?: return
        val ip = intent.getStringExtra("device_ip") ?: return
        val port = intent.getStringExtra("device_port")?.toIntOrNull() ?: 9
        val deviceId = intent.getStringExtra("device_id") ?: return

        val appContext = context.applicationContext
        val pendingResult = goAsync()

        appContext
            .getSharedPreferences("widget_state", Context.MODE_PRIVATE)
            .edit()
            .putString("pressed_device_id", deviceId)
            .putLong("pressed_at", System.currentTimeMillis())
            .apply()
        notifyWidgets(appContext)

        Handler(Looper.getMainLooper()).postDelayed({
            appContext
                .getSharedPreferences("widget_state", Context.MODE_PRIVATE)
                .edit()
                .remove("pressed_device_id")
                .remove("pressed_at")
                .apply()
            notifyWidgets(appContext)
        }, 2500)

        Thread {
            try {
                val macBytes = mac.split(":", "-").map { it.toInt(16).toByte() }.toByteArray()
                val packet = ByteArray(6) { 0xFF.toByte() } + (0 until 16).flatMap { macBytes.toList() }.toByteArray()
                val socket = DatagramSocket()
                socket.broadcast = true
                socket.send(DatagramPacket(packet, packet.size, InetAddress.getByName(ip), port))
                socket.close()
                Handler(Looper.getMainLooper()).post {
                    Toast.makeText(appContext, "Wake packet sent!", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                e.printStackTrace()
                Handler(Looper.getMainLooper()).post {
                    Toast.makeText(appContext, "Failed to send packet", Toast.LENGTH_SHORT).show()
                }
            } finally {
                pendingResult.finish()
            }
        }.start()
    }

    private fun notifyWidgets(context: Context) {
        val manager = AppWidgetManager.getInstance(context)
        listOf(
            ComponentName(context, WolWidget1x1::class.java),
            ComponentName(context, WolWidget3x1::class.java),
            ComponentName(context, WolWidget5x1::class.java),
        ).forEach { component ->
            val ids = manager.getAppWidgetIds(component)
            if (ids.isNotEmpty()) manager.notifyAppWidgetViewDataChanged(ids, R.id.widget_grid)
        }
    }
}
