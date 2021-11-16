// getPets funkcija priima rusiavimo tvarka pagal amziu ir tipus, pagal kuriuos filtruosim

export const getPets = async (ageSortOrder, typeFilters) => { 

    // sukuriam query parametrus
    const query = new URLSearchParams();

    // nustatom rusiavimo tvarka
    query.set('ageSort', ageSortOrder);

    // nustatom gyvunus tipus, kuriuos norim matyt
    query.set('typeFilters', typeFilters)

    // paverciam query parametrus i stringa ir pridedam prie pagr url.
    // darom fetch requesta
    const response = await fetch('http://localhost:3000/pets?'+query.toString());
    const json = await response.json()
    return json;
}

export const addPet = async (pet) => { 
    const response = await fetch('http://localhost:3000/pets', {
        method: 'POST',
        body: JSON.stringify(pet),
        headers: {
            "content-type": 'application/json'
        }
    });
    const json = await response.json()
    return json;
}