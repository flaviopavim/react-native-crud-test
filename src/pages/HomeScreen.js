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
        "SELECT name FROM sqlite_master WHERE type='table' AND name='table_user'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS table_user', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS table_user(user_id INTEGER PRIMARY KEY AUTOINCREMENT, user_name VARCHAR(20), user_contact INT(10), user_address VARCHAR(255))',
              []
            );
          }
        }
      );
    });
  }, []);

  //useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM table_note ORDER BY note_id DESC',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i)
            temp.push(results.rows.item(i));
          setFlatListItems(temp);
        }
      );
    });
  //}, []);

  async function deleteNote(id) {
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
                'DELETE FROM  table_note where note_id=?',
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


        <Text style={styles.textheader}>Título</Text>
        <Text style={styles.textbottom}>{item.note_title}</Text>

        <Text style={styles.textheader}>Contato</Text>
        <Text style={styles.textbottom}>{item.note_date}</Text>

        <Text style={styles.textheader}>Descrição</Text>
        <Text style={styles.textbottom}>{item.note_content}</Text>

        <View
          style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Mybutton title="Editar" customClick={() => navigation.navigate('Update',{id:item.note_id})} />
          <Mybutton title="Excluir" customClick={() => deleteNote(item.note_id)} />
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
            style={{ marginTop: 30 }}
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
  textheader: {
    color: '#111',
    fontSize: 12,
    fontWeight: '700',

  },
  textbottom: {
    color: '#111',
    fontSize: 18,
  },
});

export default HomeScreen;