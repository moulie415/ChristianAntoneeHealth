import React from 'react';
import Multi from 'react-native-multiple-select';
import colors from '../../constants/colors';

export interface MultiSelectItem {
  id: string;
  name: string;
}

const MultiSelect: React.FC<{
  items: MultiSelectItem[];
  selectedItems: string[];
  selectText: string;
  onSelectedItemsChange: (items: string[]) => void;
}> = ({items, selectedItems, onSelectedItemsChange, selectText}) => {
  return (
    <Multi
      items={items}
      hideDropdown
      hideSubmitButton
      uniqueKey="id"
      fixedHeight
      onSelectedItemsChange={onSelectedItemsChange}
      selectedItems={selectedItems}
      styleDropdownMenu={{marginVertical: 10, marginBottom: 20}}
      styleIndicator={{fontSize: 18}}
      styleInputGroup={{
        backgroundColor: colors.tile,
        height: 60,
        borderRadius: 12,
      }}
      styleMainWrapper={{
        backgroundColor: colors.appGrey,
        margin: 10,
      }}
      styleRowList={{
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: colors.borderColor,
      }}
      styleItemsContainer={{
        backgroundColor: colors.tile,
        borderRadius: 12,
        overflow: 'hidden',
        marginVertical: 10,
      }}
      styleDropdownMenuSubsection={{
        backgroundColor: colors.tile,
        borderBottomWidth: 0,
        height: 60,
        borderRadius: 12,
      }}
      styleTextDropdownSelected={{fontWeight: 'bold', paddingHorizontal: 10}}
      styleTextDropdown={{fontWeight: 'bold', paddingHorizontal: 10}}
      tagBorderColor={colors.borderColor}
      textColor={colors.appWhite}
      tagTextColor={colors.appWhite}
      itemTextColor={colors.appWhite}
      tagRemoveIconColor={colors.appRed}
      selectedItemTextColor={colors.appBlue}
      selectedItemIconColor={colors.appBlue}
      selectText={selectText}
    />
  );
};

export default MultiSelect;
