package com.zevnda.woland

import com.zevnda.woland.R
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.widget.RemoteViews
import android.app.PendingIntent

class WolWidget5x1 : AppWidgetProvider() {
    override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
        appWidgetIds.forEach { updateWidget5x1(context, appWidgetManager, it) }
    }
}

fun updateWidget5x1(context: Context, appWidgetManager: AppWidgetManager, widgetId: Int) {
    val rv = RemoteViews(context.packageName, R.layout.widget_layout_5x1)

    val serviceIntent = Intent(context, WolWidgetService5x1::class.java)
    rv.setRemoteAdapter(R.id.widget_grid, serviceIntent)

    val tapIntent = Intent(context, WolBroadcastReceiver::class.java)
    val tapPending = PendingIntent.getBroadcast(
        context, 2, tapIntent,
        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_MUTABLE
    )
    rv.setPendingIntentTemplate(R.id.widget_grid, tapPending)

    appWidgetManager.updateAppWidget(widgetId, rv)
}