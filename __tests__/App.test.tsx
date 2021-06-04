/**
 * @format
 */

import 'react-native';
import React from 'react';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import {TouchableOpacity, Text} from 'react-native';

test('renders correctly', () => {
  renderer.create(
    <TouchableOpacity>
      <Text>Test</Text>
    </TouchableOpacity>,
  );
});
