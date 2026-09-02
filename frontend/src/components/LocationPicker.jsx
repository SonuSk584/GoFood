import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import axios from "axios";

function LocationMarker({ position, setPosition, setLocation }) {
  useMapEvents({
    click(e) {
      const newPos = [e.latlng.lat, e.latlng.lng];
      setPosition(newPos);

      setLocation({
        lat: newPos[0],
        lng: newPos[1]
      });
    }
  });

  return position ? <Marker position={position} /> : null;
}

function LocationPicker({ setLocation }) {
  const [search, setSearch] = useState("");
  const [position, setPosition] = useState([28.6139, 77.2090]); // default

  // 🔍 SEARCH LOCATION
  const handleSearch = async () => {
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${search}&format=json`
      );

      if (res.data.length > 0) {
        const place = res.data[0];

        const newPos = [
          parseFloat(place.lat),
          parseFloat(place.lon)
        ];

        setPosition(newPos);

        setLocation({
          lat: newPos[0],
          lng: newPos[1],
          address: place.display_name
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 📍 AUTO DETECT LOCATION
  const detectLocation = () => {
    if (!navigator.geolocation) {
      return alert("Geolocation not supported ❌");
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        const newPos = [lat, lng];
        setPosition(newPos);

        // 🔥 Convert lat/lng → address
        try {
          const res = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
          );

          setLocation({
            lat,
            lng,
            address: res.data.display_name
          });
        } catch (err) {
          console.log(err);
          setLocation({ lat, lng });
        }
      },
      () => {
        alert("Permission denied ❌");
      }
    );
  };

  return (
    <div>

      {/* 🔍 SEARCH + 📍 BUTTON */}
      <div className="flex gap-2 mb-2">
        <input
          placeholder="Search location..."
          className="border p-2 w-full"
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={handleSearch}
          className="bg-black text-white px-3"
        >
          Search
        </button>

        <button
          onClick={detectLocation}
          className="bg-blue-500 text-white px-3"
        >
          📍
        </button>
      </div>

      {/* 🗺️ MAP */}
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <LocationMarker
          position={position}
          setPosition={setPosition}
          setLocation={setLocation}
        />
      </MapContainer>
    </div>
  );
}

export default LocationPicker;