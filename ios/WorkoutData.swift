//
//  WorkoutData.swift
//  HealthAndMovement
//
//  Created by Henry Moule on 30/07/2024.
//

import Foundation
import HealthKit


struct CodableQuantitySample: Codable {
    let value: Double
    let startDate: String
    let endDate: String

    init(from sample: HKQuantitySample) {
        let formatter = ISO8601DateFormatter()
        self.startDate = formatter.string(from: sample.startDate)
        self.endDate = formatter.string(from: sample.endDate)

        switch sample.quantityType {
        case HKQuantityType.quantityType(forIdentifier: .heartRate):
            self.value = sample.quantity.doubleValue(for: HKUnit(from: "count/min"))
        case HKQuantityType.quantityType(forIdentifier: .activeEnergyBurned):
            self.value = sample.quantity.doubleValue(for: .kilocalorie())
        default:
            self.value = sample.quantity.doubleValue(for: HKUnit.count())
        }
    }
}

struct WorkoutData: Codable {
    var heartRateSamples: [CodableQuantitySample]
    var energySamples: [CodableQuantitySample]
}
