import { useEffect } from "react";
import { useMapbox } from "../hooks/useMapbox";

const puntoInicial = {
    lng: -73.646256,
    lat: 4.102596,
    zoom: 15
}
export const MapaPage = () => {

    const { coords, setRef, nuevoMarcador$, movimientoMarcador$ } = useMapbox(puntoInicial);

    useEffect(() => {

        nuevoMarcador$.subscribe(marcador => {

        });

    }, [nuevoMarcador$])

    useEffect(() => {
        movimientoMarcador$.subscribe(marcador => {

        });
    }, [movimientoMarcador$])

    return (
        <>
            <div className='infoWindow'>
                Lng: {coords.lng} | Lat: {coords.lat} | Zoom: {coords.zoom}
            </div>
            <div
                ref={setRef}
                className='mapContainer'>
            </div>
        </>
    )
}
