import React, { Component } from 'react';
import { Linking, View } from 'react-native';
import database from '@react-native-firebase/database';
import appConstant from '../Constants/AppConstants';

export const createChat = (receiverId, receiverName, profilepic, callback) => {
  database().ref(`${appConstant.firebaseChatPath}users/${appConstant.userId}/chatrooms`).once('value').then(snapshot => {
    // console.log('snapshot', snapshot.val());
    if (snapshot.val() != null) {
      let object = Object.keys(snapshot.val())
      var chatRoomId = '';
      let value = snapshot.val();
      for (snap in snapshot.val()) {
        let dic = value[snap];
        if (dic['receiverId']) {
          if (dic['receiverId'] == receiverId) {
            chatRoomId = snap
          }
        }
      }
      if (chatRoomId.length == 0) {
        initializeChat(receiverId, receiverName, profilepic, cID => {
          return callback(cID);
        });
      } else {
        return callback(chatRoomId);
      }
    } else {
      initializeChat(receiverId, receiverName, profilepic, cID => {
        return callback(cID);
      });
    }
  });
};

export const initializeChat = (receiverId, receiverName, profilepic, cID) => {
  let chatRoomId = Date.now();

  var user = {};
  user[`${appConstant.userId}`] = true;
  user[`${receiverId}`] = true;
  let chat = {
    'createdTime': Date.now(),
    'type': 'private',
    "users": user
  }
  let receiverDic = { 'lastMessage': "", "receiver": appConstant.userName, "receiverId": appConstant.userId, "profilePic": appConstant.profilePic, "lastUpdated": Date.now(), "deleteStatus": false, "count": 0, "type": "private" }
  let senderDic = { 'lastMessage': "", "receiver": receiverName, "receiverId": receiverId, "profilePic": profilepic, "lastUpdated": Date.now(), "deleteStatus": false, "count": 0, "type": "private" }

  var multipath = {};
  multipath[`chats/${chatRoomId}`] = chat;
  multipath[`users/${receiverId}/chatrooms/${chatRoomId}`] = receiverDic;
  multipath[`users/${appConstant.userId}/chatrooms/${chatRoomId}`] = senderDic;
  // console.log('multipath', multipath);
  database().ref(`${appConstant.firebaseChatPath}`).update(multipath);
  return cID(chatRoomId);
}

export function sendMessage(msgTxt, msgDic, chatRoomId, receiverId, mimeType) {
  // console.log('chatRoomId',chatRoomId);
  let refKey = database().ref(appConstant.firebaseChatPath).push().key;
  // console.log('refKey', refKey);
  var newMsg = {};
  newMsg[`chats/${chatRoomId}/messages/${refKey}`] = msgDic;
  newMsg[`users/${appConstant.userId}/chatrooms/${chatRoomId}/deleteStatus`] = false;
  newMsg[`users/${receiverId}/chatrooms/${chatRoomId}/deleteStatus`] = false;

  newMsg[`users/${appConstant.userId}/chatrooms/${chatRoomId}/lastUpdated`] = Date.now();
  newMsg[`users/${receiverId}/chatrooms/${chatRoomId}/lastUpdated`] = Date.now();

  newMsg[`users/${appConstant.userId}/chatrooms/${chatRoomId}/lastMessage`] = msgTxt;
  newMsg[`users/${receiverId}/chatrooms/${chatRoomId}/lastMessage`] = msgTxt;

  newMsg[`users/${appConstant.userId}/chatrooms/${chatRoomId}/mimeType`] = mimeType;
  newMsg[`users/${receiverId}/chatrooms/${chatRoomId}/mimeType`] = mimeType;
  // console.log('newMsg', newMsg);
  database().ref(`${appConstant.firebaseChatPath}`).update(newMsg);
}
