package com.healthandmovement

import android.os.Bundle
import androidx.work.OneTimeWorkRequest
import androidx.work.WorkManager
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import org.devio.rn.splashscreen.SplashScreen
import dev.matinzd.healthconnect.permissions.HealthConnectPermissionDelegate


class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "ChristianAntoneeHealth"


   override fun onCreate(savedInstanceState: Bundle?) {
       SplashScreen.show(this)
       super.onCreate(null)
       // Instantiate PatchWorker
       val patchWorker = OneTimeWorkRequest.Builder(PatchWorker::class.java).build()
       // Enqueue the worker
       WorkManager.getInstance(applicationContext).enqueue(patchWorker)
       HealthConnectPermissionDelegate.setPermissionDelegate(this)
   }


  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
