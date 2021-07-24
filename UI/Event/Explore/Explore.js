import React, { Component } from 'react';
import {
  FlatList,
  TextInput,
  Text,
  Image,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import NavigationRoots from '../../../Constants/NavigationRoots';
import HeaderView from '../../../Component/Header'
import colors from '../../../CommonClasses/AppColor';
import commonStyles from '../../../StyleSheet/UserStyleSheet';
import sample from '../../../assets/dummy.png';
import eventStyles from '../../../StyleSheet/EventStyleSheet';
import timeIcon from '../../../assets/timeIcon.png';
import starIcon from '../../../assets/star.png';
import heartIcon from '../../../assets/heartIcon.png';
import filterGrayIcon from '../../../assets/filterGrayIcon.png';
import sortIcon from '../../../assets/sortIcon.png';
import viewMapIcon from '../../../assets/viewMapIcon.png';

import MapView, {PROVIDER_GOOGLE} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
const origin = { latitude: 30.6225, longitude: 76.6224 };
const destination = { latitude: 30.7051, longitude: 76.68154 };
const GOOGLE_MAPS_APIKEY = 'AIzaSyBAV63gkOE0d0eSV_3rIagJfzMwDcbzPnM';

export default class Explore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedGroup: 0,
      photo: null,
      updateUI: false,
      showModal: false,
      showDropDown: false,
      categoryID: -1,
      categoryName: 'Select Category',
      showMap:false,
    }
  }
  componentDidMount() {
  }
  /*  Buttons   */

  filterBtnAction() {
    this.props.navigation.navigate(NavigationRoots.Filter);
  }
  sortBtnAction() {
    this.props.navigation.navigate(NavigationRoots.Sort);
  }
  /*  UI   */

  renderListView = () => {
    return (<View style={{margin: 5, height: '90%'}}>
      <FlatList
        data={[1,1,1,1,1,1,1,1,1,1,1,1]}
        renderItem={this.renderListCellItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index}
      />
    </View>)
  }
  renderListCellItem = ({ item, index }) => {
    return <TouchableOpacity style={styles.variantCellViewStyle}>
    <View style={{ flexDirection: 'row' }}>
      <Image style={{ width: 110, height: 130, borderRadius: 5 }} source={sample} />
      <View style={{ margin: 5 }}>
        <View style={{ margin: 5, flexDirection: 'row', alignItems: 'center' }}>
          <Image style={{ width: 15, height: 15 }} resizeMode='center' source={timeIcon} />
          <View style={{ width: 5 }} />
          <Text style={eventStyles.titleStyle}>{`10:30 AM to 10:30 PM`}</Text>
        </View>
        <View style={{ margin: 5}}>
          <Text style={{ fontSize: 14, fontWeight: '400', color: colors.AppGray }}>{'Test'}</Text>
        </View>
        <View style={{ margin: 5, flexDirection: 'row', alignItems: 'center' }}>
          <Image style={{ width: 15, height: 15 }} source={starIcon} />
          <View style={{ width: 5 }} />
          <Text style={eventStyles.subTitleStyle}>{`0.0 | 0 rating`}</Text>
        </View>
        <View style={{ margin: 5, marginTop: 15}}>
        <Text style={eventStyles.titleStyle}>{`$ 120`}</Text>
        </View>
      </View>
      <View>
        </View>
    </View>
    <View style={{ alignContent: 'center', padding: 10}}>
      <Image style={{width: 40, height: 40, marginTop: 5}} resizeMode='center' source={heartIcon} />
    </View>
  </TouchableOpacity>
  }
  renderHeaderView = () => {
    return (<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <TouchableOpacity style={styles.headerViewStyle} onPress={() => this.sortBtnAction()}>
        <Image style={{ width: 20, height: 20 }} resizeMode={'contain'} source={sortIcon} />
        <Text style={{ color: colors.AppGray, marginLeft: 10 }}>Sort</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.headerViewStyle} onPress={() => this.filterBtnAction()}>
        <Image style={{ width: 20, height: 20 }} resizeMode={'contain'} source={filterGrayIcon} />
        <Text style={{ color: colors.AppGray, marginLeft: 10 }}>Filters</Text>
      </TouchableOpacity>
    </View>)
  }
  renderViewMapView = () => {
    return (<TouchableOpacity style={{flexDirection: 'row-reverse', padding: 10, marginTop:this.state.showMap ? -65 : -60, zIndex: 100}}
       onPress={() => this.setState({showMap: !this.state.showMap})}>
      <View style={styles.viewOnMapBtnStyle}>
      <Image style={{ width: 20, height: 20 }} resizeMode={'contain'} source={viewMapIcon} />
      <View style={{width: 5}}/>
      <Text style={{fontWeight: '500', fontSize: 14, color:colors.AppTheme}}>{this.state.showMap ? 'View List' : 'View Map'}</Text>
      </View>
  </TouchableOpacity>)
  }
  renderMainView = () => {
    if (this.state.showMap) {
      return (<View style={{height: '100%'}}>
        <View style={styles.containerMapStyle}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.mapStyle}
            initialRegion={{
              latitude: 30.68825,
              longitude: 76.6924,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }}  >
          </MapView>
        </View>
        {this.renderViewMapView()}
      </View>)
    } else {
      return (<View style={{ height: '100%' }}>
        <View>
          {this.renderHeaderView()}
        </View>
        {this.renderListView()}
        {this.renderViewMapView()}
      </View>)
    }
  }
  render() {
    return (
      <SafeAreaView style={styles.Container}>
        <HeaderView title={'Explore'} showBackBtn={false} />
        <View style={{ height: '92%', backgroundColor: colors.AppWhite }}>
          
          <this.renderMainView />
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: colors.AppTheme
  },
  variantCellViewStyle: {
    flexDirection: 'row',
    margin: 5,
    justifyContent: 'space-between',
    alignContent: 'center',
    borderRadius: 5,
    // overflow: 'hidden',
    height: 135,
    shadowColor: 'gray',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 2,
    backgroundColor: colors.AppWhite,
  },
  headerViewStyle: {
    width: '50%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.BorderColor,
  },
  viewOnMapBtnStyle: {
    height: 40,
    backgroundColor: colors.AppWhite,
    flexDirection: 'row',
    width: 130,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'gray',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 5,
    borderRadius: 20,
  },
  containerMapStyle: {
    margin:0,
    height: "100%",
    width: "100%",
    shadowColor: 'gray',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    zIndex: 1,
  },
  mapStyle: {
    position: 'absolute',
    marginTop: 0,
    height: "100%",
    ...StyleSheet.absoluteFillObject,
    borderRadius: 5
  },
});

