import React, { useState, useEffect } from 'react'
import './MonEspacePerso.css'
import { Form, FormGroup, Button, Input } from 'reactstrap'
import axios from 'axios';
const bcrypt = require('bcryptjs')


/* -------- Page d'édition pour l'espace perso Neoworker ------------------ */
const EditHomePageFreelancer = (props) => {

  const [changerMDP, setChangerMDP] = useState(true)

  //recup des query de l'id
  const paramsIdUser = props.match.params.id;
  const paramsNeo = props.match.params.idneo;

  const [getUser, setGetUser] = useState([])


  //hooks pour modif le updateFreelancer
  const [updateFreelancer, setUpdateFreelancer] = useState({
    img: "",
    title: "",
    firstname: '',
    lastname: "",
    address: "",
    mobilite: 0,
    km_max: 0,
    pref_lieu_de_travail: 0,
    disponibilite: 0,
    tjm_min: 0,
    tjm_max: 0,
    email: "",
    tel: "",
    cp: '',
  })

  //hooks pour modif le user
  const [updateUser, setUpdateUser] = useState({
    email: '',
    password: ''
  })

  const [loading, setLoading] = useState(false)




  const uploadImage = async e => {
    const files = e.target.files
    const data = new FormData()
    data.append('file', files[0])
    data.append('upload_preset', 'neoworker')
    setLoading(true)
    const res = await fetch(
      'https://api.cloudinary.com/v1_1/duadv7hhn/image/upload',
      {
        method: 'POST',
        body: data
      }
    )
    const file = await res.json()

    setUpdateFreelancer({ img: file.secure_url })
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])
  const fetchData = () => {
    axios.get(`http://localhost:5000/freelancer/${paramsNeo}`)
      .then(res => setUpdateFreelancer(res.data))
      .catch(err => console.log(err))
  }

  useEffect(() => {
    fetchDataUser()
  }, [])
  const fetchDataUser = () => {
   axios.get(`http://localhost:5000/user/${paramsIdUser}`)
      .then(res => setUpdateUser(res.data) & setGetUser(res.data))
      .catch(err => console.log(err))
  }
  //update sur la data user
  const updateQueryDataUserFree = (e) => {
    e.preventDefault()

    if (updateUser.password.length == 60) {
        axios.put(`http://localhost:5000/user/${paramsIdUser}`, updateUser)
        .catch(err => console.log(err))
    } else {
        bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(updateUser.password, salt, function (err, hash) {
          // Store hash in your password DB.
            axios.put(`http://localhost:5000/user/${paramsIdUser}`, { ...updateUser, password: hash })
            .catch(err => console.log(err))
        });
      })
    }
    props.history.push('/neoworker/homepage')
    window.location.reload();

  }


  //update sur la data du free
  const updateQueryDataFree = async (e) => {
    e.preventDefault()
    await axios.put(`http://localhost:5000/freelancer/${paramsNeo}`, updateFreelancer)
      .catch(err => console.log(err))
    props.history.push('/neoworker/homepage')
  }

  //fonction qui regroupe l'axios put du dataUserFree et l'axios du dataFree
  const updaterEmailPassword = (e) => {
    updateQueryDataFree(e)
    updateQueryDataUserFree(e)
  }

  //fonction qui modif l'email user et l'email free en même temps
  const emailUpdater = (e) => {
    setUpdateFreelancer({ ...updateFreelancer, email: e.target.value })
    setUpdateUser({ ...updateUser, email: e.target.value })
  }


  //fonction qui modif le password user et le password free en même temps
  const passwordUpdater = (e) => {
    setUpdateUser({ ...updateUser, password: e.target.value })
  }


  return (
    <div className="main-div">
      <div className='profil-card'>
        <p className='name-card'>{updateFreelancer.firstname} {updateFreelancer.lastname}</p>
        <img className='pic-card' src={updateFreelancer.img === '' ? 'https://media.istockphoto.com/photos/businessman-silhouette-as-avatar-or-default-profile-picture-picture-id476085198?k=6&m=476085198&s=612x612&w=0&h=5cDQxXHFzgyz8qYeBQu2gCZq1_TN0z40e_8ayzne0X0=' : updateFreelancer.img} alt='profil pic' />
      </div>
      <form className="formulaire-creation-neoworker" onSubmit={updaterEmailPassword} >
        <p className="main-title">Edite tes informations personnels</p>

        <div className="first-div-creation-neoworker">
          <div className="field-group-text">Métier</div>
          <input className="input-metier"
            type="text" id="title" name="Métier"
            value={updateFreelancer.title}
            required
            onChange={(e) => { setUpdateFreelancer({ ...updateFreelancer, title: e.target.value }) }} />

          <div className="align-photoprofilwithinput-div">
            <div className="profil-img-and-choice">
              
                <img className='profil-img-creation' src={updateFreelancer.img == '' ? 'https://media.istockphoto.com/photos/businessman-silhouette-as-avatar-or-default-profile-picture-picture-id476085198?k=6&m=476085198&s=612x612&w=0&h=5cDQxXHFzgyz8qYeBQu2gCZq1_TN0z40e_8ayzne0X0=' : updateFreelancer.img} alt='profil pic' />
                
              <div>
                <form onSubmit={updateQueryDataFree}>
                <input
                  type="file"
                  name="file"
                  placeholder="Upload an image"
                  onChange={uploadImage}
                />
              </form>
              </div>
            </div>


            <div className="align-field-text-div">
              <div className="field-group-text">Prénom</div>
              <input
                className="input-firstname"
                type="text"
                id="firstname"
                name="firstname"
                value={updateFreelancer.firstname}
                required
                onChange={(e) => { setUpdateFreelancer({ ...updateFreelancer, firstname: e.target.value }) }} />
              <div className="field-group-text">Nom</div>
             
              <input
                className="input-lastname"
                type="text" id="lastname" name="lastname"
                value={updateFreelancer.lastname}
                required
                onChange={(e) => { setUpdateFreelancer({ ...updateFreelancer, lastname: e.target.value }) }} />
              <div className="field-group-text">Adresse</div>
              
              <input
                className="input-address"
                type="text" id="address" name="address"
                value={updateFreelancer.address}
                required
                onChange={(e) => { setUpdateFreelancer({ ...updateFreelancer, address: e.target.value }) }} />
              
              <div className="field-group-text">Code Postal</div>
              
              <input
                className="input-cp"
                type="text" id="cp" name="cp"
                value={updateFreelancer.cp}
                required
                onChange={(e) => { setUpdateFreelancer({ ...updateFreelancer, cp: e.target.value }) }} />

              <div className="field-group-text">Email</div>
              
              <input
                className="input-email"
                type="text" id="email" name="email"
                value={updateUser.email}
                value={updateFreelancer.email}
                required
                onChange={(e) => { emailUpdater(e) }} />
              
              <div className="field-group-text">N° de téléphone</div>
              
              <input
                className="input-tel"
                type="text" id="tel" name="tel"
                value={updateFreelancer.tel}
                required
                onChange={(e) => { setUpdateFreelancer({ ...updateFreelancer, tel: e.target.value }) }} />
              {/* <button onClick={()=>setChangerMDP(!changerMDP)}>Changer le mot de passe</button> */}
              <div className="field-group-text">Password</div>
              <input
                // className={changerMDP ===true ?'input-password unshow':''}
                className='input-password'
                placeholder="Mot de passe"
                type="password"
                id="password" name="password"
                value={updateUser.password.length == 60 ? 'password' : updateUser.password}
                onChange={(e) => { passwordUpdater(e) }}
              />
            </div>
          </div>
        </div>
        <div className="second-div-creation-neoworker">

          <div className="div-tj_min">
            <div className="field-group-text">Taux journalier minimum</div>
            <input className="input-tj_min"
              type="number" id="tj_min" name="tj_min"
              value={updateFreelancer.tjm_min}
              required
              onChange={(e) => { setUpdateFreelancer({ ...updateFreelancer, tjm_min: e.target.value }) }} />
          </div>

          <div className="div-tj_max">
            <div className="field-group-text">Taux journalier maximum</div>
            <input className="input-tj_max" type="number"
              id="tj_max" name="tj_max"
              value={updateFreelancer.tjm_max}
              required
              onChange={(e) => { setUpdateFreelancer({ ...updateFreelancer, tjm_max: e.target.value }) }} />
          </div>
        </div>

        <div className="third-div-creation-neoworker">
          <div className="div-dispo">
            <div className="field-group-text">Disponibilité (nombre jours/mois)</div>
            <input className="input-dispo" type="number"
              id="disponibilite" name="disponibilite"
              value={updateFreelancer.disponibilite}
              required onChange={(e) => { setUpdateFreelancer({ ...updateFreelancer, disponibilite: e.target.value }) }} />
          </div>
          <div className="div-pref_lieu_travail">
            <div className="field-group-text">Préférence lieu de travail</div>
            <FormGroup>
              <Input className="input-pref_lieu_de_travail"type="select"
                id="pref_lieu_de_travail"
                name="pref_lieu_de_travail"
                value={updateFreelancer.pref_lieu_de_travail}
                onChange={(e) => {
                  setUpdateFreelancer({
                    ...updateFreelancer,
                    pref_lieu_de_travail: e.target.value === 'Présence en entreprise' ? 'Présence en entreprise' : e.target.value === 'Travail à distance' ? 'Travail à distance' : 'Peu importe'
                  })
                }}>
                <option>Présence en entreprise</option>
                <option>Travail à distance</option>
                <option>Peu importe</option>
              </Input>
            </FormGroup>
          </div>
        </div>

        <div className="fourth-div-creation-neoworker">
          <div className="div-mobilite">
            <div className="field-group-text">Mobilité</div>
            <FormGroup >
              <Input className="input-mobilite" type="select" name="mobilite" id='mobilite'
                value={updateFreelancer.mobilite}
                onChange={(e) => { setUpdateFreelancer({ ...updateFreelancer, mobilite: e.target.value === 'Non' ? 'Non' : 'Oui' }) }}>
                <option>Oui</option>
                <option>Non</option>
              </Input>
            </FormGroup>
          </div>



          <div className="div-km_max">
            <div className="field-group-text">Kilomètres max</div>
            <FormGroup >
              <Input className="input-Km_max" type="select" name="km_max" id='km_max'
                value={updateFreelancer.km_max}
                onChange={(e) => { setUpdateFreelancer({ ...updateFreelancer, km_max: e.target.value === '10 km' ? '10 km' : e.target.value === '20 km' ? '20 km' : e.target.value === '30 km' ? '30 km' : e.target.value === '40 km' ? '40 km' : e.target.value === '50 km' ? '50 km' : '10 km' }) }}>
                <option>10 km</option>
                <option>20 km</option>
                <option>30 km</option>
                <option>40 km</option>
                <option>50 km</option>
              </Input>
            </FormGroup>
          </div>
        </div>
        <button className='btn' onClick={updaterEmailPassword} type='submit'>Valider les modifications</button>
      </form>


    </div>
  )
}

export default EditHomePageFreelancer;  











// import React, { useContext, useState, useEffect } from 'react'
// import './HomePageFreelancer.css'
// import { Button, Label, Input, InputGroup, InputGroupText, FormGroup, } from 'reactstrap'
// import { Link } from 'react-router-dom'
// import '../freelancer/EditHomePageFreelancer.css'
// import axios from 'axios';
// const bcrypt = require('bcryptjs')


// /* -------- Page d'édition pour l'espace perso Neoworker ------------------ */
// const EditHomePageFreelancer = (props) => {

//   const [changerMDP, setChangerMDP] = useState(true)

//   //recup des query de l'id
//   const paramsIdUser = props.match.params.id;
//   const paramsNeo = props.match.params.idneo;

//   const [getUser, setGetUser] = useState([])


//   //hooks pour modif le updateFreelancer
//   const [updateFreelancer, setUpdateFreelancer] = useState({
//     img: "",
//     title: "",
//     firstname: '',
//     lastname: "",
//     address: "",
//     mobilite: 0,
//     km_max: 0,
//     pref_lieu_de_travail: 0,
//     disponibilite: 0,
//     tjm_min: 0,
//     tjm_max: 0,
//     email: "",
//     tel: "",
//     cp: '',
//   })

//   //hooks pour modif le user
//   const [updateUser, setUpdateUser] = useState({
//     email: '',
//     password: ''
//   })

//   const [loading, setLoading] = useState(false)




//   const uploadImage = async e => {
//     const files = e.target.files
//     const data = new FormData()
//     data.append('file', files[0])
//     data.append('upload_preset', 'neoworker')
//     setLoading(true)
//     const res = await fetch(
//       'https://api.cloudinary.com/v1_1/duadv7hhn/image/upload',
//       {
//         method: 'POST',
//         body: data
//       }
//     )
//     const file = await res.json()

//     setUpdateFreelancer({ img: file.secure_url })
//     setLoading(false)
//   }
// //
//   useEffect(() => {
//     fetchData()
//   }, [])
//   const fetchData = () => {
//     axios.get(`http://localhost:5000/freelancer/${paramsNeo}`)
//       .then(res => setUpdateFreelancer(res.data))
//       .catch(err => console.log(err))
//   }

//   useEffect(() => {
//     fetchDataUser()
//   }, [])
//   const fetchDataUser = () => {
//     axios.get(`http://localhost:5000/user/${paramsIdUser}`)
//       .then(res => setUpdateUser(res.data) & setGetUser(res.data))
//       .catch(err => console.log(err))
//   }

//   //update sur la data user
//   const updateQueryDataUserFree = (e) => {
//     e.preventDefault()

//     if (updateUser.password.length == 60) {
//       axios.put(`http://localhost:5000/user/${paramsIdUser}`, updateUser)
//         .catch(err => console.log(err))
//     } else {
//       bcrypt.genSalt(10, function (err, salt) {
//         bcrypt.hash(updateUser.password, salt, function (err, hash) {
//           // Store hash in your password DB.
//           axios.put(`http://localhost:5000/user/${paramsIdUser}`, { ...updateUser, password: hash })
//             .catch(err => console.log(err))
//         });
//       })
//     }
//     props.history.push('/neoworker/homepage')
//   }


//   //update sur la data du free
//   const updateQueryDataFree = async (e) => {
//     e.preventDefault()
//     await axios.put(`http://localhost:5000/freelancer/${paramsNeo}`, updateFreelancer)
//       .catch(err => console.log(err))
//     props.history.push('/neoworker/homepage')
//   }

//   //fonction qui regroupe l'axios put du dataUserFree et l'axios du dataFree
//   const updaterEmailPassword = (e) => {
//     updateQueryDataFree(e)
//     updateQueryDataUserFree(e)
//   }

//   //fonction qui modif l'email user et l'email free en même temps
//   const emailUpdater = (e) => {
//     setUpdateFreelancer({ ...updateFreelancer, email: e.target.value })
//     setUpdateUser({ ...updateUser, email: e.target.value })
//   }


//   //fonction qui modif le password user et le password free en même temps
//   const passwordUpdater = (e) => {
//     setUpdateUser({ ...updateUser, password: e.target.value })
//   }


//   return (
//     <div className="main-div">
//       <div className='profil-card'>
//         <p className='name-card'>{updateFreelancer.firstname} {updateFreelancer.lastname}</p>
//         <img className='pic-card' src={updateFreelancer.img == '' ? 'https://media.istockphoto.com/photos/businessman-silhouette-as-avatar-or-default-profile-picture-picture-id476085198?k=6&m=476085198&s=612x612&w=0&h=5cDQxXHFzgyz8qYeBQu2gCZq1_TN0z40e_8ayzne0X0=' : updateFreelancer.img} alt='profil picture' />


//       </div>
//       <form className="formulaire-creation-neoworker" onSubmit={updaterEmailPassword} >
//         <input className="input-metier"
//           type="text" id="title" name="Métier"
//           placeholder="Métier"
//           value={updateFreelancer.title}
//           required
//           onChange={(e) => { setUpdateFreelancer({ ...updateFreelancer, title: e.target.value }) }} />
//         <div className="first-div-creation-neoworker">
//           <div className="align-photoprofilwithinput-div">
//             <img className='profil-img-creation' src={updateFreelancer.img == '' ? 'https://media.istockphoto.com/photos/businessman-silhouette-as-avatar-or-default-profile-picture-picture-id476085198?k=6&m=476085198&s=612x612&w=0&h=5cDQxXHFzgyz8qYeBQu2gCZq1_TN0z40e_8ayzne0X0=' : updateFreelancer.img} alt='profil picture' />


//             <div className="align-field-text-div">
//               <form onSubmit={updateQueryDataFree}>
//                 <input
//                   type="file"
//                   name="file"
//                   placeholder="Upload an image"
//                   onChange={uploadImage}
//                 />
//                 <button type='submit'>Ajouter image</button>
//               </form>

//               <input
//                 className="input-firstname"
//                 placeholder="Prénom" type="text"
//                 id="firstname"
//                 name="firstname"
//                 value={updateFreelancer.firstname}
//                 required
//                 onChange={(e) => { setUpdateFreelancer({ ...updateFreelancer, firstname: e.target.value }) }} />

//               <input
//                 className="input-lastname"
//                 placeholder="Nom"
//                 type="text" id="lastname" name="lastname"
//                 value={updateFreelancer.lastname}
//                 required
//                 onChange={(e) => { setUpdateFreelancer({ ...updateFreelancer, lastname: e.target.value }) }} />

//               <input
//                 className="input-address"
//                 placeholder="address"
//                 type="text" id="address" name="address"
//                 value={updateFreelancer.address}
//                 required
//                 onChange={(e) => { setUpdateFreelancer({ ...updateFreelancer, address: e.target.value }) }} />

//               <input
//                 className="input-cp"
//                 placeholder="cp"
//                 type="text" id="cp" name="cp"
//                 value={updateFreelancer.cp}
//                 required
//                 onChange={(e) => { setUpdateFreelancer({ ...updateFreelancer, cp: e.target.value }) }} />



//               <input
//                 className="input-email" placeholder="Email"
//                 type="text" id="email" name="email"
//                 value={updateUser.email}
//                 value={updateFreelancer.email}
//                 required
//                 onChange={(e) => { emailUpdater(e) }} />

//               <input
//                 className="input-tel" placeholder="Telephone"
//                 type="text" id="tel" name="tel"
//                 value={updateFreelancer.tel}
//                 required
//                 onChange={(e) => { setUpdateFreelancer({ ...updateFreelancer, tel: e.target.value }) }} />
//               {/* <button onClick={()=>setChangerMDP(!changerMDP)}>Changer le mot de passe</button> */}
//               <input
//                 // className={changerMDP ==true ?'input-password unshow':''}
//                 className='input-password'
//                 placeholder="Mot de passe" type="password"
//                 id="password" name="password"
//                 value={updateUser.password.length == 60 ? 'password' : updateUser.password}
//                 onChange={(e) => { passwordUpdater(e) }}
//               />
//             </div>
//           </div>
//         </div>
//         <div className="second-div-creation-neoworker">

//           <div className="div-tj_min" >
//             <InputGroupText className="input-group-text">Taux journalier minimum</InputGroupText>
//             <input className="input-tj_min"
//               type="number" id="tj_min" name="tj_min"
//               value={updateFreelancer.tjm_min}
//               required
//               onChange={(e) => { setUpdateFreelancer({ ...updateFreelancer, tjm_min: e.target.value }) }} />
//           </div>

//           <div className="div-tj_max">
//             <InputGroupText>Taux journalier maximum</InputGroupText>
//             <input className="input-tj_max" type="number"
//               id="tj_max" name="tj_max"
//               value={updateFreelancer.tjm_max}
//               required
//               onChange={(e) => { setUpdateFreelancer({ ...updateFreelancer, tjm_max: e.target.value }) }} />
//           </div>
//         </div>

//         <div className="third-div-creation-neoworker">
//           <div className="div-dispo">
//             <InputGroupText>Disponibilité (nombres jours/mois)</InputGroupText>
//             <input className="input-dispo" type="number"
//               id="disponibilite" name="disponibilite"
//               value={updateFreelancer.disponibilite}
//               required onChange={(e) => { setUpdateFreelancer({ ...updateFreelancer, disponibilite: e.target.value }) }} />
//           </div>
//           <div className="div-pref_lieu_travail">
//             <InputGroupText>Préférence du lieu de travail</InputGroupText>
//             <FormGroup className="input-pref_lieu_travail">
//               <Input type="select"
//                 id="pref_lieu_de_travail"
//                 name="pref_lieu_de_travail"
//                 value={updateFreelancer.pref_lieu_de_travail}
//                 onChange={(e) => {
//                   setUpdateFreelancer({
//                     ...updateFreelancer,
//                     pref_lieu_de_travail: e.target.value == 'Présence en entreprise' ? 'Présence en entreprise' : e.target.value == 'Travail à distance' ? 'Travail à distance' : 'Peu importe'
//                   })
//                 }}>
//                 <option disabled selected>Préférence lieu de travail</option>
//                 <option>Présence en entreprise</option>
//                 <option>Travail à distance</option>
//                 <option>Peu importe</option>
//               </Input>
//             </FormGroup>
//           </div>
//         </div>

//         <div className="fourth-div-creation-neoworker">
//           <div className="div-mobilite">
//             <InputGroupText>Mobilité</InputGroupText>
//             <FormGroup className="input-mobilite">
//               <Input type="select" name="mobilite" id='mobilite'
//                 value={updateFreelancer.mobilite}
//                 onChange={(e) => { setUpdateFreelancer({ ...updateFreelancer, mobilite: e.target.value === 'Non' ? 'Non' : 'Oui' }) }}>
//                 <option disabled selected>Mobilite</option>
//                 <option>Oui</option>
//                 <option>Non</option>
//               </Input>
//             </FormGroup>
//           </div>



//           <div className="div-km_max">
//             <InputGroupText>Km maximum</InputGroupText>
//             <FormGroup className="input-Km_max">
//               <Input type="select" name="km_max" id='km_max'
//                 value={updateFreelancer.km_max}
//                 onChange={(e) => { setUpdateFreelancer({ ...updateFreelancer, km_max: e.target.value === '10 km' ? '10 km' : e.target.value === '20 km' ? '20 km' : e.target.value === '30 km' ? '30 km' : e.target.value === '40 km' ? '40 km' : e.target.value === '50 km' ? '50 km' : '10 km' }) }}>
//                 <option disabled selected>--Choisir une option--</option>
//                 <option>10 km</option>
//                 <option>20 km</option>
//                 <option>30 km</option>
//                 <option>40 km</option>
//                 <option>50 km</option>
//               </Input>
//             </FormGroup>
//           </div>
//         </div>


//         <div><hr className="separator-line"></hr> </div>
//         <button onClick={updaterEmailPassword} type='submit'>update</button>
//       </form>


//     </div>
//   )
// }

// export default EditHomePageFreelancer;



