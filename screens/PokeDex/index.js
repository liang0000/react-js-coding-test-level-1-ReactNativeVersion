import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Pressable,
  Modal,
  Image,
  Dimensions,
} from "react-native";
import styles from "./styles";
import * as Services from "@services";
import { DataTable } from "react-native-paper";
import { BarChart } from "react-native-chart-kit";

const optionsPerPage = [2, 3, 4];
const items = [
  { key: 1, name: "Page 1" },
  { key: 2, name: "Page 2" },
  { key: 3, name: "Page 3" },
];

export default function PokeDex() {
  const [pokemons, setPokemons] = useState([]);
  const [pokemonDetails, setPokemonDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(optionsPerPage[0]);
  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, items.length);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      Services.fetchPokemons().then((res) => {
        if (res) {
          setPokemons(res);
          setIsLoading(false);
        }
      });
    }, 500);
  }, []);

  useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  return (
    <SafeAreaView style={styles.container}>
      <Pressable
        onPress={() => {
          console.log(pokemonDetails?.stats);
        }}
      >
        {({ pressed }) => (
          <Text style={[styles.textMaster, { fontSize: 28 }]}>
            {pressed ? "checking out" : "Welcome to pokedex!"}
          </Text>
        )}
      </Pressable>

      <BarChart
        style={{ marginVertical: 8, borderRadius: 16 }}
        data={{
          labels: ["January", "February", "March", "April", "May", "June"],
          datasets: [{ data: [20, 45, 28, 80, 99, 43] }],
        }}
        width={Dimensions.get("window").width}
        height={220}
        chartConfig={{
          backgroundGradientFrom: "#fff",
          backgroundGradientFromOpacity: 0,
          backgroundGradientTo: "#fff",
          backgroundGradientToOpacity: 0.5,

          fillShadowGradient,
          fillShadowGradientOpacity: 1,
          color: (opacity = 1) => `#023047`,
          labelColor: (opacity = 1) => `#333`,
          strokeWidth: 2,

          barPercentage: 0.5,
          useShadowColorFromDataset: false,
          decimalPlaces: 0,
        }}
        showBarTops={false}
      />

      <ScrollView>
        {!isLoading ? (
          pokemons?.results?.map((data, i) => {
            return (
              <Pressable
                onPress={() => {
                  Services.fetchPokemonDetails(data.url).then((res) => {
                    setModalVisible(true);
                    let _stats = res.stats.map((data, i) => {
                      return {
                        key: i,
                        base_stat: data.base_stat,
                        name: data.stat.name,
                      };
                    });

                    let detail = {
                      name: res.name,
                      front_default: res.sprites.front_default,
                      stats: _stats,
                    };
                    setPokemonDetails(detail);
                  });
                }}
              >
                {({ pressed }) => (
                  <Text
                    index={i}
                    style={[
                      styles.textMaster,
                      {
                        marginBottom: 5,
                        color: pressed ? "yellow" : "white",
                      },
                    ]}
                  >
                    {data.name}
                  </Text>
                )}
              </Pressable>
            );
          })
        ) : (
          <ActivityIndicator size="large" color="white" />
        )}
      </ScrollView>

      {/* <Modal
        visible={modalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Image
              style={{ height: 80, width: 80 }}
              source={{ uri: pokemonDetails?.front_default }}
            />
            <Text style={styles.modalText}>{pokemonDetails?.name}</Text>

            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Name</DataTable.Title>
                <DataTable.Title>Base Stat</DataTable.Title>
              </DataTable.Header>
              {pokemonDetails
                ? pokemonDetails?.stats?.map((data, i) => {
                    return (
                      <DataTable.Row key={i}>
                        <DataTable.Cell>{data.name}</DataTable.Cell>
                        <DataTable.Cell>{data.base_stat}</DataTable.Cell>
                      </DataTable.Row>
                    );
                  })
                : null}
              <DataTable.Pagination
                page={page}
                numberOfPages={Math.ceil(items.length / itemsPerPage)}
                onPageChange={(page) => setPage(page)}
                label={`${from + 1}-${to} of ${items.length}`}
                showFastPaginationControls
                numberOfItemsPerPage={itemsPerPage}
                numberOfItemsPerPageList={optionsPerPage}
                onItemsPerPageChange={setItemsPerPage}
                selectPageDropdownLabel="Rows per page"
              />
            </DataTable>

            <Pressable
              style={styles.button}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal> */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ alignItems: "center" }}
            >
              <Image
                style={{ height: 80, width: 80 }}
                source={{ uri: pokemonDetails?.front_default }}
              />
              <Text style={styles.modalText}>{pokemonDetails?.name}</Text>

              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Name</DataTable.Title>
                  <DataTable.Title>Base Stat</DataTable.Title>
                </DataTable.Header>
                {pokemonDetails
                  ? pokemonDetails?.stats?.map((data, i) => {
                      return (
                        <DataTable.Row key={i}>
                          <DataTable.Cell>{data.name}</DataTable.Cell>
                          <DataTable.Cell>{data.base_stat}</DataTable.Cell>
                        </DataTable.Row>
                      );
                    })
                  : null}
                <DataTable.Pagination
                  page={page}
                  numberOfPages={Math.ceil(items.length / itemsPerPage)}
                  onPageChange={(page) => setPage(page)}
                  label={`${from + 1}-${to} of ${items.length}`}
                  showFastPaginationControls
                  numberOfItemsPerPage={itemsPerPage}
                  numberOfItemsPerPageList={optionsPerPage}
                  onItemsPerPageChange={setItemsPerPage}
                  selectPageDropdownLabel="Rows per page"
                />
              </DataTable>

              {/* <BarChart
                style={{ marginVertical: 8, borderRadius: 16 }}
                data={{
                  labels: [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                  ],
                  datasets: [{ data: [20, 45, 28, 80, 99, 43] }],
                }}
                width={Dimensions.get("window").width}
                height={220}
                yAxisLabel="$"
                chartConfig={{
                  backgroundColor: "#e26a00",
                  backgroundGradientFrom: "#fb8c00",
                  backgroundGradientTo: "#ffa726",
                  decimalPlaces: 2, // optional, defaults to 2dp
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  labelColor: (opacity = 1) =>
                    `rgba(255, 255, 255, ${opacity})`,
                  style: { borderRadius: 16 },
                  propsForDots: { r: "6", strokeWidth: "2", stroke: "#ffa726" },
                }}
                bezier
              /> */}
            </ScrollView>

            <Pressable
              style={styles.button}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
