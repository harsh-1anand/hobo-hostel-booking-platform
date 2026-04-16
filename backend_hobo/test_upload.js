const jwt = require('jsonwebtoken');

async function test() {
  try {
    const token = jwt.sign({ id: '69b842fa5bd08bce1ced7a1f', role: 'owner' }, 'hobo_secret_key_123');
    
    const form = new FormData();
    form.append('name', 'Test Property');
    form.append('location', 'Test City');
    form.append('price', '1000');
    form.append('type', 'Boys');
    form.append('availableBeds', '5');
    form.append('description', 'Test Description');

    const res = await fetch('http://localhost:5000/api/hostels', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: form
    });
    const data = await res.json();
    console.log(res.status, data);
  } catch (err) {
    console.error(err);
  }
}
test();
