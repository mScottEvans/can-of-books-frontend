import React from 'react';
import axios from 'axios';
import Header from './Header';
import BestBooks from './BestBooks';
import About from './About';
import Footer from './Footer';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import BookFormModal from './BookFormModal';
import UpdateBookModal from './BookFormModal';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [],
      showModal: false
    }
  }

  hideModalHandler = () => {
    this.setState({
      showModal: false
    });
  }

  showModalHandler = () => {
    this.setState({
      showModal: true
    });
  }

  getBooks = async () => {

    try {
      let results = await axios.get(`${process.env.REACT_APP_SERVER}/books`);
      this.setState({
        books: results.data
      })
    }
    catch (error) {
      console.log('Error: ', error.response);
    }
  }

  postBook = async (book) => {
    try {
      let results = `${process.env.REACT_APP_SERVER}/books`;
      let createdBook = await axios.post(results, book);
      console.log(createdBook.data);
      this.setState({
        books: [...this.state.books, createdBook.data]
      });
    } catch (error) {
      console.log('Error: ', error.response.data);
    }
  }

  deleteBook = async (id) => {
    try {
      let url = `${process.env.REACT_APP_SERVER}/books/${id}`;
      await axios.delete(url);
      let updatedBooks = this.state.books.filter(book => book._id !== id);
      this.setState({
        books: updatedBooks
      });
    } catch(error) {
      console.log('Error: ', error.response.data);
    }
  }

  updateBook = async (bookToUpdate) => {
    try {
      let url = `${process.env.REACT_APP_SERVER}/books/${bookToUpdate._id}`;
      let updatedBook = await axios.put(url, bookToUpdate);
      let updatedBookArray = this.state.books.map(existingBook => {
        return existingBook._id === bookToUpdate._id
          ? updatedBook.data
          : existingBook;
      });
      this.setState({
        cats: updatedBookArray
      });
    } catch(error) {
      console.log('Error: ', error.response.data);
    }
  }

  handleBookSubmit = (e) => {
    e.preventDefault();
    console.log(e.target.title.value)
    let book = {
      title: e.target.title.value,
      description: e.target.description.value,
      status: e.target.status.value,
    }
    this.setState({
      showModal: false
    });
    this.postBook(book);
  }

  componentDidMount() {
    this.getBooks();
  }

  render() {
    return (
      <>
        <Router>
          <Header />
          <Switch>
            <Route exact path="/">
              <Button onClick={this.showModalHandler}>Add a book!</Button>
              <BestBooks
                books={this.state.books}
                deleteBook={this.deleteBook}
                updateBook={this.updateBook}
              />
              <BookFormModal
                showModal={this.state.showModal}
                hideModalHandler={this.hideModalHandler}
                handleBookSubmit={this.handleBookSubmit}
              />
              <UpdateBookModal
                showModal={this.state.showModal}
                hideModalHandler={this.hideModalHandler}
              />
            </Route>
            <Route path="/about">
              <About />
            </Route>
          </Switch>
          <Footer />
        </Router>
      </>
    )
  }
}

export default App;
