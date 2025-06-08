import { users } from 'src/_mock';

export function Auth(username: string, password: string) {
  console.log(username, password);
  console.log(users);

  const userIndex = users.findIndex(
    (u) => u.username === username && u.password === password
  );

  if (userIndex !== -1) {
    const user = users[userIndex];
    console.log("Usuario encontrado:", user);
    
    localStorage.setItem('name', user.name);
    localStorage.setItem('email', user.username);
    return true;
  }

  return false;
}

export function isAuthenticated() {
  return localStorage.getItem('name') !== null;
}

export function logout() {
  localStorage.removeItem("name")
  localStorage.removeItem("email")
  localStorage.clear()
}
