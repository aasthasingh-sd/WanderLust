
  mapboxgl.accessToken =window.mapToken;

    const map = new mapboxgl.Map({
        style : 'mapbox://styles/mapbox/streets-v12',
        container: 'map', // container ID
        center: window.coordinates , // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
    });

    const marker1 = new mapboxgl.Marker({color : 'red'})
        .setLngLat(window.coordinates)
        .setPopup(new mapboxgl.Popup({offset:25})
        .setHTML("<h4>Exact Location Provided </h4>"))
        .addTo(map);
