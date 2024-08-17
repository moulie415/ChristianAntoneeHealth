import React from 'react';
import {View} from 'react-native';
import {PurchasesPackage} from 'react-native-purchases';

import colors from '../../constants/colors';
import SelectableButton from './SelectableButton';
import Text from './Text';

const monthlyPrice = (p: PurchasesPackage) => {
  switch (p.product.identifier) {
    case 'yearly':
    case 'yearly:p1y':
      return p.product.price / 12;
    default:
      return p.product.price;
  }
};

const getPackageStrings = (p: PurchasesPackage) => {
  switch (p.product.identifier) {
    case 'monthly':
    case 'monthly:p1m':
      return {title: 'Premium', alt: 'month'};
    case 'monthly_plus':
    case 'monthly:monthly-plus':
      return {title: 'Premium Plus', alt: 'year'};
  }
};

const PremiumProduct: React.FC<{
  p: PurchasesPackage;
  selected: boolean;
  setSelected: (id: string) => void;
}> = ({p, selected, setSelected}) => {
  const packageStrings = getPackageStrings(p);
  const title = packageStrings?.title;
  return (
    <SelectableButton
      text={(title || '').toUpperCase()}
      secondaryText="Monthly"
      selected={selected}
      style={{marginHorizontal: 20, marginTop: 10}}
      onPress={async () => setSelected(p.identifier)}
      customRight={
        <View>
          <Text
            style={{
              color: colors.appWhite,
              fontSize: 14,
              fontWeight: 'bold',
              textAlign: 'right',
            }}>
            {p.product.priceString}
          </Text>
          <Text
            style={{
              color: colors.appWhite,
              marginTop: 10,
              fontSize: 12,
              textAlign: 'right',
            }}>{`${p.product.priceString[0]}${monthlyPrice(p).toFixed(
            2,
          )} / month`}</Text>
        </View>
      }
    />
  );
};

export default PremiumProduct;
