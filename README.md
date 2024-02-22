# intin 
This is a personal project that uses React,Express.js,Node.js,MySQL(MariaDB).

This project delivers a Q&A website experience in Turkish and is published at https://intin.com.tr.

You can reach me at https://www.linkedin.com/in/menevseyup/.

To run the website, you need to have Docker installed.

Follow these steps to run and access the website from your environment:
- Create a file called '.env' in the project directory.
- In that file, define these environment variables : BACKEND_URL, FRONTEND_URL, MYSQL_USER, MYSQL_ROOT_PASSWORD, MYSQL_PASSWORD, MYSQL_DATABASE.
- Edit the REACT_APP_BACKEND_URL environment variable in 'frontend/Dockerfile'.
- Type 'docker compose up' in your terminal in the project main folder.
- Go to the FRONTEND_URL address on your browser to view the website.
