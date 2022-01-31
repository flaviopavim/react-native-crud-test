import React, { useState } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  SafeAreaView,
} from 'react-native';
import Mytextinput from './components/Mytextinput';
import Mybutton from './components/Mybutton';
import { DatabaseConnection } from '../database/database-connection';

const db = DatabaseConnection.getConnection();

const RegisterNote = ({ navigation }) => {
  let [noteTitle, setNoteTitle] = useState('');
  let [noteStart, setNoteStart] = useState('');
  let [noteContent, setNoteContent] = useState('');

  let register_note = () => {
    console.log(noteTitle, noteStart, noteContent);

    if (!noteTitle) {
      alert('Preencha o nome');
      return;
    }
    if (!noteStart) {
      alert('Preencha o contato');
      return;
    }
    if (!noteContent) {
      alert('Preencha o conteúdo');
      return;
    }

    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO note (title, `start`, content) VALUES (?,?,?)',
        [noteTitle, noteStart, noteContent],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            navigation.navigate('Home')
          } else alert('Erro registrar!');
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
                onChangeText={
                  (noteTitle) => setNoteTitle(noteTitle)
                }
                style={{ padding: 10 }}
              />
              <Mytextinput
                placeholder="Data"
                onChangeText={
                  (noteStart) => setNoteStart(noteStart)
                }
                maxLength={10}
                style={{ padding: 10 }}
              />
              <Mytextinput
                placeholder="Descrição"
                onChangeText={
                  (noteContent) => setNoteContent(noteContent)
                }
                maxLength={225}
                numberOfLines={5}
                multiline={true}
                style={{ textAlignVertical: 'top', padding: 10 }}
              />
              <Mybutton title="Salvar" customClick={register_note} />
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RegisterNote;