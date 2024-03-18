<template>
  <div id="map" ref="mapElement" class="w-full h-full" />
</template>

<script lang="ts" setup>
// eslint-disable-next-line no-restricted-imports
import 'maplibre-gl/dist/maplibre-gl.css';

import {
  GeolocateControl,
  Map,
  NavigationControl,
  Marker,
  LngLatBounds,
  type Source,
  GeoJSONSource,
  type LngLatLike,
} from 'maplibre-gl';
import type { Feature, FeatureCollection, GeoJsonProperties, Geometry, LineString, Point } from 'geojson';
import { useStorage } from '@vueuse/core';

let map: Map;

// TODO: allow to configure map style
const mapStyle = 'https://tiles.ju60.de/styles/bright-matter/style.json';

const mapElement = ref(null);

const props = defineProps<{
  center?: [number, number];
  disableControls?: boolean;
  zoom?: number;
  stops?: {
    id: string;
    name: string;
    location: {
      latitude: number;
      longitude: number;
    };
  }[];
}>();

const emit = defineEmits<{
  (event: 'click'): void;
  (event: 'visibleAreaChanged', visibleArea: LngLatBounds): void;
}>();

const center = toRef(props, 'center');
const disableControls = toRef(props, 'disableControls');
const zoom = toRef(props, 'zoom');

const stopsGeoJson = computed<Feature<Point, GeoJsonProperties>[]>(
  () =>
    props.stops?.map((s) => ({
      type: 'Feature',
      properties: {
        kind: 'stop',
        title: s.name,
      },
      geometry: {
        type: 'Point',
        coordinates: [s.location.longitude, s.location.latitude],
      },
    })) || [],
);

const geojson = computed<FeatureCollection<Geometry, GeoJsonProperties>>(() => ({
  type: 'FeatureCollection',
  features: [...stopsGeoJson.value],
}));

const lastLocation = useStorage<{ center: LngLatLike; zoom: number; pitch: number; bearing: number }>(
  `hub.last_location`,
  {
    center: center.value || [10.375386, 50.9052784],
    zoom: zoom.value || 4,
    pitch: 0,
    bearing: 0,
  },
);

onMounted(async () => {
  if (process.server) return;

  map = new Map({
    container: 'map',
    style: mapStyle,
    minZoom: 5,
    maxZoom: 18,
    center: lastLocation.value.center,
    zoom: lastLocation.value.zoom,
    pitch: lastLocation.value.pitch,
    bearing: lastLocation.value.bearing,
    // [west, south, east, north]
    // maxBounds: [5.0, 46.0, 15.0, 57.0], // germany
  });

  if (disableControls.value) {
    map.dragRotate.disable();
    map.touchZoomRotate.disableRotation();
    map.doubleClickZoom.disable();
    map.scrollZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
    map.dragPan.disable();
  } else {
    map.addControl(
      new GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      }),
      'bottom-right',
    );

    map.addControl(new NavigationControl({}), 'bottom-right');
  }

  map.on('load', () => {
    map.addSource('geojson', {
      type: 'geojson',
      data: Object.freeze(geojson.value),
    });

    map.addLayer({
      id: 'stops',
      type: 'circle',
      source: 'geojson',
      filter: ['==', 'kind', 'stop'],
      paint: {
        'circle-radius': 4,
        'circle-color': '#B42222',
      },
    });

    map.addLayer({
      id: 'vehicles',
      type: 'circle',
      source: 'geojson',
      filter: ['==', 'kind', 'vehicles'],
      paint: {
        'circle-radius': 4,
        'circle-color': '#A0A0A0',
      },
    });

    emit('visibleAreaChanged', map.getBounds());
  });

  map.on('click', (e) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ['stops', 'vehicles'],
    });

    // Deselect marker when the map is clicked
    if (features.length === 0) {
      // emit('markerClick');
      return;
    }

    const feature = features[0] as unknown as {
      geometry: Point;
      properties: Marker;
    };

    // Prevent reloading the same marker
    // if (feature.properties.id === selectedMarker.value.id) {
    //   return;
    // }
    console.log(feature);
  });

  // Change the cursor to a pointer when the it enters a feature in the 'symbols' layer.
  map.on('mouseenter', 'vehicles', () => {
    map.getCanvas().style.cursor = 'pointer';
  });

  // Change it back to a pointer when it leaves.
  map.on('mouseleave', 'vehicles', () => {
    map.getCanvas().style.cursor = '';
  });

  // Change the cursor to a pointer when the it enters a feature in the 'symbols' layer.
  map.on('mouseenter', 'stops', () => {
    map.getCanvas().style.cursor = 'pointer';
  });

  // Change it back to a pointer when it leaves.
  map.on('mouseleave', 'stops', () => {
    map.getCanvas().style.cursor = '';
  });

  map.on('moveend', () => {
    emit('visibleAreaChanged', map.getBounds());

    lastLocation.value = {
      center: map.getCenter(),
      zoom: map.getZoom(),
      pitch: map.getPitch(),
      bearing: map.getBearing(),
    };
  });
});

watch(geojson, () => {
  if (!map) {
    return;
  }

  const geoJSONSource = map.getSource('geojson');
  const isGeoJsonSource = (source?: Source): source is GeoJSONSource => source?.type === 'geojson';
  if (isGeoJsonSource(geoJSONSource)) {
    geoJSONSource.setData(Object.freeze(geojson.value));
  }
});
</script>

<style scoped>
#map :deep(.maplibregl-ctrl-attrib) {
  @apply dark:bg-zinc-400;
}

#map :deep(.maplibregl-ctrl-attrib a) {
  @apply dark:text-gray-300;
}

/* #map :deep(.maplibregl-ctrl-attrib-button) {
  @apply dark:(filter invert);
} */

#map :deep(.maplibregl-ctrl-group) {
  @apply dark:bg-zinc-400;
}

.dark #map :deep(.maplibregl-ctrl-group:not(:empty)) {
  box-shadow: 0 0 0 2px rgb(60 60 60);
}

#map :deep(.maplibregl-ctrl-group button + button) {
  @apply dark:border-t-zinc-100;
}

/* #map :deep(.maplibregl-ctrl button .maplibregl-ctrl-icon) {
  @apply dark:(filter invert);
} */
</style>
