# Coalition Technologies 2024 Frontend Development Challenge

Coalition Technologies 2024 Frontend Development challenge hosted by TestRecruits Solution.

## How to Run the Project

1. Clone the repository to your local machine.
   
   ```bash
   git clone https://github.com/your-username/coalition-frontend-challenge.git
   ```

2. Navigate to the project directory.
   
   ```bash
   cd coalition-frontend-challenge
   ```

3. Update API Credentials in api.js

   - Access the `api.js` file in the project directory.
   - Replace the `localStorage` call with your actual Coalition API username and password.
   
   ```javascript
   let credentials = {
       username: decryptData("encrypted-username-here", 3),
       password: decryptData("encrypted-password-here", 3)
   };
   ```

   Remember to replace `"encrypted-username-here"` and `"encrypted-password-here"` with your actual encrypted credentials.

4. Open the `index.html` file in your browser to view the project.

## Encryption and Decryption Functions

To encrypt and decrypt data, the following functions can be used in the project:

```javascript
function encryptData(data, shift) {
    // Implementation of encryption function
}

function decryptData(data, shift) {
    return encryptData(data, 26 - shift); // Uses encryption function with reverse shift
}
```

## Example Usage

### Encrypt Data
```javascript
const username = "coalition";
const password = "skills-test";

// Encrypt username and password with a shift of 3
const encryptedUsername = encryptData(username, 3);
const encryptedPassword = encryptData(password, 3);

// Store encrypted credentials in local storage
// Example usage
const credentials = {
    username: encryptedUsername,
    password: encryptedPassword
};

const credentialsJSON = JSON.stringify(credentials);
localStorage.setItem('credentials', credentialsJSON);
```

### Decrypt Data
```javascript
// Retrieve stored encrypted credentials from local storage
const storedCredentialsJSON = localStorage.getItem('credentials');

if (storedCredentialsJSON) {
    const storedCredentials = JSON.parse(storedCredentialsJSON);

    // Decrypt stored username and password with a shift of 3
    const username = decryptData(storedCredentials.username, 3);
    const password = decryptData(storedCredentials.password, 3);
    
    console.log("Decrypted Username:", username);
    console.log("Decrypted Password:", password);
}
```









   Alternatively, you can run the following code snippet to save the username and password to your browser storage:

   ```javascript
   let credentials = {
       username: "coalition",
       password: "skills-test"
   };
   ```

   **Note:** You can use the provided `encrypt` and `decrypt` functions for secure storage and retrieval of credentials if needed.

4. Open the `index.html` file in your browser to view the project.

## Project Structure

- `index.html`: Main HTML file for the project.
- `styles.css`: CSS file for styling the project.
- `script.js`: JavaScript file for dynamic functionality.
- `api.js`: Handles API requests. Update credentials as instructed.
- `assets/`: Folder containing images and icons used in the project.

Feel free to explore the project and provide any feedback or suggestions for improvement.
---

Code fast and smarter. 
