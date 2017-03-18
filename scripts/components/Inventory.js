/*
	Inventory
	<Inventory />
*/

import React from 'react';
import AddFishForm from './AddFishForm';
import autobind from 'autobind-decorator';
import * as firebase from 'firebase';

var config = {
    apiKey: "AIzaSyAVrIKs39BqWebONeo_h3dfh0w_hjLv8MQ",
    authDomain: "react-catch-app.firebaseapp.com",
    databaseURL: "https://react-catch-app.firebaseio.com",
    storageBucket: "react-catch-app.appspot.com",
    messagingSenderId: "291216570628"
 };

var firebaseApp = firebase.initializeApp(config);

@autobind
class Inventory extends React.Component {

	constructor() {
		super();
		this.state = {
			uid: ''
		}
	}

	authenticate(provider) {
		var provider = new firebase.auth.GithubAuthProvider();
		firebase.auth().signInWithPopup(provider).then(this.authHandler);
	}

	componentWillMount() {
		console.log("this is mounting!");
		var token = localStorage.getItem('token');
		if(token) {
	/*		var credential = firebase.auth.GithubAuthProvider.credential(token);
			console.log(credential);*/
			firebase.auth().signInAnonymously().then(this.authHandler)
			.catch(function(error) {
				console.log(error);
			});
		}
	}

	authHandler(authData) {
		console.log(this.props.params.storeId);
		// Get a reference to the database service
		var database = firebase.database();
		const storeRef = database.ref(this.props.params.storeId);

		console.log(storeRef.toString());
		console.log(authData);
		localStorage.setItem('token', authData.user.uid);

		// firebase.auth().currentUser.getToken(/* forceRefresh */ true).then(function(idToken) {
  // 			// Send token to your backend via HTTPS
  // 			// console.log(idToken);
  			
 		// });
		storeRef.on('value', (snap) => {
			var data = snap.val() || {};
			console.log(data);

			// claim it
			if(!data.owner) {
				storeRef.set({
					owner: authData.user.uid
				});
			}

			this.setState({
				uid: authData.user.uid,
				owner: data.owner || authData.user.uid
			});
		});
	}
	
	renderLogin() {
		return (
				  <nav className="login">
				    <h2>Inventory</h2>
				    <p>Sign in to manage your store's inventory</p>
				    <button className="github" onClick={this.authenticate.bind(this, 'github')}>Log In with Github</button>
				  </nav>
			)
	}

	renderInventory(key) {
		var linkState = this.props.linkState;
		return (
				<div className="fish-edit" key={key}>
					<input type="text" valueLink={linkState('fishes.' + key + '.name')} />
					<input type="text" valueLink={linkState('fishes.' + key + '.price')} />
					<select valueLink={linkState('fishes.' + key + '.status')}>
					  <option value="unavailable">Sold Out!</option>
					  <option value="available">Fresh!</option>
					</select>
					<textarea valueLink={linkState('fishes.' + key + '.desc')}></textarea>
					<input type="text" valueLink={linkState('fishes.' + key + '.image')} />
					<button onClick={this.props.removeFish.bind(null, key)}>Remove Fish</button>
				</div>
			)
	}

	render() {

		let logoutButton = <button>Log out!</button>

		// if they aren't logged in
		if(!this.state.uid) {
			return (
					<div>
						{this.renderLogin()}
					</div>
				);
		}

		// if they aren't the owner
		if(this.state.uid !== this.state.owner) {
			return (
					<div>
						<p>Sorry, you are not authorized!</p>
						{logoutButton}
					</div>
				)
		}
		
		return (
			<div>
				<h2> Inventory </h2>
				{logoutButton}
				{Object.keys(this.props.fishes).map(this.renderInventory)}

				<AddFishForm {...this.props} />
				<button onClick={this.props.loadSamples}>Load Sample Fishes</button>
			</div>
		)
	}
};

Inventory.propTypes = {
	addFish: React.PropTypes.func.isRequired,
	loadSamples: React.PropTypes.func.isRequired,
	fishes: React.PropTypes.object.isRequired,
	linkState: React.PropTypes.func.isRequired,
	removeFish: React.PropTypes.func.isRequired
}

export default Inventory;
