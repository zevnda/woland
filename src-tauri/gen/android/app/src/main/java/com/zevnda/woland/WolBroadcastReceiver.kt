package com.zevnda.woland

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
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

    Thread {
      try {
        val macBytes = mac.split(":", "-").map { it.toInt(16).toByte() }.toByteArray()
        val packet = ByteArray(6) { 0xFF.toByte() } + (0 until 16).flatMap { macBytes.toList() }.toByteArray()
        val socket = DatagramSocket()
        socket.broadcast = true
        socket.send(DatagramPacket(packet, packet.size, InetAddress.getByName(ip), port))
        socket.close()
      } catch (e: Exception) {
        e.printStackTrace()
      }
    }.start()
  }
}