import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';


import Mytextinput from './components/Mytextinput';
import Mybutton from './components/Mybutton';
import { DatabaseConnection } from '../database/database-connection';

const db = DatabaseConnection.getConnection();

const UpdateNote = ({ route, navigation }) => {
  let [noteTitle, setNoteTitle] = useState('');
  let [noteStart, setNoteStart] = useState('');
  let [noteContent, setNoteContent] = useState('');


  const { id } = route.params;

  let updateAllStates = (title, start, content) => {
    setNoteTitle(title);
    setNoteStart(start);
    setNoteContent(content);
  };

  let searchNote = () => {
    console.log(id);
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM note WHERE id = ?',
        [id],
        (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            let res = results.rows.item(0);
            updateAllStates(
              res.title,
              res.start,
              res.content
            );
          } else {
            alert('Agendamento não encontrado!');
            updateAllStates('', '', '');
          }
        }
      );
    });
  };

  useEffect(() => {
    searchNote();
  }, []);

  let updateNote = () => {
    console.log(id, noteTitle, noteStart, noteContent);

    if (!noteTitle) {
      alert('Informe o título');
      return;
    }
    if (!noteStart) {
      alert('Informe o telefone');
      return;
    }
    if (!noteContent) {
      alert('Informe o endereço');
      return;
    }

    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE note SET title=?, `start`=? , content=? where id=?',
        [noteTitle, noteStart, noteContent, id],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            navigation.navigate('Home')
          } else alert('Erro ao atualizar!');
        }
      );
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ flex: 1, paddingTop: 15 }}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <KeyboardAvoidingView
              behavior="padding"
              style={{ flex: 1, justifyContent: 'space-between' }}>
              <Mytextinput
                placeholder="Título"
                value={noteTitle}
                style={{ padding: 10 }}
                onChangeText={
                  (noteTitle) => setNoteTitle(noteTitle)
                }
              />
              <Mytextinput
                placeholder="Data"
                value={'' + noteStart}
                onChangeText={
                  (noteStart) => setNoteStart(noteStart)
                }
                maxLength={10}
                style={{ padding: 10 }}
                keyboardType="numeric"
              />
              <Mytextinput
                value={noteContent}
                placeholder="Endereço"
                onChangeText={
                  (noteContent) => setNoteContent(noteContent)
                }
                maxLength={225}
                numberOfLines={5}
                multiline={true}
                style={{ textAlignVertical: 'top', padding: 10 }}
              />
              <Mybutton
                title="Atualizar"
                customClick={updateNote}
              />
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default UpdateNote;