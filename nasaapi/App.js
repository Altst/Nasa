import React, { useEffect, useState, createContext, useContext } from "react";
import { BottomNavigation, Appbar, TextInput, Button, Card, } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { FlatList, StyleSheet, View, Text, Image, TouchableOpacity, Platform, } from "react-native";
import Modal from "react-native-modal";
import { WebView } from "react-native-webview";
import moment from "moment";

const ApiKeyContext = createContext();

const AppBarComponent = ({ title }) => {
  const apiKeyContext = useContext(ApiKeyContext);
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  const handleLogout = () => {
    apiKeyContext.setApiKey("");
    openLogoutModal();
  };

  const openLogoutModal = () => {
    setIsLogoutModalVisible(true);
  };

  const closeLogoutModal = () => {
    setIsLogoutModalVisible(false);
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title={title} />
        <Appbar.Action icon="arrow-collapse-right" onPress={handleLogout} />
      </Appbar.Header>
      <MyModal isVisible={isLogoutModalVisible} closeModal={closeLogoutModal} />
    </>
  );
};

const MyModal = ({ isVisible, closeModal }) => {
  const [apiKeyInput, setApiKeyInput] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("login");
  const apiKeyContext = useContext(ApiKeyContext);

  const validateApiKey = async (key) => {
    try {
      const response = await fetch(
        "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=" +
        key
      );
      const result = await response.json();
      if (result.error && result.error.code === "API_KEY_INVALID") {
        alert("Incorrect NASA API Key");
      } else if (result.error && result.error.code === "API_KEY_MISSING") {
        alert("Missing NASA API Key");
      } else {
        apiKeyContext.setApiKey(key);
        closeModal();
      }
    } catch (error) {
      alert("Error validating API key");
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const renderTabItem = (tab, label) => {
    const isActive = activeTab === tab;

    return (
      <TouchableOpacity
        style={[
          styles.tabItem,
          isActive && styles.activeTabItem,
          Platform.OS === "ios" && styles.iosTabItem,
        ]}
        onPress={() => handleTabChange(tab)}
      >
        <Text
          style={[
            styles.tabItemText,
            isActive && styles.activeTabItemText,
            Platform.OS === "ios" && styles.iosTabItemText,
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );

  };

  return (
    <Modal isVisible={isVisible} onRequestClose={closeModal}>
      <View style={styles.modalContainer}>
        <View style={styles.tabContainer}>
          {renderTabItem("login", "Log In")}
          {renderTabItem("signup", "Sign Up")}
        </View>
        {activeTab === "login" ? (
          <View style={{ flex: 1, width: "95%" }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "400",
                opacity: 0.7,
              }}
            >
              Enter your NASA API Key
            </Text>
            <TextInput
              label="API Key"
              mode="flat"
              value={apiKeyInput}
              style={{ width: "100%", marginTop: 10 }}
              onChangeText={setApiKeyInput}
            />
            <Button
              mode="contained"
              contentStyle={{ width: "100%", height: 50 }}
              style={{
                marginTop: 10,
                borderRadius: 12,
                backgroundColor: "#000",
              }}
              onPress={() => {
                validateApiKey(apiKeyInput);
              }}
            >
              Log In
            </Button>
          </View>
        ) : (
          <View style={{ flex: 1, width: "100%" }}>
            <WebView
              source={{ uri: "https://api.nasa.gov/#signUp" }}
              style={{ flex: 1 }}
            />
          </View>
        )}
      </View>
    </Modal>
  );
};


const APOD = () => {
  const [imgs, setImgs] = useState([]);
  const today = new Date();
  const [dates, setDates] = useState([]);
  const timeDate = [];
  for (let i = 1; i <= 10; i++) {
    today.setDate(today.getDate() - i);
    const formattedDate = moment(today).format('YYYY-MM-DD');
    timeDate.push(formattedDate);
  }

  useEffect(() => {
    setDates(timeDate);
  }, []);

  const [timeDates, setTimeDates] = useState([]);
  const [titles, setTitles] = useState([]);
  const [explanations, setExplanations] = useState([]);
  const apiKeyContext = useContext(ApiKeyContext);

  const fetchAPODPhotos = async () => {
    try {
      const timeImg = [];
      const timeDate = [];
      const timeExplanation = [];
      const timeTitle = [];
      for (let i = 0; i < dates.length; i++) {
        const response = await fetch(
          'https://api.nasa.gov/planetary/apod?date=' +
          dates[i] +
          '&api_key=' +
          apiKeyContext.apiKey
        );
        const data = await response.json();
        timeImg.push(data.url);
        timeDate.push(data.date);
        timeExplanation.push(data.explanation);
        timeTitle.push(data.title);
      }
      setImgs(timeImg);
      setTitles(timeTitle);
      setExplanations(timeExplanation);
      setTimeDates(timeDate);
    } catch (error) {
      console.error('Error fetching APOD: ', error);
    }
  };

  useEffect(() => {
    fetchAPODPhotos();
  }, [apiKeyContext.apiKey]);

  return (
    <View style={{ padding: 15 }}>
      <FlatList
        data={imgs}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View>
            <Image
              source={{ uri: item }}
              style={{ width: '100%', height: 300 }}
            />
            <View>
              <Text style={{ fontSize: 18, fontWeight: 700, marginTop: 10 }}>{titles[index]}</Text>
              <Text style={{ fontSize: 16, fontWeight: 500, marginVertical: 5, opacity: 0.7 }}>{timeDates[index]}</Text>
              <Text style={{ fontSize: 14, fontWeight: 500, marginVertical: 10, opacity: 0.6 }}>{explanations[index]}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const Asteroids = () => {
  const startDate = new Date();
  const endDate = new Date();
  startDate.setDate(endDate.getDate() - 8);
  endDate.setDate(endDate.getDate() - 1);
  const [selectedStartDate, setSelectedStartDate] = useState(startDate);
  const [selectedEndDate, setSelectedEndDate] = useState(endDate);
  const [objectCount, setObjectCount] = useState(null);
  const [asteroids, setAsteroids] = useState([]);
  const apiKeyContext = useContext(ApiKeyContext);

  const fetchAsteroidsData = async (startDate, endDate) => {
    try {
      const formattedStartDate = moment(startDate).format("YYYY-MM-DD");
      const formattedEndDate = moment(endDate).format("YYYY-MM-DD");

      const response = await fetch(
        "https://api.nasa.gov/neo/rest/v1/feed?start_date=" +
        formattedStartDate +
        "&end_date=" +
        formattedEndDate +
        "&api_key=" +
        apiKeyContext.apiKey
      );
      const data = await response.json();

      if (data.near_earth_objects) {
        setObjectCount(data.element_count);
        const asteroidList = [];

        Object.keys(data.near_earth_objects).forEach((date) => {
          asteroidList.push(...data.near_earth_objects[date]);
        });
        const asteroidsWithDateAndSpeed = asteroidList.map((asteroid) => {
          const closeApproachData = asteroid.close_approach_data[0];
          const asteroidDate = closeApproachData.close_approach_date;
          const speedInKilometersPerSecond = parseFloat(
            closeApproachData.relative_velocity.kilometers_per_second
          );
          return { ...asteroid, asteroidDate, speedInKilometersPerSecond };
        });

        setAsteroids(asteroidsWithDateAndSpeed);
      }
    } catch (error) {
      console.error("Error fetching Asteroids: ", error);
    }

  };


  useEffect(() => {
    fetchAsteroidsData(selectedStartDate, selectedEndDate);
  }, [apiKeyContext.apiKey]);

  const renderAsteroidItem = ({ item }) => (
    <View style={{ width: '50%', height: 160, padding: 5 }}>
      <Card style={{ width: '100%', height: '100%', backgroundColor: '#f6edfc' }} mode="contained">
        <Card.Title title={item.id} titleStyle={{ fontWeight: 'bold' }} />
        <Card.Content>
          <Text>Name: {item.name}</Text>
          <Text>Date: {item.asteroidDate}</Text>
          <Text>Speed (km/s): {item.speedInKilometersPerSecond}</Text>
        </Card.Content>
      </Card>
    </View>
  );

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          width: "90%",
        }}
      >
      </View>
      <FlatList
        data={asteroids}
        renderItem={renderAsteroidItem}
        keyExtractor={(item) => item.id}
        style={{ width: "100%" }}
        numColumns={2}
      />
    </View>
  );
};

const Earth = () => {
  const apiKeyContext = useContext(ApiKeyContext);
  const [imageURL, setImageURL] = useState("");

  const fetchEarthPhotos = async () => {
    try {
      const response = await fetch(
        "https://api.nasa.gov/planetary/earth/assets?lon=100.75&lat=1.5&date=2021-08-11&dim=0.5&api_key=" +
        apiKeyContext.apiKey
      );
      const data = await response.json();
      setImageURL(data.url);
      console.log(data);
    } catch (error) {
      console.error("Error fetching Earth: ", error);
    }
  };

  useEffect(() => {
    fetchEarthPhotos();
  }, [apiKeyContext.apiKey]);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        marginBottom: 10,
      }}
    >
      <Card style={{ width: "95%", backgroundColor: '#fff', height: '100%' }} mode="contained">
        <Card.Cover source={{ uri: imageURL }} style={{ height: '100%', backgroundColor: '#f6edfc' }} />
        <Card.Content>
        </Card.Content>
      </Card>
    </View>
  );
};

const Epic = () => {
  const [imgs, setImgs] = useState([]);
  const apiKeyContext = useContext(ApiKeyContext);

  useEffect(() => {
    const fetchEpicPhotos = async () => {
      try {
        const response = await fetch(
          `https://api.nasa.gov/EPIC/api/natural/images?api_key=${apiKeyContext.apiKey}`
        );
        const data = await response.json();
        const imgCodes = [];
        const dates = [];
        const imgsIter = [];
        for (let i = 0; i < data.length; i++) {
          const imgCodeIter = data[i].image;
          const dateTime = data[i].date;
          const [datePart, timePart] = dateTime.split(" ");
          const [year, month, day] = datePart.split("-");
          const formattedDate = `${year}/${month}/${day}`;
          dates.push(formattedDate);
          imgCodes.push(imgCodeIter);
          imgsIter.push('https://api.nasa.gov/EPIC/archive/natural/' + formattedDate + '/png/' + imgCodeIter + '.png?api_key=' + apiKeyContext.apiKey);
        }
        setImgs(imgsIter);
      } catch (error) {
        console.error("Error fetching EPIC: ", error);
      }
    };

    fetchEpicPhotos();
  }, [apiKeyContext.apiKey]);

  const renderImageItem = ({ item }) => (
    <View style={{ width: "50%", height: 160, padding: 5 }}>
      <Image source={{ uri: item }} style={styles.image} />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={imgs}
        renderItem={renderImageItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
      />
    </View>
  );
};

const Mars = () => {
  const [imgs, setImgs] = useState([]);
  const apiKeyContext = useContext(ApiKeyContext);

  useEffect(() => {
    const fetchMarsPhotos = async () => {
      try {
        const response = await fetch(
          `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=350&api_key=${apiKeyContext.apiKey}`
        );
        const data = await response.json();
        const photos = data.photos;

        const imgSrcs = [];
        for (let i = 0; i < photos.length; i++) {
          const imgSrc = photos[i].img_src;
          imgSrcs.push(imgSrc);
        }
        setImgs(imgSrcs);
      } catch (error) {
        console.error("Error fetching Mars: ", error);
      }
    };

    fetchMarsPhotos();
  }, [apiKeyContext.apiKey]);

  const renderImageItem = ({ item }) => (
    <View style={{ width: "50%", height: 200, padding: 5 }}>
      <Image source={{ uri: item }} style={styles.image} />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={imgs}
        renderItem={renderImageItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
      />
    </View>
  );
};

const MyComponent = () => {
  const [index, setIndex] = useState(0);
  const [title, setTitle] = useState("APOD");

  const [isModalVisible, setModalVisible] = useState(true);
  const [apiKey, setApiKey] = useState(null);

  const closeModal = () => {
    setModalVisible(false);
  };

  const apiKeyValue = { apiKey, setApiKey };

  const routes = [
    { key: "apod", title: "APOD", focusedIcon: "asterisk" },
    { key: "asteroids", title: "Asteroids", focusedIcon: "blur" },
    { key: "earth", title: "Earth", focusedIcon: "baby-face" },
    { key: "epic", title: "EPIC", focusedIcon: "earth" },
    { key: "mars", title: "Mars", focusedIcon: "alien" },
  ];

  const renderScene = BottomNavigation.SceneMap({
    apod: APOD,
    asteroids: Asteroids,
    earth: Earth,
    epic: Epic,
    mars: Mars,
  });

  const handleIndexChange = (newIndex) => {
    setIndex(newIndex);
    setTitle(routes[newIndex].title);
  };

  return (
    <SafeAreaProvider>
      <ApiKeyContext.Provider value={apiKeyValue}>
        <MyModal isVisible={isModalVisible} closeModal={closeModal} />
        <AppBarComponent title={title} />
        <BottomNavigation
          navigationState={{ index, routes }}
          onIndexChange={handleIndexChange}
          renderScene={renderScene}
        />
      </ApiKeyContext.Provider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    overflow: "hidden",
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTabItem: {
    backgroundColor: "#f6edfc",
  },
  iosTabItem: {
    borderBottomColor: "transparent",
  },
  tabItemText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#555",
  },
  activeTabItemText: {
    color: "#000",
  },
  iosTabItemText: {
    color: "#007AFF",
  },
});

export default MyComponent;