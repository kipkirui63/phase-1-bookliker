document.addEventListener("DOMContentLoaded", function() {
    const list = document.getElementById('list');
    const showPanel = document.getElementById('show-panel');
    let currentUser;
  
    // Fetch the list of books
    fetch('http://localhost:3000/books')
      .then(response => response.json())
      .then(books => {
        // Create a list item for each book
        books.forEach(book => {
          const listItem = document.createElement('li');
          listItem.textContent = book.title;
  
          // Add click event listener to display book details
          listItem.addEventListener('click', () => {
            showBookDetails(book);
          });
  
          list.appendChild(listItem);
        });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  
    function showBookDetails(book) {
      // Clear the show panel
      showPanel.innerHTML = '';
  
      // Create elements for book details
      const thumbnail = document.createElement('img');
      thumbnail.src = book.thumbnailUrl;
  
      const description = document.createElement('p');
      description.textContent = book.description;
  
      const likedBy = document.createElement('ul');
      book.users.forEach(user => {
        const userItem = document.createElement('li');
        userItem.textContent = user.username;
        likedBy.appendChild(userItem);
      });
  
      const likeButton = document.createElement('button');
      likeButton.textContent = 'LIKE';
      likeButton.addEventListener('click', () => {
        if (currentUserLikedBook(book)) {
          unlikeBook(book);
        } else {
          likeBook(book);
        }
      });
  
      // Append book details to the show panel
      showPanel.appendChild(thumbnail);
      showPanel.appendChild(description);
      showPanel.appendChild(likedBy);
      showPanel.appendChild(likeButton);
    }
  
    function currentUserLikedBook(book) {
      return book.users.some(user => user.id === currentUser.id);
    }
  
    function likeBook(book) {
      book.users.push(currentUser);
  
      const patchData = {
        users: book.users
      };
  
      fetch(`http://localhost:3000/books/${book.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(patchData)
      })
        .then(response => response.json())
        .then(updatedBook => {
          updateLikedByList(updatedBook);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  
    function unlikeBook(book) {
      const filteredUsers = book.users.filter(user => user.id !== currentUser.id);
      book.users = filteredUsers;
  
      const patchData = {
        users: book.users
      };
  
      fetch(`http://localhost:3000/books/${book.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(patchData)
      })
        .then(response => response.json())
        .then(updatedBook => {
          updateLikedByList(updatedBook);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  
    function updateLikedByList(book) {
      const likedBy = document.querySelector('#show-panel ul');
      likedBy.innerHTML = '';
  
      book.users.forEach(user => {
        const userItem = document.createElement('li');
        userItem.textContent = user.username;
        likedBy.appendChild(userItem);
      });
    }
  
    // Simulating current user (replace with your authentication logic)
    currentUser = {
      id: 1,
      username: 'pouros'
    };
  });
  