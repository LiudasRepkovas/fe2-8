const formElement = document.querySelector('form');
const formButton = document.querySelector('button');

formButton.addEventListener('click', async (event) => {
    event.preventDefault();

    // nusirenkam inputu vertes
    const formData = new FormData(formElement);

    const first_name = formData.get('name');
    const last_name = formData.get('surname');
    const email = formData.get('email')
    const gender = formData.get('gender')
    const car = formData.get('car')

    const userObject = {
        first_name,
        last_name,
        email,
        gender,
        car,
    }


    // siunciam i backa
    await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userObject)
    });
    location.reload(); 
});


const init = async () => {
    const usersResponse = await fetch('http://localhost:3000/users', {method: "GET"});
    const responseJSON = await usersResponse.json();
    
    const wrapper = document.querySelector('.usersWrapper');

    const usersElements = responseJSON.map(userObject => {
        const userElement = document.createElement('div');
        userElement.textContent = `${userObject.first_name} ${userObject.last_name} ${userObject.email}`;
        return userElement;
    })
    
    wrapper.append(...usersElements);
}



init();