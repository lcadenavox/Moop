import { FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Moto {
  modelo: string;
  vaga: string;
}

const todasVagas = [
  "A1",
  "A2",
  "A3",
  "A4",
  "B1",
  "B2",
  "B3",
  "B4",
  "C1",
  "C2",
  "C3",
  "C4",
];

export default function MapScreen() {
  const [motos, setMotos] = useState<Moto[]>([]);
  const [linhaSelecionada, setLinhaSelecionada] = useState<
    "Todas" | "A" | "B" | "C"
  >("Todas");

  const carregarMotos = async () => {
    const dados = await AsyncStorage.getItem("motos");
    if (dados) {
      setMotos(JSON.parse(dados));
    }
  };

  useEffect(() => {
    carregarMotos();
  }, []);

  const filtrarVagas = () => {
    if (linhaSelecionada === "Todas") return todasVagas;
    return todasVagas.filter((v) => v.startsWith(linhaSelecionada));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mapa do Pátio</Text>

      <View style={styles.filtros}>
        {["Todas", "A", "B", "C"].map((linha) => (
          <TouchableOpacity
            key={linha}
            onPress={() => setLinhaSelecionada(linha as any)}
            style={[
              styles.botaoFiltro,
              linhaSelecionada === linha && styles.botaoSelecionado,
            ]}
          >
            <Text
              style={[
                styles.textoFiltro,
                linhaSelecionada === linha && styles.textoSelecionado,
              ]}
            >
              {linha}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.grid}>
        {filtrarVagas().map((vaga) => {
          const ocupada = motos.find((moto) => moto.vaga === vaga);
          return (
            <View
              key={vaga}
              style={[styles.vaga, ocupada ? styles.ocupada : styles.livre]}
            >
              <Text style={styles.vagaText}>{vaga}</Text>
              {ocupada ? (
                <>
                  <FontAwesome5 name="motorcycle" size={24} color="#fff" />
                  <Text style={styles.modelo}>{ocupada.modelo}</Text>
                </>
              ) : (
                <Text style={styles.modelo}>Livre</Text>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: "#00c851",
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  filtros: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 16,
  },
  botaoFiltro: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#444",
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  botaoSelecionado: {
    backgroundColor: "#00c851",
    borderColor: "#00c851",
  },
  textoFiltro: {
    color: "#ccc",
    fontWeight: "bold",
  },
  textoSelecionado: {
    color: "#000",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  vaga: {
    width: "47%",
    minHeight: 100,
    borderRadius: 12,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  livre: {
    backgroundColor: "#2e2e2e",
  },
  ocupada: {
    backgroundColor: "#00c851",
  },
  vagaText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#fff",
    marginBottom: 5,
  },
  modelo: {
    fontSize: 13,
    color: "#fff",
    marginTop: 6,
    textAlign: "center",
  },
});
