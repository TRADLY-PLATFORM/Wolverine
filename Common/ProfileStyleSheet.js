'use strict';
var React = require('react-native');

var { StyleSheet, } = React;
import AppColors from './AppColors';
import colors from './AppColors';


module.exports = StyleSheet.create({
    bannerImageViewStyle: {
        marginTop: 20,
        width: '100%',
        aspectRatio: 16 / 9,
    },
    fieldsView:   {
        marginTop: 20,
        width: "90%",
        marginLeft: 16,
        marginRight: 16,
    },
    titletextStyle:
    {
        fontSize: 16,
        color: 'gray',
    },
    txtFieldStyle: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: '500',
        color: 'black',
        textAlign: "left",
        marginBottom: 7,
        borderBottomWidth: 1,
        borderBottomColor: colors.Lightgray
    },
});

