/*
	StorePicker Component
	<StorePicker/>
*/

import React from 'react';
import { History } from 'react-router';
import h from '../helpers';
import reactMixin from 'react-mixin';
import autobind from 'autobind-decorator'

class StorePicker extends React.Component {

	@autobind
	goToStore(e) {
		e.preventDefault();
		var storeId = this.refs.storeId.value;
		this.history.pushState(null, '/store/' + storeId);
	}

	render() {
		return (
			<form className="store-selector" onSubmit={this.goToStore}>
				<h2>Please enter a store</h2>
				<input type="text" ref="storeId" defaultValue={h.getFunName()} required />
				<input type="Submit" />
			</form>
		)
	}
}

reactMixin.onClass(StorePicker, History);

export default StorePicker;
