package com.zevnda.woland

import com.zevnda.woland.R
import android.content.Context
import android.content.Intent
import android.widget.RemoteViews
import android.widget.RemoteViewsService
import org.json.JSONArray
import java.io.File

class WolWidgetService5x1 : RemoteViewsService() {
    override fun onGetViewFactory(intent: Intent) = WolRemoteViewsFactory5x1(applicationContext)
}

class WolRemoteViewsFactory5x1(private val context: Context) : RemoteViewsService.RemoteViewsFactory {
    private data class Device(val id: String, val name: String, val mac: String, val ip: String, val port: String)
    private var devices = listOf<Device>()

    override fun onCreate() { loadDevices() }
    override fun onDataSetChanged() { loadDevices() }
    override fun onDestroy() {}
    override fun getCount() = minOf(devices.size, 4)
    override fun getViewTypeCount() = 1
    override fun getItemId(position: Int) = position.toLong()
    override fun hasStableIds() = true

    private fun loadDevices() {
        try {
            val file = File("/data/user/0/${context.packageName}/devices.json")
            if (!file.exists()) return
            val json = JSONArray(file.readText())
            devices = (0 until json.length()).map { i ->
                val obj = json.getJSONObject(i)
                Device(
                    id = obj.getString("id"),
                    name = obj.getString("name"),
                    mac = obj.getString("mac"),
                    ip = obj.getString("ip"),
                    port = obj.getString("port"),
                )
            }
        } catch (e: Exception) {
            devices = listOf()
        }
    }

    override fun getViewAt(position: Int): RemoteViews {
        val device = devices[position]
        val rv = RemoteViews(context.packageName, R.layout.widget_device_cell_5x1)
        rv.setTextViewText(R.id.device_name, device.name)

        val fillIntent = Intent().apply {
            putExtra("device_mac", device.mac)
            putExtra("device_ip", device.ip)
            putExtra("device_port", device.port)
        }
        rv.setOnClickFillInIntent(R.id.device_power, fillIntent)
        return rv
    }

    override fun getLoadingView() = null
}