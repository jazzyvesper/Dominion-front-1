import React from 'react';
import '../ModalInfo/ModalInfo.css'

function SelectObject (props) {
 const [value, setValue] =React.useState()

  function handleSubmit(event) {
    event.preventDefault();
        props.onNext(value)
  } 

  function handleChange(e) {
    setValue(e.target.value)
  }

  return (
    <div className={`popup  popup__type_${props.name} ${props.isOpen ? ('popup_opened') : ''}`} >
      <div className={`popup__container popup__container_type_${props.name}`}>
      <button onClick={props.onClose} type="button" className="popup__close" aria-label="Закрыть форму"></button>
      <form className="add-form"  onSubmit={handleSubmit} name="objinfo">
        <fieldset className="add-form__fieldset add-form__type_select">
          <h2 className="add-form__title add-form__title_select">Тип недвижимости</h2>
          <select onChange={handleChange} placeholder="Выберите" name="object" className = "add-form__selected">
            <option value="none" name="none">Выберите объект</option>
            <option value="Квартира" name="flat">Квартира</option>
            <option value="Новостройка" name="flat">Новостройка</option>
            <option value="Комната"  name="room">Комната</option>
            <option value="Дом"  name="home">Дом</option>
          </select>
        </fieldset>
        <button className="add-form__button" type="submit" aria-label='далее'>Далее</button>
      
        </form>
      </div>
    </div>
  )
}

export default SelectObject 