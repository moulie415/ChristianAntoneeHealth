package com.healthandmovement

import android.content.Context
import androidx.work.Worker
import androidx.work.WorkerParameters
import com.google.android.gms.common.GoogleApiAvailability
import com.google.android.gms.common.GooglePlayServicesNotAvailableException
import com.google.android.gms.common.GooglePlayServicesRepairableException
import com.google.android.gms.security.ProviderInstaller

/**
 * Sample patch Worker using {@link ProviderInstaller}.
 */
class PatchWorker(appContext: Context, workerParams: WorkerParameters): Worker(appContext, workerParams) {

    override fun doWork(): Result {
        try {
            ProviderInstaller.installIfNeeded(applicationContext)
        } catch (e: GooglePlayServicesRepairableException) {

            // Indicates that Google Play services is out of date, disabled, etc.

            // Prompt the user to install/update/enable Google Play services.
            GoogleApiAvailability.getInstance()
                    .showErrorNotification(applicationContext, e.connectionStatusCode)

            // Notify the WorkManager that a soft error occurred.
            return Result.failure()

        } catch (e: GooglePlayServicesNotAvailableException) {
            // Indicates a non-recoverable error; the ProviderInstaller can't
            // install an up-to-date Provider.

            // Notify the WorkManager that a hard error occurred.
            return Result.failure()
        }


        // If this is reached, you know that the provider was already up to date
        // or was successfully updated.
        return Result.success()
    }
}