
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import colors from '../CommonClasses/AppColor';
import eventStyles from '../StyleSheet/EventStyleSheet';
import FastImage from 'react-native-fast-image'
import sample from '../assets/dummy.png';
import {getTimeFormat,changeDateFormat,dateConversionFromTimeStamp} from '../HelperClasses/SingleTon'
import transactionEnum from '../Model/TransactionEnum';

const windowWidth = Dimensions.get('window').width;
export default class TrasnactionList extends Component {
  static propTypes = {
    data: PropTypes.any,
  };

  renderTransactionListCellItem = () => {
    let item = this.props.data;
    let dateFr = changeDateFormat(item['created_at'] * 1000, 'D, MMM HH:MM');
    let price = item['amount']['formatted'];
    let type = transactionEnum.code(item['type']);
    return <TouchableOpacity style={styles.variantCellViewStyle} onPress={() => this.didSelect(item)}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={eventStyles.titleStyle}>{item['transaction_number']}</Text>
        <Text style={{ fontWeight: '500', fontSize: 14, color: colors.AppTheme }}>{price}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, }}>
        <Text style={eventStyles.subTitleStyle}>{type}</Text>
        <Text style={{ fontWeight: '500', fontSize: 12 }}>{dateFr}</Text>
      </View>
    </TouchableOpacity>
  }
  render() {
    return (<View>
      <this.renderTransactionListCellItem />
    </View>)
  }
}
const styles = StyleSheet.create({
  variantCellViewStyle: {
    alignContent: 'center',
    borderRadius: 5,
    shadowColor: 'gray',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 2,
    backgroundColor: colors.AppWhite,
    margin: 10,
    padding: 10,
    width: '95%',
  },
});
