import React from "react";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Landing from "../Landing/Landing";
import Register from "../Register/Register";
import Login from "../Login/Login";
import Profile from "../Profile/Profile";
import CardDesc from "../CardDesc/CardDesc";
import * as auth from "../../utils/Auth.js";
import { infoMessage, errorMessage, authErrors, succesOk } from "../../utils/constants";
import ModalInfo from "../ModalInfo/ModalInfo";
import AddNewFlats from "../AddCard/AddNewFlats";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import "./App.css";
import api from "../../utils/Api.js";
import SelectObject from "../AddCard/SelectObject";
import NotFound from "../NotFound/NotFound";
import FlatsList from "../Flats/FlatsList";
import ProtectedRoute from "../ProtectedRoute";
import ConfirmList from "../Confirm/ConfirmList";
import ImageBlocks from "../Auxiliary/ImageBlocks";
import ImagePopup from "../Auxiliary/ImagePopup";
import Menu from "../Menu/Menu";

function App() {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const history= useHistory();
  const location = useLocation();
  const [showImagePopup,setShowImagePopup] = React.useState('');
  const [currentUser, setCurrentUser] = React.useState({});
  const [upDateUser, setUpDateUser] = React.useState({});
  const [showModal, setShowModal] = React.useState(false);
  const [iconVisual, setIconVisual] = React.useState(false);
  const [textsucces, setTextsucces] = React.useState("");
  const [users, setUsers] = React.useState([]);
  const [cards, setCards] = React.useState([]);
  const [showCardModal,setShowCardModal] = React.useState(false);
  const [showSelectModal,setShowSelectModal] = React.useState(false);
  const [object, setObject ] = React.useState('') 
  

  //Получение Всех карточек с сервера
  React.useEffect(() => {
    if (loggedIn) {
      Promise.all([api.getUsers(), api.getCards(), auth.getContent()])
        .then(([userData, cardlist, currentUser]) => {
          setCards(cardlist);
          setUsers(userData);

  
//Регистрация пользователя
function onRegister( name, email, surname, phone, agency, password ) {
  auth.register(name, email, surname, phone, agency, password)
  .then((res) => {
    history.push('/');
    setShowModal(true)
    setIconVisual(true)
    setTextsucces(succesOk.signinOk)
  })
  .catch(err => {
    if(err === authErrors.conflictErr) { 
      setShowModal(true)
      setIconVisual(false)
      setTextsucces(errorMessage.emailError)
    } else {
      setShowModal(true)
      setIconVisual(false)
      setTextsucces(errorMessage.registrError)
      
    }
  }, [loggedIn]);

  //Получение токена при какждом мониторовании
  React.useEffect(() => {
    tokenCheck();
  }, []);

  console.log(cards);
  //Регистрация пользователя
  function onRegister(name, email, surname, phone, agency, password) {
    auth
      .register(name, email, surname, phone, agency, password)
      .then((res) => {
        history.push("/");
        setShowModal(true);
        setIconVisual(true);
        setTextsucces(succesOk.signinOk);
      })
      .catch((err) => {
        if (err === authErrors.conflictErr) {
          setShowModal(true);
          setIconVisual(false);
          setTextsucces(errorMessage.emailError);
        } else {
          setShowModal(true);
          setIconVisual(false);
          setTextsucces(errorMessage.registrError);
        }
      });
  }

//Получение данных пользователя, email
function tokenCheck() {
  auth.getContent()
  .then((res) => {
    if(res){
      setCurrentUser({
        name: res.name,
        email: res.email,
        surname: res.surname,
        agency: res.agency, 
        phone: res.phone,
        access: res.access,
        admin: res.admin,
        _id: res._id
      })
      setLoggedIn(true)
      if (location.pathname === '/signin' || location.pathname === '/signup') {
        history.push('/profile');
      } else {
        history.push(location.pathname);
      }
    }
  })
  .catch(err => console.log(`Зарегистрируйтесь или войдите в систему: ${err}`))  
}

  //Получение данных пользователя, email
  function tokenCheck() {
    auth
      .getContent()
      .then((res) => {
        console.log("dghg");
        if (res) {
          setLoggedIn(true);
        }
      })
      .catch((err) => console.log(`Зарегистрируйтесь или войдите в систему: ${err}`));
  }

  //Выход из системы
  function onSignOut() {
    auth
      .signOut()
      .then(() => {
        history.push("/signin");
        setLoggedIn(false);
        localStorage.clear();
        setCurrentUser({});
      })
      .catch((err) => console.log(`Не удалось выйти из системы: ${err}`));
  }

  function getCards() {
    api
      .getCards()
      .then((cardlist) => {
        setCards(cardlist);
        localStorage.setItem("searchResult", JSON.stringify(cardlist));
      })
      .catch((err) => console.log(`Не удалось получить карточки: ${err}`));
  }
  //закрытие модального окна
  function handlerClose() {
    setShowModal(false);
    setShowCardModal(false);
    setShowSelectModal(false);
    setShowImagePopup(false);
  }
  function handlerOpenAddModal() {
    setShowSelectModal(false);
    setShowCardModal(true);
  }

  function handlerOpenModal() {
    setShowSelectModal(true);
  }
  function hanldNewcard(values) {
    api
      .createNewCard(values)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        setShowCardModal(false);
      })
      .catch((err) => console.log(`Ошибка при добавлении карточки: ${err}`));
  }

  //функция удаления карточки
  function handleDeleteCard(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards(() => cards.filter((c) => c._id !== card._id));
      })
      .catch((err) => console.log(`Ошибка при загрузке профиля: ${err}`));
  }

  //функция редактирования карточки
  function handleEditCard(card) {
    api.editCard(card._id).then(() => {});
  }

  //функция скрытия карточки
  function handleHideCard(card) {
    api.hideCard(card._id).then(() => {});
  }

  function handleChange(event) {
    setObject(event.target.value);
  }

  function handleImageOpenPopup(image) {
    setShowImagePopup(image);
  }

  //Изменение права доступа юзера
  function handlerUserActive(data) {
    console.log(data);
    api
      .editContent(data.access, data.user._id)
      .then((UpdateUser) => {
        setUsers((state) => state.map((c) => (c._id === data.user._id ? UpdateUser : c)));
      })
      .catch((err) => console.log(`Ошибка при загрузке профиля: ${err}`));
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header />
        <Switch>
          <Route exact path="/">
            <Landing />
          </Route>
          <Route path="/signup">
            <Register onRegister={onRegister} />
          </Route>
          <Route path="/signin">
            <Login onLogin={onLogin} />
          </Route>
          <Route path="/flats">
            <Menu></Menu>
            <FlatsList cards={cards} onCardDelete={handleDeleteCard} onCardEdit={handleEditCard} onCardHide={handleHideCard} />
          </Route>
          <ProtectedRoute
            path="/profile"
            component={Profile}
            loggedIn={loggedIn}
            cards={cards}
            logOut={onSignOut}
            onCardDelete={handleDeleteCard}
            onClick={handlerOpenModal}
          />
          <Route path="/confirm">
            <ConfirmList onUpdateUser={handlerUserActive} onDeleteAcces={handlerUserActive} users={users} />
          </Route>

          <Route path="/:id">
            <CardDesc onCardClick={handleImageOpenPopup} cards={cards} />
          </Route>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
        <Footer />
        <AddNewFlats
          isOpen={showCardModal}
          onClose={handlerClose}
          title="Добавить новый объект"
          name="flats"
          onCardData={hanldNewcard}
          object={object}
        />
        <SelectObject
          isOpen={showSelectModal}
          onClose={handlerClose}
          onNext={handlerOpenAddModal}
          object={object}
          onChange={handleChange}
          name="object"
        />
        <ModalInfo isOpen={showModal} textError={textsucces} onClose={handlerClose} icon={iconVisual} name="modal-info" />
        <ImagePopup onClose={handlerClose} card={showImagePopup !== null && showImagePopup} />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
