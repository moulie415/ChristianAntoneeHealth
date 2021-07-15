import React from 'react';
import {View, Dimensions, ImageSourcePropType, Platform} from 'react-native';
import Carousel, {
  AdditionalParallaxProps,
  Pagination,
  ParallaxImage,
} from 'react-native-snap-carousel';
import {Button, Divider, Layout, Text} from '@ui-kitten/components';
import Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../../constants/colors';
import {viewedWelcome} from '../../actions/profile';
import {connect} from 'react-redux';
import globalStyles from '../../styles/globalStyles';

interface CarouselItem {
  title: string;
  description: string;
  image: ImageSourcePropType;
  icon: string;
}

const items: CarouselItem[] = [
  {
    title: 'Targeted Workouts',
    description:
      'Create custom workouts to target specific areas of the body and types of fitness.',
    image: require('../../images/old_man_yoga.jpeg'),
    icon: 'dumbbell',
  },
  {
    title: 'Track Progress',
    description:
      'Monitor your activity and track your fitness with your personalised activity dashboard',
    image: require('../../images/old_woman.jpeg'),
    icon: 'chart-line',
  },
  {
    title: 'Test Fitness',
    description:
      'Measure fitness across 4 key areas, and get recommendations to improve',
    image: require('../../images/woman_yoga.jpeg'),
    icon: 'heartbeat',
  },
];

const {width} = Dimensions.get('screen');
const HomeWelcome: React.FC<{setHasViewedWelcome: () => void}> = ({
  setHasViewedWelcome,
}) => {
  return (
    <Layout style={{flex: 1, marginTop: '20%'}}>
      <Carousel
        layoutCardOffset={18}
        data={items}
        sliderWidth={width}
        itemWidth={width - 50}
        hasParallaxImages
        renderItem={(
          {item, index}: {item: CarouselItem; index: number},
          parallaxProps?: AdditionalParallaxProps,
        ) => {
          return (
            <Layout
              style={[
                {
                  width: width - 50,
                  height: width,
                  backgroundColor: '#fff',
                  borderRadius: 8,
                },
                globalStyles.boxShadow,
              ]}>
              <ParallaxImage
                containerStyle={{
                  flex: 1,
                  marginBottom: Platform.select({ios: 0, android: 1}), // Prevent a random Android rendering issue
                  backgroundColor: 'white',
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                }}
                style={{resizeMode: 'cover'}}
                parallaxFactor={0.1}
                source={item.image}
                {...parallaxProps}
              />
              <Pagination activeDotIndex={index} dotsLength={items.length} />
              <Divider />
              <Layout
                style={{
                  padding: 10,
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8,
                }}>
                <Layout style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon
                    size={20}
                    name={item.icon}
                    color="#fff"
                    style={{marginRight: 10}}
                  />
                  <Text category="h4">{item.title}</Text>
                </Layout>
                <Text>{item.description}</Text>
                {index === items.length - 1 && (
                  <Button
                    onPress={setHasViewedWelcome}
                    // status="control"
                    style={{alignSelf: 'flex-end', margin: 5}}>
                    Finish
                  </Button>
                )}
              </Layout>
            </Layout>
          );
        }}
      />
    </Layout>
  );
};

const mapDispatchToProps = {
  setHasViewedWelcome: viewedWelcome,
};

export default connect(null, mapDispatchToProps)(HomeWelcome);
