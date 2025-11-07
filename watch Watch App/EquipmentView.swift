//
//  EquipmentView.swift
//  watch Watch App
//
//  Created by Henry Moule on 06/11/2025.
//

import SwiftUI

struct EquipmentView: View {
    var body: some View {
//        Text("Hello, World!")
//            .padding()
//      List(1..<51) {
//          Text("\($0)")
//      }
//      .listStyle(.carousel)
      VStack {
        Image("logo")
          .resizable()
          .scaledToFit()

        Button(
          action: {

          },
          label: {
            Text("Start workout")
          }
        )
        .background(
            RoundedRectangle(cornerRadius: 50, style: .continuous).fill(Color("appBlue"))
        )
        .padding(.vertical)
      }

    }
}
