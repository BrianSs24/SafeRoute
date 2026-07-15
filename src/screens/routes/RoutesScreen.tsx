import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import MapView, { Polyline } from "react-native-maps";

import DestinationMarker from "../../components/map/DestinationMarker";
import IncidentBottomSheet from "../../components/map/IncidentBottomSheet";
import IncidentMarker from "../../components/map/IncidentMarker";
import MyLocationButton from "../../components/map/MyLocationButton";
import SearchBar from "../../components/map/SearchBar";
import SearchResults from "../../components/map/SearchResults";
import { useAppTheme } from "../../context/AppSettingsContext";

import { getRoute } from "../../services/GoogleDirectionsService";

import {
  getPlaceDetails,
  searchPlaces,
} from "../../services/GooglePlacesService";

import darkMapStyle from "../../styles/darkMapStyle";
import { loadRoutes } from "../../viewmodels/routes/RoutesViewModel";

export default function RoutesScreen() {
  const theme = useAppTheme();

  const mapRef = useRef<MapView>(null);
  const searchInputRef = useRef<TextInput>(null);

  const [loading, setLoading] = useState(true);
  const [loadingRoute, setLoadingRoute] =
    useState(false);

  const [region, setRegion] = useState({
    latitude: 19.2227,
    longitude: -70.5297,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03,
  });

  const [incidents, setIncidents] =
    useState<any[]>([]);

  const [selectedIncident,
    setSelectedIncident] =
    useState<any | null>(null);

  const [search, setSearch] =
    useState("");

  const [places, setPlaces] =
    useState<any[]>([]);

  const [destination,
    setDestination] =
    useState<any | null>(null);

  const [routeCoordinates,
    setRouteCoordinates] =
    useState<any[]>([]);

  useEffect(() => {
    initialize();
  }, []);

  async function initialize() {

    try {

      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {

        Alert.alert(
          "Permiso requerido",
          "Debes permitir el acceso a la ubicación."
        );

        return;

      }

      const location =
        await Location.getCurrentPositionAsync({
          accuracy:
            Location.Accuracy.High,
        });

      const currentRegion = {

        latitude:
          location.coords.latitude,

        longitude:
          location.coords.longitude,

        latitudeDelta: 0.03,

        longitudeDelta: 0.03,

      };

      setRegion(currentRegion);

      const result =
        await loadRoutes();

      if (result.success) {

        setIncidents(
          result.incidents
        );

      }

      setTimeout(() => {

        mapRef.current?.animateToRegion(
          currentRegion,
          1000
        );

      }, 300);

    } catch (error) {

      console.log(error);

      Alert.alert(
        "Error",
        "No fue posible cargar el mapa."
      );

    } finally {

      setLoading(false);

    }

  }

  async function onSearch(
    text: string
  ) {

    setSearch(text);

    if (
      text.trim().length < 2
    ) {

      setPlaces([]);

      return;

    }

    const result =
      await searchPlaces(text);

    setPlaces(result);

  }

  function resetSearch() {

    searchInputRef.current?.blur();

    Keyboard.dismiss();

    setSearch("");

    setPlaces([]);

  }

  if (loading) return null;
  return (

  <View
    style={[
      styles.container,
      { backgroundColor: theme.colors.background },
    ]}
  >

    <MapView
      ref={mapRef}
      style={styles.map}
      initialRegion={region}
      customMapStyle={theme.darkMode ? darkMapStyle : undefined}
      showsUserLocation
      showsCompass
      showsMyLocationButton={false}
      onPanDrag={() => {

        if (places.length > 0) {

          Keyboard.dismiss();

          searchInputRef.current?.blur();

          setPlaces([]);

        }

      }}
    >

      {routeCoordinates.length > 0 && (
        <>
          <Polyline
            coordinates={routeCoordinates}
            strokeWidth={10}
            strokeColor="#D9E7FF"
            lineCap="round"
            lineJoin="round"
            zIndex={1}
          />

          <Polyline
            coordinates={routeCoordinates}
            strokeWidth={6}
            strokeColor="#2563EB"
            lineCap="round"
            lineJoin="round"
            zIndex={2}
          />
        </>
      )}

      {destination && (
        <DestinationMarker
          latitude={destination.latitude}
          longitude={destination.longitude}
        />
      )}

      {incidents.map((incident) => (

        <IncidentMarker
          key={incident.id}
          incident={incident}
          selected={
            selectedIncident?.id === incident.id
          }
          onPress={() => {

            setSelectedIncident(incident);

            mapRef.current?.animateToRegion(
              {
                latitude: Number(
                  incident.latitude
                ),
                longitude: Number(
                  incident.longitude
                ),
                latitudeDelta: 0.008,
                longitudeDelta: 0.008,
              },
              700
            );

          }}
        />

      ))}

    </MapView>

    <SearchBar
      ref={searchInputRef}
      value={search}
      onChangeText={onSearch}
    />

    <SearchResults
      data={places}
      onSelect={async (place) => {

        try {

          setLoadingRoute(true);

          const details =
            await getPlaceDetails(
              place.placePrediction.place
            );

          if (!details) {

            setLoadingRoute(false);

            return;

          }

          const coordinate = {
            latitude: details.location.latitude,
            longitude: details.location.longitude,
          };

          setDestination(coordinate);

          const route =
            await getRoute(
              {
                latitude: region.latitude,
                longitude: region.longitude,
              },
              coordinate
            );

          if (route) {

            setRouteCoordinates(
              route.coordinates
            );

          }

          setSearch(
            details.displayName?.text ?? ""
          );

          setPlaces([]);

          searchInputRef.current?.blur();

          Keyboard.dismiss();

          const cameraRegion = {

            latitude:
              coordinate.latitude - 0.0035,

            longitude:
              coordinate.longitude,

            latitudeDelta: 0.015,

            longitudeDelta: 0.015,

          };

          mapRef.current?.animateToRegion(
            cameraRegion,
            900
          );

        } catch (e) {

          console.log(e);

          Alert.alert(
            "Error",
            "No fue posible calcular la ruta."
          );

        } finally {

          setLoadingRoute(false);

        }

      }}
    />

    {loadingRoute && (

      <View
        style={[
          styles.loadingRoute,
          { backgroundColor: theme.colors.surface },
        ]}
      >

        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
        />

      </View>

    )}

    <MyLocationButton
      onPress={async () => {

        try {

          const location =
            await Location.getCurrentPositionAsync({
              accuracy:
                Location.Accuracy.High,
            });

          const newRegion = {

            latitude:
              location.coords.latitude,

            longitude:
              location.coords.longitude,

            latitudeDelta: 0.012,

            longitudeDelta: 0.012,

          };

          setRegion(newRegion);

          mapRef.current?.animateToRegion(
            newRegion,
            900
          );

        } catch (e) {

          console.log(e);

        }

      }}
    />

    <IncidentBottomSheet
      incident={selectedIncident}
    />

  </View>

);

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },

  map: {
    flex: 1,
  },

  loadingRoute: {

    position: "absolute",

    top: "50%",

    alignSelf: "center",

    marginTop: -35,

    width: 70,

    height: 70,

    borderRadius: 35,

    justifyContent: "center",

    alignItems: "center",

    elevation: 12,

    shadowColor: "#000",

    shadowOpacity: 0.15,

    shadowRadius: 10,

    shadowOffset: {
      width: 0,
      height: 5,
    },

  },

});