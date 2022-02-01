import React, { useState, useEffect } from 'react';
import { FlatList, Text, View, SafeAreaView, StyleSheet, Alert } from 'react-native';
import { DatabaseConnection } from '../database/database-connection';
import Mybutton from './components/Mybutton';
import MyImageButton from './components/MyImageButton';

const db = DatabaseConnection.getConnection();

const HomeScreen = ({ navigation }) => {
  let [flatListItems, setFlatListItems] = useState([]);

  useEffect(() => {
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='note'",[],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS note', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS note ('+
                'id INTEGER PRIMARY KEY AUTOINCREMENT, '+
                'title VARCHAR(128), '+
                'summary VARCHAR(1024), '+
                '`start` VARCHAR(19), '+ //2020-12-31 23:59:59 - Data de início do evento
                '`end` VARCHAR(19), '+ //2020-12-31 23:59:59 - Data de término do evento
                'content VARCHAR(102400) '+
              ')',[]);

          }
        }
      );
    });
  }, []);
  db.transaction((tx) => {
    tx.executeSql(
      'SELECT * FROM note ORDER BY id DESC',
      [],
      (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i)
          temp.push(results.rows.item(i));
        setFlatListItems(temp);
      }
    );
  });
  //useEffect(() => {
  //}, []);

  async function deleteNote(id) {
    console.log('Deleting:',id);
    Alert.alert(
      'Confirmação',
      'Tem certeza que deseja excluir?',
      [
        {
          text: 'Cancelar',
          onPress: () => navigation.navigate('Home'),
        },
        {
          text: 'Ok',
          onPress: async () => {
            await db.transaction((tx) => {
              tx.executeSql(
                'DELETE FROM note WHERE id=?',
                [id],
                (tx, results) => {
                  console.log('Results', results.rowsAffected);
                  navigation.navigate('Home')
                }
              );
            });
          },
        },
      ]
    );
  }


  let listItemView = (item) => {
    return (
      <View
        key={item.note_id}
        style={{ backgroundColor: '#EEE', marginTop: 20, padding: 30, borderRadius: 10 }}>


        <Text style={styles.text}>{item.title}</Text>
        <Text style={styles.text}>Data: {item.start}</Text>
        <Text style={styles.text}>{item.content}</Text>

        <View
          style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Mybutton title="Editar" customClick={() => navigation.navigate('Update',{id:item.id})} />
          <Mybutton title="Excluir" customClick={() => deleteNote(item.id)} />
        </View>

      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ flex: 1 }}>
          <MyImageButton
              title="Novo agendamento"
              btnColor='#2992C4'
              customClick={() => {
                navigation.navigate('Register')
              } }
            />
          <FlatList
            contentContainerStyle={{ paddingHorizontal: 20 }}
            data={flatListItems}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => listItemView(item)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  text: {
    color: '#111',
    fontSize: 14,
  },
});

export default HomeScreen;