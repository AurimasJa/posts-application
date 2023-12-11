# Simple posts application using Vue 2 + Vue router 3 + Vuex 3 + json-server
</br>
I have successfully developed posts application that empowers user to create, delete, update and read authors and posts including search functionality and pagination in both views.</br>

## Posts
User can create post by choosing an author, writing post title and body.</br>
User can delete post by id.</br>
User can read single post or posts list in different views with all information.</br>
User can update post title and body.</br>
Validation is included</br>
</br>
## Authors
User can easily add authors by providing his name. </br>
User can see authors list.</br>
User can remove specific author by id.</br>
User can update author by changing his name.</br>
Validation is included</br>
</br>
## Search functionality</br>
Ability to search posts/authors by providing some kind of query in search input.</br>
Search input using ```_debounce``` so it will automatically get all available data.</br>

## Pagination
There is also pagination, you can choose which page you want to check.
Validation is included

## Router
Ability to go through different endpoints
The application employs Vue Router to enable seamless navigation through different endpoints. Each endpoint corresponds to a specific view.

- `/authors`: Displays the list of authors and provides author-related functionalities.
- `/posts`: Presents a list of posts and facilitates post-related operations.
- `/posts/{id}`: Allows users to view a specific post identified by its unique ID.

Routers being created using nested route pattern

## Store
All data is being handled in vuex store to centralize state management and ensure data consistency across components.
