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

export default function RegisterSlotScreen() {
  const [vaga, setVaga] = useState("");
  const [modelo, setModelo] = useState("");
  const [placa, setPlaca] = useState("");
  const [cor, setCor] = useState("");
  const [observacoes, setObservacoes] = useState("");

  // Estados para controle do Modal
  const [modalVisivel, setModalVisivel] = useState(false);
  const [textoModal, setTextoModal] = useState("");

  const salvarVaga = async () => {
    const vagaFormatada = vaga.toUpperCase().trim();
    const modeloFormatado = modelo.trim();
    const placaFormatada = placa.trim();
    const corFormatada = cor.trim();

    if (
      !vagaFormatada ||
      !modeloFormatado ||
      !placaFormatada ||
      !corFormatada
    ) {
      exibirModal("Preencha todos os campos obrigatórios corretamente.");
      return;
    }

    const dados = await AsyncStorage.getItem("motos");
    const motos = dados ? JSON.parse(dados) : [];

    const ocupada = motos.find(
      (moto: { vaga: string }) => moto.vaga === vagaFormatada
    );
    if (ocupada) {
      exibirModal(
        `A vaga ${vagaFormatada} já está ocupada pela moto "${ocupada.modelo}".`
      );
      return;
    }

    const novaMoto = {
      vaga: vagaFormatada,
      modelo: modeloFormatado,
      placa: placaFormatada,
      cor: corFormatada,
      observacoes,
    };

    try {
      const novasMotos = [...motos, novaMoto];
      await AsyncStorage.setItem("motos", JSON.stringify(novasMotos));
      exibirModal("Moto cadastrada com sucesso!");
      setVaga("");
      setModelo("");
      setPlaca("");
      setCor("");
      setObservacoes("");
    } catch (error) {
      exibirModal("Erro ao cadastrar a moto. Tente novamente.");
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
      <Text style={styles.title}>Cadastrar Nova Vaga</Text>

      <TextInput
        placeholder="Digite a vaga (ex: B2)"
        value={vaga}
        onChangeText={setVaga}
        style={styles.input}
        placeholderTextColor="#aaa"
      />
      <TextInput
        placeholder="Modelo da Moto"
        value={modelo}
        onChangeText={setModelo}
        style={styles.input}
        placeholderTextColor="#aaa"
      />
      <TextInput
        placeholder="Placa"
        value={placa}
        onChangeText={setPlaca}
        style={styles.input}
        placeholderTextColor="#aaa"
      />
      <TextInput
        placeholder="Cor da Moto"
        value={cor}
        onChangeText={setCor}
        style={styles.input}
        placeholderTextColor="#aaa"
      />
      <TextInput
        placeholder="Observações (opcional)"
        value={observacoes}
        onChangeText={setObservacoes}
        style={styles.input}
        placeholderTextColor="#aaa"
        multiline
      />

      <View style={styles.botao}>
        <Button title="Salvar" color="#00c851" onPress={salvarVaga} />
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
              <Text style={styles.modalButtonText}>OK</Text>
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
