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
  TouchableOpacity,
} from "react-native";
import styles from "./styles";
import * as Services from "@services";
import { DataTable, Searchbar } from "react-native-paper";
import { BarChart } from "react-native-chart-kit";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import { FontAwesome5 } from "@expo/vector-icons";

const optionsPerPage = [2, 3, 4];
const items = [
  { key: 1, name: "Page 1" },
  { key: 2, name: "Page 2" },
  { key: 3, name: "Page 3" },
];
const html = (name, url) => {
  return `
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
</head>
<body style="text-align: center;">
  <img
    src="${url}"
    style="width: 30vw;" />
  <h1 style="font-size: 50px; font-family: Helvetica Neue; font-weight: normal;">
    ${name}
  </h1>
</body>
</html>
`;
};

export default function PokeDex() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSearchQuery, setFilteredSearchQuery] = useState([]);
  const [masterSearchQuery, setMasterSearchQuery] = useState([]);
  const [sorting, setSorting] = useState(false);
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
          setFilteredSearchQuery(res.results);
          setMasterSearchQuery(res.results);
          setIsLoading(false);
        }
      });
    }, 500);
  }, []);

  useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  const printToFile = async (name, url) => {
    const { uri } = await Print.printToFileAsync({ html: html(name, url) });
    await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
  };

  const searchFilterFunction = (text) => {
    if (text) {
      const newData = masterSearchQuery.filter((data) => {
        return data.name.indexOf(text) > -1;
      });
      setFilteredSearchQuery(newData);
      setSearchQuery(text);
    } else {
      setFilteredSearchQuery(masterSearchQuery);
      setSearchQuery(text);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Pressable
        onPress={() => {
          console.log(filteredSearchQuery);
        }}
      >
        {({ pressed }) => (
          <Text style={[styles.textMaster, { fontSize: 28 }]}>
            {pressed ? "checking out" : "Welcome to pokedex!"}
          </Text>
        )}
      </Pressable>

      <View
        style={{ flexDirection: "row", marginBottom: 20, alignSelf: "center" }}
      >
        <Searchbar
          style={{
            width: Dimensions.get("window").width - 120,
            marginRight: 5,
          }}
          inputStyle={{ fontSize: 15 }}
          placeholder="Search your Pokemon"
          onChangeText={(query) => searchFilterFunction(query)}
          value={searchQuery}
        />
        <TouchableOpacity
          style={{ borderRadius: 5, backgroundColor: "white", padding: 15 }}
          onPress={() => {
            if (sorting) {
              filteredSearchQuery.sort((a, b) => a.name.localeCompare(b.name));
            } else {
              filteredSearchQuery.sort((a, b) => b.name.localeCompare(a.name));
            }
            setSorting(!sorting);
          }}
        >
          <FontAwesome5
            name={sorting ? "sort-alpha-down-alt" : "sort-alpha-down"}
            size={17}
            color="black"
          />
        </TouchableOpacity>
      </View>

      <ScrollView>
        {!isLoading ? (
          filteredSearchQuery?.map((data, i) => {
            return (
              <Pressable
                key={i}
                onPress={() => {
                  Services.fetchPokemonDetails(data.url).then((res) => {
                    setModalVisible(true);
                    let _stats = res.stats.map((data) => {
                      return {
                        key: data.key,
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
                    style={[
                      styles.textMaster,
                      { marginBottom: 5, color: pressed ? "yellow" : "white" },
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
                chartConfig={{
                  backgroundGradientFrom: "#1E2923",
                  backgroundGradientFromOpacity: 0,
                  backgroundGradientTo: "#08130D",
                  backgroundGradientToOpacity: 0.5,
                  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                  strokeWidth: 2, // optional, default 3
                  barPercentage: 0.5,
                  useShadowColorFromDataset: false, // optional
                }}
                showBarTops={false}
              /> */}
            </ScrollView>
            <View style={{ flexDirection: "row" }}>
              <Pressable
                style={[styles.button, { marginRight: 10 }]}
                onPress={() =>
                  printToFile(
                    pokemonDetails?.name,
                    pokemonDetails?.front_default
                  )
                }
              >
                <Text style={styles.textStyle}>Print</Text>
              </Pressable>
              <Pressable
                style={styles.button}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Close</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
