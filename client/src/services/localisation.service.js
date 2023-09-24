export function getLocalisationCoordinates() {
    return new Promise((resolve, reject) => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const longitude = position.coords.longitude;
                    const latitude = position.coords.latitude;
                    resolve({ error: null, longitude: longitude, latitude: latitude });
                },
                (error) => {
                    let errorMessage = '';
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = "La demande de géolocalisation a été refusée.";
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = "Les données de géolocalisation ne sont pas disponibles.";
                            break;
                        case error.TIMEOUT:
                            errorMessage = "La demande de géolocalisation a expiré.";
                            break;
                        case error.UNKNOWN_ERROR:
                            errorMessage = "Une erreur inconnue s'est produite.";
                            break;
                    }
                    resolve({ error: errorMessage });
                }
            );
        } else {
            resolve({ error: "La géolocalisation n'est pas prise en charge par ce navigateur." });
        }
    });
}
