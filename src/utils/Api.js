class Api {
    constructor ({address, headers}) {
      this._address = address;
      this._headers = headers;
    }
  
    _getResponseData(res) {
      if(res.ok) {
        return res.json()
       }else {
         return Promise.reject(res.status)
       } 
    }

    getCards () {
        return fetch(`${this._address}/cards`, {
          method: 'GET',
          headers: this._headers,
          credentials: 'include',
        })
        .then(this._getResponseData)
      }

      deleteCard(id) {
        return fetch(`${this._address}/profile/cards/${id}`, {
          method: 'DELETE',
          headers: this._headers,
          credentials: 'include'
        })
    }
    createNewCard(data) {
        return fetch(`${this._address}/profile/cards`, {
          method: 'POST',
          headers: this._headers,
          credentials: 'include',
          body: JSON.stringify({
            name: data[2],
            image: data[1],
            description: data[0].info,
            price: data[0].price,
            adress: data[0].adress,
            transaction: data[0].transaction,
            floor: data[0].floor,
            rooms: data[0].rooms,
            cadastre: data[0].floor,
            balcony: data[0].balcony,
            elevator: data[0].elevator,
            repair: data[0].repair,
            metro: data[0].metro,
            totalarea: data[0].totalArea,
            kitchenarea: data[0].kitchenArea,
          })
        })
        .then(this._getResponseData)
      }

      
    }


    const api = new Api({
      address: 'http://localhost:3002',
      headers: {
        'Content-Type': 'application/json'
    }
    });
    
    export default api  