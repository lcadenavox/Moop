import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
  Button,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTranslation } from 'react-i18next';
import { createRegisterSlotSchema, validateWith } from '../validation/schemas';

export default function RegisterSlotScreen() {
  const { t } = useTranslation();
  const [vaga, setVaga] = useState("");
  const [modelo, setModelo] = useState("");
  const [placa, setPlaca] = useState("");
  const [cor, setCor] = useState("");
  const [observacoes, setObservacoes] = useState("");

  // Estados para controle do Modal
  const [modalVisivel, setModalVisivel] = useState(false);
  const [textoModal, setTextoModal] = useState("");

  const salvarVaga = async () => {
    const schema = createRegisterSlotSchema(t);
    const result = await validateWith(schema, { vaga, modelo, placa, cor, observacoes });
    if (!result.valid) {
      exibirModal(t('slot.form.fillAll'));
      return;
    }

    const vagaFormatada = vaga.toUpperCase().trim();
    const dados = await AsyncStorage.getItem('motos');
    const motos = dados ? JSON.parse(dados) : [];
    const ocupada = motos.find((moto: { vaga: string; modelo: string }) => moto.vaga === vagaFormatada);
    if (ocupada) {
      exibirModal(t('slot.form.vagaOcupada', { vaga: vagaFormatada, modelo: ocupada.modelo }));
      return;
    }

    const novaMoto = {
      vaga: vagaFormatada,
      modelo: modelo.trim(),
      placa: placa.trim(),
      cor: cor.trim(),
      observacoes: observacoes.trim(),
    };

    try {
      const novasMotos = [...motos, novaMoto];
      await AsyncStorage.setItem('motos', JSON.stringify(novasMotos));
      exibirModal(t('slot.form.success'));
      setVaga('');
      setModelo('');
      setPlaca('');
      setCor('');
      setObservacoes('');
    } catch (error) {
      exibirModal(t('slot.form.errorGeneric'));
    }
  };

  const exibirModal = (mensagem: string) => {
    setTextoModal(mensagem);
    setModalVisivel(true);
  };

  const fecharModal = () => {
    setModalVisivel(false);
  };

  return (
    <View style={styles.container}>
  <Text style={styles.title}>{t('slot.form.title')}</Text>

      <TextInput
        placeholder={t('slot.form.placeholderVaga')}
        value={vaga}
        onChangeText={setVaga}
        style={styles.input}
        placeholderTextColor="#aaa"
      />
      <TextInput
        placeholder={t('slot.form.placeholderModelo')}
        value={modelo}
        onChangeText={setModelo}
        style={styles.input}
        placeholderTextColor="#aaa"
      />
      <TextInput
        placeholder={t('slot.form.placeholderPlaca')}
        value={placa}
        onChangeText={setPlaca}
        style={styles.input}
        placeholderTextColor="#aaa"
      />
      <TextInput
        placeholder={t('slot.form.placeholderCor')}
        value={cor}
        onChangeText={setCor}
        style={styles.input}
        placeholderTextColor="#aaa"
      />
      <TextInput
        placeholder={t('slot.form.placeholderObservacoes')}
        value={observacoes}
        onChangeText={setObservacoes}
        style={styles.input}
        placeholderTextColor="#aaa"
        multiline
      />

      <View style={styles.botao}>
        <Button title={t('slot.form.action')} color="#00c851" onPress={salvarVaga} />
      </View>

      {/* Modal de Notificações */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisivel}
        onRequestClose={fecharModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{textoModal}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={fecharModal}>
              <Text style={styles.modalButtonText}>{t('slot.modal.ok')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00c851",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 10,
    padding: 12,
    color: "#fff",
    marginBottom: 12,
  },
  botao: {
    marginTop: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#2e2e2e",
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  modalText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#00c851",
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalButtonText: {
    textAlign: "center",
    color: "#121212",
    fontWeight: "bold",
  },
});
