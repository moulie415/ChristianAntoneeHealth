import React, {FunctionComponent, useState} from 'react';
import {Text, ScrollView} from 'react-native';
import {
  DataTable,
  Surface,
  Title,
  TextInput,
  Subheading,
} from '@ui-kitten/components';
import {MyRootState} from '../../types/Shared';
import {connect} from 'react-redux';
import TestResultProps from '../../types/views/TestResult';
import styles from '../../styles/views/TestResult';

const TestResult: FunctionComponent<TestResultProps> = ({route, tests}) => {
  const [text, setText] = useState('');
  const [page, setPage] = useState(0);
  const [pageWomen, setPageWomen] = useState(0);
  const {id} = route.params;
  const {scores} = tests[id];
  const tableKeyOrder = [
    ['60-64', '65-69', '70-74'],
    ['75-79', '80-84', '85-89'],
    ['90-94'],
  ];
  return (
    <ScrollView style={{backgroundColor: '#fff'}}>
      <Text />
      {scores && (
        <>
          <Title style={{margin: 20}}>What was your score?</Title>
          <TextInput
            style={{margin: 20}}
            label="Score"
            placeholder="Enter here"
            keyboardType="numeric"
            mode="outlined"
            value={text}
            onChangeText={val => setText(val)}
            returnKeyType="done"
          />

          <Subheading style={{paddingHorizontal: 20, textAlign: 'center'}}>
            Lets see how you're doing compared to others in your age range
          </Subheading>
          <Subheading style={{margin: 20}}>Men</Subheading>
          <Surface style={styles.surface}>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Age range</DataTable.Title>
                {tableKeyOrder[page].map(key => {
                  return <DataTable.Title>{key}</DataTable.Title>;
                })}
              </DataTable.Header>

              <DataTable.Row>
                <DataTable.Cell>Score</DataTable.Cell>
                {tableKeyOrder[page].map(key => {
                  return <DataTable.Cell>{scores.men[key]}</DataTable.Cell>;
                })}
              </DataTable.Row>

              <DataTable.Pagination
                page={page}
                numberOfPages={3}
                onPageChange={val => setPage(val)}
                label={`${page + 1} of 3`}
              />
            </DataTable>
          </Surface>
          <Subheading style={{margin: 20}}>Women</Subheading>
          <Surface style={styles.surface}>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Age range</DataTable.Title>
                {tableKeyOrder[pageWomen].map(key => {
                  return <DataTable.Title>{key}</DataTable.Title>;
                })}
              </DataTable.Header>

              <DataTable.Row>
                <DataTable.Cell>Score</DataTable.Cell>
                {tableKeyOrder[pageWomen].map(key => {
                  return <DataTable.Cell>{scores.women[key]}</DataTable.Cell>;
                })}
              </DataTable.Row>

              <DataTable.Pagination
                page={pageWomen}
                numberOfPages={3}
                onPageChange={val => setPageWomen(val)}
                label={`${pageWomen + 1} of 3`}
              />
            </DataTable>
          </Surface>
        </>
      )}
    </ScrollView>
  );
};

const mapStateToProps = ({tests}: MyRootState) => ({
  tests: tests.tests,
});

export default connect(mapStateToProps)(TestResult);
