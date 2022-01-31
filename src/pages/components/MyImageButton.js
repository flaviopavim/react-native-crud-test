import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome'

const MyImageButton = (props) => {

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: props.btnColor }]}
      onPress={props.customClick}>

      <Text style={styles.text}>
        {props.title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    color: '#ffffff',
    padding: 10,
    marginTop: 16,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 5,
  },
  text: {
    color: '#ffffff',
  },
  icon: {
    paddingBottom: 5,
  }
});

export default MyImageButton;