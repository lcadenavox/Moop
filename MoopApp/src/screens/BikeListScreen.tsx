import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Moto {
  modelo: string;
  vaga: string;
  placa: string;
  cor: string;
  observacoes?: string;
}

export default function BikeListScreen() {
  const [bikes, setBikes] = useState<Moto[]>([]);

  // Estado para controle do Modal
  const [modalVisivel, setModalVisivel] = useState(false);
  const [textoModal, setTextoModal] = useState("");

  // Estado para a moto a ser removida
  const [motoParaRemover, setMotoParaRemover] = useState<Moto | null>(null);
  const [modalConfirmVisivel, setModalConfirmVisivel] = useState(false);

  const exibirModalInfo = (mensagem: string) => {
    setTextoModal(mensagem);
    setModalVisivel(true);
  };

  const fecharModalInfo = () => {
    setModalVisivel(false);
  };

  const abrirModalConfirmacao = (moto: Moto) => {
    setMotoParaRemover(moto);
    setModalConfirmVisivel(true);
  };

  const fecharModalConfirmacao = () => {
    setMotoParaRemover(null);
    setModalConfirmVisivel(false);
  };

  const carregarDados = async () => {
    try {
      const dados = await AsyncStorage.getItem("motos");
      if (dados) {
        setBikes(JSON.parse(dados));
      } else {
        setBikes([]);
      }
    } catch (error) {
      exibirModalInfo("Não foi possível carregar as motos.");
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const confirmarRemocao = async () => {
    if (!motoParaRemover) return;

    try {
      const novasMotos = bikes.filter((m) => m.vaga !== motoParaRemover.vaga);
      await AsyncStorage.setItem("motos", JSON.stringify(novasMotos));
      setBikes(novasMotos);
      exibirModalInfo(`Moto da vaga ${motoParaRemover.vaga} foi removida!`);
    } catch (error) {
      exibirModalInfo("Erro ao remover a moto. Tente novamente.");
    }

    fecharModalConfirmacao();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Motos Cadastradas</Text>
      {bikes.length === 0 ? (
        <Text style={styles.vazio}>Nenhuma moto cadastrada.</Text>
      ) : (
        <FlatList
          data={bikes}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.modelo}>Modelo: {item.modelo}</Text>
              <Text style={styles.vaga}>Vaga: {item.vaga}</Text>
              <Text style={styles.placa}>Placa: {item.placa}</Text>
              <Text style={styles.cor}>Cor: {item.cor}</Text>
              {item.observacoes ? (
                <Text style={styles.observacoes}>
                  Observações: {item.observacoes}
                </Text>
              ) : null}
              <TouchableOpacity
                onPress={() => abrirModalConfirmacao(item)}
                style={styles.botaoRemover}
              >
                <Text style={styles.textoRemover}>Remover</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {/* Modal de Mensagens */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisivel}
        onRequestClose={fecharModalInfo}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{textoModal}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={fecharModalInfo}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de Confirmação de Remoção */}
      <Modal
        animationType="slide"
        transparent
        visible={modalConfirmVisivel}
        onRequestClose={fecharModalConfirmacao}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {motoParaRemover && (
              <>
                <Text style={styles.modalText}>
                  Deseja remover a moto "{motoParaRemover.modelo}" da vaga "
                  {motoParaRemover.vaga}"?
                </Text>
                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: "#666" }]}
                    onPress={fecharModalConfirmacao}
                  >
                    <Text style={styles.modalButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, { marginLeft: 10 }]}
                    onPress={confirmarRemocao}
                  >
                    <Text style={styles.modalButtonText}>Remover</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
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
  card: {
    backgroundColor: "#2e2e2e",
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
  },
  modelo: { fontSize: 18, color: "#fff", fontWeight: "bold" },
  vaga: { fontSize: 14, color: "#ccc" },
  placa: { fontSize: 14, color: "#fff" },
  cor: { fontSize: 14, color: "#fff" },
  observacoes: { fontSize: 14, color: "#ccc" },
  botaoRemover: {
    marginTop: 8,
    backgroundColor: "#d32f2f",
    paddingVertical: 6,
    borderRadius: 8,
  },
  textoRemover: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  vazio: {
    color: "#ccc",
    textAlign: "center",
    marginTop: 30,
  },
  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  modalButton: {
    flex: 1,
    backgroundColor: "#d32f2f",
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalButtonText: {
    textAlign: "center",
    color: "#121212",
    fontWeight: "bold",
  },
});
