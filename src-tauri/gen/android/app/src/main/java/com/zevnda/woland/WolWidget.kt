package com.zevnda.woland

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.widget.RemoteViews
import android.widget.Toast
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.net.DatagramPacket
import java.net.DatagramSocket
import java.net.InetAddress

class WolWidget : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        for (appWidgetId in appWidgetIds) {
            updateWidget(context, appWidgetManager, appWidgetId)
        }
    }

    override fun onReceive(context: Context, intent: Intent) {
        super.onReceive(context, intent)
        if (intent.action == ACTION_WAKE) {
            sendMagicPacket(context)
        }
    }

    companion object {
        const val ACTION_WAKE = "com.zevnda.woland.ACTION_WAKE"

        // !! Change these to your PC's values !!
        const val MAC_ADDRESS = "10-FF-E0-C7-CE-75"
        const val BROADCAST_IP = "255.255.255.255"
        const val PORT = 9

        fun updateWidget(
            context: Context,
            appWidgetManager: AppWidgetManager,
            appWidgetId: Int
        ) {
            val views = RemoteViews(context.packageName, R.layout.widget_wol)

            val intent = Intent(context, WolWidget::class.java).apply {
                action = ACTION_WAKE
            }
            val pendingIntent = PendingIntent.getBroadcast(
                context, 0, intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.widget_button, pendingIntent)
            appWidgetManager.updateAppWidget(appWidgetId, views)
        }

        fun sendMagicPacket(context: Context) {
            CoroutineScope(Dispatchers.IO).launch {
                try {
                    val mac = MAC_ADDRESS.replace(":", "").replace("-", "")
                    val macBytes = ByteArray(6) {
                        mac.substring(it * 2, it * 2 + 2).toInt(16).toByte()
                    }

                    val packet = ByteArray(102)
                    // 6 bytes of 0xFF
                    repeat(6) { packet[it] = 0xFF.toByte() }
                    // 16 repetitions of MAC
                    repeat(16) { i ->
                        repeat(6) { j ->
                            packet[6 + i * 6 + j] = macBytes[j]
                        }
                    }

                    val address = InetAddress.getByName(BROADCAST_IP)
                    val socket = DatagramSocket()
                    socket.broadcast = true
                    socket.send(DatagramPacket(packet, packet.size, address, PORT))
                    socket.close()

                    // Show toast on main thread
                    android.os.Handler(android.os.Looper.getMainLooper()).post {
                        Toast.makeText(context, "Magic packet sent!", Toast.LENGTH_SHORT).show()
                    }
                } catch (e: Exception) {
                    android.os.Handler(android.os.Looper.getMainLooper()).post {
                        Toast.makeText(context, "Failed: ${e.message}", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        }
    }
}