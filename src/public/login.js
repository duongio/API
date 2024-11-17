const confirmLogin = document.querySelector('button[type="submit"]');
confirmLogin.onclick = (event) => {
    event.preventDefault();
    const username = document.querySelector('input[name="username"]').value;
    const password = document.querySelector('input[name="password"]').value;
    const data = {
        username: username,
        password: password
    }
    fetch('http://localhost:3000/api/login/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem('user_id', data.user_id);
            localStorage.setItem('token', data.token);
            localStorage.setItem('refreshToken', data.refreshToken);
            window.location.href = '/api/';
        })
        .catch(error => {
            console.error("Fetch error:", error);
            alert("Error.");
        })
}