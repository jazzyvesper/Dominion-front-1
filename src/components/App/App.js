import React from "react";
import { Route, Switch, useHistory, useLocation  } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Landing from "../Landing/Landing";
import Register from "../Register/Register";
import Login from "../Login/Login";
import Profile from "../Profile/Profile";
import Card from "../Оbjects/Card/Card";
import * as auth from "../../utils/Auth.js";
import { errorMessage, authErrors, succesOk } from "../../utils/constants";
import ModalInfo from "../ModalInfo/ModalInfo";
import AddNewBuilding from "../AddCard/AddNewBuilding";
import EditFlats from "../AddCard/EditFlats";

import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import "./App.css";
import api from "../../utils/Api";
import SelectObject from "../AddCard/SelectObject";
import NotFound from "../NotFound/NotFound";
import ObjectList from "../Оbjects/ObjectList";
import ProtectedRoute from "../ProtectedRoute";
import Skeleton from '../Skeleton/Skeleton';
//import ImageBlocks from "../Auxiliary/ImageBlocks";
import ImagePopup from "../Оbjects/Card/ImagePopup";
import Menu from "../Menu/Menu";

function App() {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const history= useHistory();
  const location = useLocation();
  const [showImagePopup,setShowImagePopup] = React.useState('');
  const [currentUser, setCurrentUser] = React.useState({});
  const [showModal, setShowModal] = React.useState(false);
  const [iconVisual, setIconVisual] = React.useState(false);
  const [textsucces, setTextsucces] = React.useState("");
  const [users, setUsers] = React.useState([]);
  const [cards, setCards] = React.useState([]);
  const [commercial, setCommercial] = React.useState([]);
  const [showCardModal,setShowCardModal] = React.useState(false);
  const [showEditCard,setShowEditCard] = React.useState(false);
  const [showSelectModal,setShowSelectModal] = React.useState(false);
  const [object, setObject ] = React.useState('') 
  const [skeleton, setSkeleton] =  React.useState(false);
  const [selectedCardUpdate, setSelectedCardUpdate] = React.useState(false)
 
  //Получение данных пользователя с сервера
  React.useEffect(() => {
    if (loggedIn) {
      Promise.all([api.getUsers(), auth.getCurrent()])
        .then(([userData, currentUser]) => {
          setUsers(userData);
          setCurrentUser({
            name: currentUser.name,
            email: currentUser.email,
            surname: currentUser.surname,
            agency: currentUser.agency,
            phone: currentUser.phone,
            access: currentUser.access,
            admin: currentUser.admin,
            _id: currentUser._id,
          });
        })
        .catch((err) => {
          if (err === authErrors.notFoundErr) {
            setShowModal(true);
            setIconVisual(false);
            setTextsucces(errorMessage.profilrError);
          } else {
            setShowModal(true);
            setIconVisual(false);
            setTextsucces(errorMessage.internalServerErr);
          }
      })
    }
  }, [loggedIn]);

  //Получение токена при каждом мониторовании
  React.useEffect(() => {
    getCards()
    tokenCheck()
  }, []);

  
  //Регистрация пользователя
  function onRegister(name, email, surname, phone, agency, password) {
    auth.register(name, email, surname, phone, agency, password)
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
  auth.getCurrent()
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
        history.push('/profile/myflats');
      } else {
        history.push(location.pathname);
      }
    }
  })
  .catch(err => console.log(`Зарегистрируйтесь или войдите в систему: ${err}`))  
}
  //Вход в профиль
  function onLogin(email, password) {
    // setSubmitBlock(true)
    auth.authorize(email, password)
      .then((res) => {
        if (res.succes === "no") {
          setShowModal(true);
          setIconVisual(false);
          setTextsucces(res.message);
        } else if (res.succes === "ok") {
          tokenCheck();
          history.push("/profile/myflats");
          setShowModal(true);
          setIconVisual(true);
          setTextsucces(res.message);
        }
      })
      .catch((err) => {
        if (err === authErrors.unauthorizedErr) {
          setIconVisual(false);
          setShowModal(true);
          setTextsucces(errorMessage.emailandPasswordError);
        } else {
          setIconVisual(false);
          setShowModal(true);
          setTextsucces(errorMessage.tokenError);
        }
      });
  }

  //Выход из системы
  function onSignOut() {
    auth.signOut()
    .then(() => {
        history.push("/signin");
        setLoggedIn(false);
        localStorage.clear();
        setCurrentUser({});
      })
      .catch((err) => {
          setIconVisual(false);
          setShowModal(true);
          setTextsucces(errorMessage.signoutErr);
      })
  }
  //Сортировка карточек по дате добавления
  function newcards(cards) {
    const newCards = cards.sort(function (a, b) {
    a = a.createdAt
    b = b.createdAt
    if (a < b) return 1; 
    if (b < a) return -1;
    return 0;

  })
  return newCards
}
  
  //Запрос на получение всех карточек с сервера
  function getCards() {
    setSkeleton(true)
    Promise.all([api.getCards(), api.getCommercialCards()])
    .then(([cardList, commercialList]) => {
        setCards(newcards(cardList));
        setCommercial(newcards(commercialList))
        setSkeleton(false)
      })
      .catch((err) => {
        if (err === authErrors.requestTimeout) {
          setIconVisual(false);
          setShowModal(true);
          setTextsucces(errorMessage.requestTimeout);
        } else {
          setIconVisual(false);
          setShowModal(true);
          setTextsucces(errorMessage.cardsError);
        }
      })
  }
  //закрытие модального окна
  function handlerClose() {
    setShowCardModal(false);
    setShowSelectModal(false);
    setShowImagePopup(false);
    setSelectedCardUpdate(false)
    setShowEditCard(false)
  }

  function handlerCloseError() {
    setShowModal(false);
  }
  
  function handlerOpenAddModal(object) {
    setObject(object)
    setShowSelectModal(false);
    setShowCardModal(true);
   
    
  }

  function handlerOpenModal() {
    setShowSelectModal(true);
  }

  //Создание новой карточки
  function hanldNewcard(values) {
    api.createNewCard(values)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        history.push("/profile/myflats");
        setShowCardModal(false);
      })
      .catch((err) => {
        if (err === authErrors.badRequestErr) {
          setIconVisual(false);
          setShowModal(true);
          setTextsucces(errorMessage.ValidationErr);
        } else {
          setIconVisual(false);
          setShowModal(true);
          setTextsucces(errorMessage.internalServerErr);
        }
      })
  }

  //функция удаления карточки
  function handleDeleteCard(card) {
    api.deleteCard(card._id)
      .then((card) => {
        setCards((cards)=> cards.filter((c) => c._id !== card._id));
      })
      .catch((err) => {
        if (err === authErrors.forbiddenErr) {
          setIconVisual(false);
          setShowModal(true);
          setTextsucces(errorMessage.forbiddenErr);
        } else {
          setIconVisual(false);
          setShowModal(true);
          setTextsucces(errorMessage.cardsDeleteError);
        }
      })
  }

  //Открытие модального окна редактирования
  function handleEditCard(card) {
    setObject(card.name)
    setShowEditCard(true)
    setSelectedCardUpdate(card)
  }

  //функция редактирования карточки
  function handleEditCard2(card) {
    api.editCard(card)
    .then((updateCard) => {
      setCards(() => cards.map((c) => c._id === updateCard._id ? updateCard : c));
      setShowEditCard(false);
    })
    .catch((err) => {
      if (err === authErrors.badRequestErr) {
        setIconVisual(false);
        setShowModal(true);
        setTextsucces(errorMessage.ValidationErr);
      } else {
        setIconVisual(false);
        setShowModal(true);
        setTextsucces(errorMessage.internalServerErr);
      }
    })
  }

  //функция скрытия карточки
  function handleHideCard(data) {
    api.hideCard(data.card._id, data.active)
    .then((UpdateCard) => {
      setCards((state) => state.map((c) => (c._id === data.card._id ? UpdateCard : c)));
    })
    .catch((err) => console.log(`Ошибка при снятии с публикации: ${err}`));
  }

  function handleChangeObject(event) {
    setObject(event.target.value);
  }

  function handleImageOpenPopup(image) {
    setShowImagePopup(image);
  }

  //Изменение права доступа юзера
  function handlerUserActive(data) {
    api.editContent(data.access, data.user._id)
      .then((UpdateUser) => {
        setUsers((state) => state.map((c) => (c._id === data.user._id ? UpdateUser : c)));
      })
      .catch((err) => {
        if (err === authErrors.notFoundErr) {
          setIconVisual(false);
          setShowModal(true);
          setTextsucces(errorMessage.userNotFound);
        } else {
          setIconVisual(false);
          setShowModal(true);
          setTextsucces(errorMessage.internalServerErr);
        }
      })
  }

   //удаление юзера
   function handlerDeleteUser(user) {
    api.deleteUser(user._id)
      .then(() => {
        setUsers((state)=> state.filter((c) => c._id !== user._id));
      })
      .catch((err) => {
        if (err === authErrors.notFoundErr) {
          setIconVisual(false);
          setShowModal(true);
          setTextsucces(errorMessage.userNotFound);
        } else {
          setIconVisual(false);
          setShowModal(true);
          setTextsucces(errorMessage.internalServerErr);
        }
      })
  }

   //Изменение права доступа админа
   function handlerUserAdmin(data) {
    api.editAdmin(data.admin, data.user._id)
      .then((UpdateUser) => {
        setUsers((state) => state.map((c) => (c._id === data.user._id ? UpdateUser : c)));
      })
      .catch((err) => {
        if (err === authErrors.notFoundErr) {
          setIconVisual(false);
          setShowModal(true);
          setTextsucces(errorMessage.userNotFound);
        } else {
          setIconVisual(false);
          setShowModal(true);
          setTextsucces(errorMessage.internalServerErr);
        }
      })
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header />
        <Menu></Menu>
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
          {skeleton && <Skeleton isOpen={skeleton} />}
           
          {!skeleton  && 
            <ObjectList cards={cards} type='Квартира' />
          }
          </Route>
          <Route path="/new-flats">
          {skeleton && <Skeleton isOpen={skeleton} />}
           
          {!skeleton  && 
            <ObjectList cards={cards} type='Новостройка'  />
          }
          </Route>
          <Route path="/rooms">
          {skeleton && <Skeleton isOpen={skeleton} />}
           
          {!skeleton  && 
            <ObjectList cards={cards} type='Комната'  />
          }
          </Route>
          <Route path="/houses">
          {skeleton && <Skeleton isOpen={skeleton} />}
           
          {!skeleton  && 
            <ObjectList cards={cards} type='Дом'  />
          }
          </Route>
          <ProtectedRoute
            path="/profile"
            component={Profile}
            loggedIn={loggedIn}
            cards={cards}
            commercial={commercial}
            users={users}
            logOut={onSignOut}
            onCardEdit={handleEditCard} 
            onCardHide={handleHideCard}
            onCardDelete={handleDeleteCard}
            onClick={handlerOpenModal}
            onUpdateUser={handlerUserActive}
            onDeleteUser={handlerDeleteUser}
            onAdminUser={handlerUserAdmin}
            skeleton={skeleton}
          />
          <Route path="/:id">
            <Card onCardEdit={handleEditCard} onCardClick={handleImageOpenPopup} cards={cards} commercial={commercial}/>
          </Route>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
        <Footer />
        <EditFlats
          isOpen={showEditCard}
          onEditCard={handleEditCard2}
          onClose={handlerClose}
          card={selectedCardUpdate && selectedCardUpdate}
          object={object}
          name="edit"
        />
        <SelectObject
          isOpen={showSelectModal}
          onClose={handlerClose}
          onNext={handlerOpenAddModal}
          object={object}
          onChange={handleChangeObject}
          name="object"
        />
        <AddNewBuilding
          isOpen={showCardModal}
          onClose={handlerClose}
          onCardData={hanldNewcard}
          object={object}
        />
        <ModalInfo isOpen={showModal} textError={textsucces} onClose={handlerCloseError} icon={iconVisual} name="modal-info" />
        <ImagePopup onClose={handlerClose} name="image" card={showImagePopup !== null && showImagePopup} />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
