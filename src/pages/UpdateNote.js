import React, { useState } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  SafeAreaView,
  Text,
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

  let updateAllStates = (title, date, content) => {
    setNoteTitle(title);
    setNoteStart(date);
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
              res.note_title,
              res.note_date,
              res.note_content
            );
          } else {
            alert('Agendamento não encontrado!');
            updateAllStates('', '', '');
          }
        }
      );
    });
  };

  searchNote();

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
            Alert.alert(
              'Sucesso',
              'Atualizado com sucesso!',
              [
                {
                  text: 'Ok',
                  onPress: () => navigation.navigate('Home'),
                },
              ],
              { cancelable: false }
            );
          } else alert('Erro ao atualizar!');
        }
      );
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ flex: 1 }}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <KeyboardAvoidingView
              behavior="padding"
              style={{ flex: 1, justifyContent: 'space-between' }}>
              <Mytextinput
                placeholder="Título"
                value={noteTitle}
                style={{ padding: 10 }}
                onChangeText={
                  (noteTitle) => setNoteName(noteTitle)
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