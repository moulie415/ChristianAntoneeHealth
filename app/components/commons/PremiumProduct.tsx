import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import React from 'react';
import { View } from 'react-native';
import { PurchasesPackage } from 'react-native-purchases';
import colors from '../../constants/colors';
import SelectableButton from './SelectableButton';
import Text from './Text';

const monthlyPrice = (p: PurchasesPackage) => {
  switch (p.product.identifier) {
    case 'yearly':
    case 'yearly:p1y':
    case 'premium_yearly':
    case 'monthly:premium-yearly':
      return p.product.price / 12;
    default:
      return p.product.price;
  }
};

const getPackageStrings = (p: PurchasesPackage) => {
  switch (p.product.identifier) {
    case 'monthly':
    case 'monthly:p1m':
      return { title: 'Premium', secondary: 'Monthly' };
    case 'premium_yearly':
    case 'monthly:premium-yearly':
      return { title: 'Premium', secondary: 'Yearly', bestValue: true };
    case 'monthly_plus':
    case 'monthly:monthly-plus':
      return { title: 'Premium Plus', secondary: 'Monthly' };
  }
};

const PremiumProduct: React.FC<{
  p: PurchasesPackage;
  selected: boolean;
  setSelected: (id: string) => void;
}> = ({ p, selected, setSelected }) => {
  const packageStrings = getPackageStrings(p);
  const title = packageStrings?.title;
  return (
    <SelectableButton
      text={(title || '').toUpperCase()}
      secondaryText={
        packageStrings?.bestValue ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              marginTop: 10,
            }}
          >
            <Text
              style={{
                color: colors.offWhite,
                fontSize: 12,
              }}
            >
              {packageStrings?.secondary}
            </Text>
            <View
              style={{
                backgroundColor: colors.appBlue,
                padding: 5,
                borderRadius: 20,
                marginLeft: 5,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: -4,
              }}
            >
              <FontAwesome6
                iconStyle="solid"
                name="star"
                size={10}
                color={colors.appWhite}
              />
              <Text
                style={{
                  color: colors.appWhite,
                  fontSize: 10,
                  marginLeft: 3,
                  fontWeight: 'bold',
                }}
              >
                BEST VALUE
              </Text>
            </View>
          </View>
        ) : (
          packageStrings?.secondary
        )
      }
      selected={selected}
      style={{ marginHorizontal: 20, marginTop: 10 }}
      onPress={async () => setSelected(p.identifier)}
      customRight={
        <View>
          <Text
            style={{
              color: colors.appWhite,
              fontSize: 14,
              fontWeight: 'bold',
              textAlign: 'right',
            }}
          >
            {p.product.priceString}
          </Text>
          <Text
            style={{
              color: colors.appWhite,
              marginTop: 10,
              fontSize: 12,
              textAlign: 'right',
            }}
          >{`${p.product.priceString[0]}${monthlyPrice(p).toFixed(
            2,
          )} / month`}</Text>
        </View>
      }
    />
  );
};

export default PremiumProduct;
