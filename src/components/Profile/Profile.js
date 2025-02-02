import React from "react";
import "./Profile.css";
import { Route, Link, NavLink, useHistory } from "react-router-dom";
import Flats from "./Flats.js";
import { CurrentUserContext } from "../../contexts/CurrentUserContext.js";
import CurrentCards from "../../utils/auxiliary";
import ConfirmList from "./Confirm/ConfirmList";
import Skeleton from '../Skeleton/Skeleton';
import SuperVisor from "./SuperVisor";
//Страничка профиля
function Profile(props) {
  const mycards= props.cards.concat(props.commercial)
  const currentUser = React.useContext(CurrentUserContext);
  const userCards = CurrentCards(mycards);
  const history = useHistory();

  return (
    <>
      <main className="profile">
        <div className="profile__nav-list">
          <div className="profile__nav">
            <Link to="/" className="profile__home">
              На главную
            </Link>
            <button className="profile__go-back" onClick={() => history.goBack()}>Назад</button> 
            {currentUser.admin ?
            <Link to="/profile/confirm" className="profile__confirm">
              Подтвердить регистрацию пользователя
            </Link>
            : ''
            }
            <div className="profile__user">{currentUser.name}</div>
            <Link to="/signin" className="profile__exit" onClick={props.logOut}>
              Выход
            </Link>
          </div>
          <div className="profile__nav">
            <NavLink to="/profile/myflats" activeClassName="profile__nav_active" className="profile__button">
              Ваши объекты
            </NavLink>
            <NavLink to="/profile/public" activeClassName="profile__nav_active" className="profile__button profile__button_public">
              Опубликованные
            </NavLink>
            <NavLink to="/profile/nopublic" activeClassName="profile__nav_active" className="profile__button profile__button_no-piblic">
              Снятые с публикации
            </NavLink>
            <button className="profile__object" onClick={props.onClick}>
              Добавить новый объект
            </button>
          </div>
        </div>
        <div className="profile__block">
          {currentUser.admin &&
          <Route path="/profile/confirm">
            <ConfirmList onAdminUser={props.onAdminUser} onUpdateUser={props.onUpdateUser} onDeleteAcces={props.onDeleteAcces} users={props.users} />
          </Route>
          }
          {currentUser.admin &&
           <Route path="/profile/supervisor">
            <SuperVisor onAdminUser={props.onAdminUser} onUpdateUser={props.onUpdateUser}  onDeleteUser={props.onDeleteUser} users={props.users} />
          </Route>
          }
        <Route path='/profile/myflats'>
        {props.skeleton && <Skeleton isOpen={props.skeleton} />}
        {!props.skeleton  && 
           <Flats 
           cards={userCards} 
           onCardDelete={props.onCardDelete} 
           onCardEdit={props.onCardEdit}  
           onCardHide={props.onCardHide}/>
          }
          
        </Route>
        <Route path='/profile/public'>
        {props.skeleton && <Skeleton isOpen={props.skeleton} />}
        {!props.skeleton  && 
          <Flats cards={userCards} onCardDelete={props.onCardDelete} onCardEdit={props.onCardEdit} 
          onCardHide={props.onCardHide} public='public' />
          }
        </Route>
        <Route path='/profile/nopublic'>
        {props.skeleton && <Skeleton isOpen={props.skeleton} />}
        {!props.skeleton  && 
        <Flats cards={userCards} onCardDelete={props.onCardDelete} onCardEdit={props.onCardEdit} 
        onCardHide={props.onCardHide} public='hidePublic' />
        }
        </Route>
       
      </div>
    </main>
    </>
  );
}

export default Profile;
