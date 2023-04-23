import { useCallback, useEffect, useRef, useState } from 'react'

import mapboxgl from 'mapbox-gl'
import { v4 } from 'uuid';
import { Subject } from 'rxjs';

mapboxgl.accessToken = 'pk.eyJ1IjoiYW5jaXphciIsImEiOiJjbGdzcGwwNTQxdmZmM2ZxYTVjOHU5OHE4In0.4ht31C_GJnpmktcwNsNm-Q';

export const useMapbox = (puntoInicial) => {

    // Referencia al div del mapa
    const mapDiv = useRef();
    const setRef = useCallback((node) => {
        mapDiv.current = node;
    }, []);

    // referencia a los marcadores
    const marcadores = useRef({});

    // Observables de RxJs
    const movimientoMarcador = useRef(new Subject());
    const nuevoMarcador = useRef(new Subject());

    // Mapa y coords
    const mapa = useRef();
    const [coords, setCoords] = useState(puntoInicial);

    // Funcion para agregar marcadores
    const agregarMarcador = useCallback((ev, id) => {
        const { lng, lat } = ev?.lngLat || ev;
        const marker = new mapboxgl.Marker();
        marker.id = id ?? v4();
        marker
            .setLngLat([lng, lat])
            .addTo(mapa.current)
            .setDraggable(true);

        // Agregar marcador al objeto de marcadores
        marcadores.current[marker.id] = marker;

        nuevoMarcador.current.next({
            id: marker.id,
            lng,
            lat
        });

        // Escuchar movimientos del marcador
        marker.on('drag', ({ target }) => {
            const { id } = target;
            const { lng, lat } = target.getLngLat();
            movimientoMarcador.current.next({ id, lng, lat });
        });
    }, []);


    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapDiv.current, // container ID
            style: 'mapbox://styles/mapbox/streets-v12', // style URL
            center: [puntoInicial.lng, puntoInicial.lat], // starting position [lng, lat]
            zoom: puntoInicial.zoom, // starting zoom
        });

        mapa.current = map;
    }, [puntoInicial]);

    // Cambiar la localizacion del mapa cuando se mueve
    useEffect(() => {
        mapa.current?.on('move', () => {
            const { lng, lat } = mapa.current.getCenter();
            setCoords({
                lng: lng.toFixed(4),
                lat: lat.toFixed(4),
                zoom: mapa.current.getZoom().toFixed(2)
            })
        });

        // return mapa.current?.off('move');
    }, [])

    // Agregar marcadores
    useEffect(() => {
        mapa.current?.on('click', agregarMarcador);
    }, [agregarMarcador])

    return {
        coords,
        // marcadores,
        nuevoMarcador$: nuevoMarcador.current, // $ al final para indicar que es un observable
        movimientoMarcador$: movimientoMarcador.current, // $ al final para indicar que es un observable
        // agregarMarcador,
        setRef
    }
}
