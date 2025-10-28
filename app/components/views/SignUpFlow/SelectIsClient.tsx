import React from 'react';
import { Dimensions } from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import colors from '../../../constants/colors';
import SelectableButton from '../../commons/SelectableButton';
import Text from '../../commons/Text';

const { width } = Dimensions.get('window');

const CELL_SIZE = width / 8;

const CELL_COUNT = 6;

const SelectIsClient: React.FC<{
  client: boolean;
  setIsClient: (client: boolean) => void;
  clientCode: string;
  setClientCode: (code: string) => void;
  onSubmitCode: (code: string) => void;
}> = ({ client, setIsClient, clientCode, setClientCode, onSubmitCode }) => {
  const ref = useBlurOnFulfill({ value: clientCode, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: clientCode,
    setValue: setClientCode,
  });

  return (
    <KeyboardAwareScrollView
      
      contentContainerStyle={{
        marginHorizontal: 20,
        marginTop: 20,
        paddingBottom: 150,
      }}
      style={{ flex: 1 }}
    >
      <Text
        style={{
          marginBottom: 20,
          fontSize: 24,
          color: colors.appWhite,
          fontWeight: 'bold',
        }}
      >
        Are you a client of Christian's?
      </Text>
      <SelectableButton
        text="No"
        style={{ marginBottom: 20 }}
        selected={!client}
        onPress={() => setIsClient(false)}
      />
      <SelectableButton
        text="Yes"
        style={{ marginBottom: 20 }}
        selected={client}
        onPress={() => setIsClient(true)}
      />

      {client && (
        <>
          <Text
            style={{
              color: colors.appWhite,
              fontWeight: 'bold',
              padding: 10,
              paddingHorizontal: 5,
            }}
          >
            Please enter client code:
          </Text>
          <CodeField
            ref={ref}
            {...props}
            cellCount={CELL_COUNT}
            value={clientCode}
            onChangeText={code => {
              setClientCode(code);
              if (code.length === CELL_COUNT) {
                onSubmitCode(code);
              }
            }}
            keyboardType="number-pad"
            renderCell={({ index, symbol, isFocused }) => (
              <Text
                key={index}
                style={{
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  lineHeight: 45,
                  fontSize: 24,
                  borderRadius: 12,
                  color: colors.appWhite,
                  backgroundColor: colors.inputBackground,
                  overflow: 'hidden',
                  borderWidth: 1,
                  borderColor: isFocused ? colors.appBlue : colors.borderColor,
                  textAlign: 'center',
                }}
                onLayout={getCellOnLayoutHandler(index)}
              >
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            )}
          />
        </>
      )}
    </KeyboardAwareScrollView>
  );
};

export default SelectIsClient;
