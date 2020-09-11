import React from 'react';
import { Switch, Route } from 'react-router';

export default (
	// Switch is added in v4 react-router
	<Switch>
    <Route exact path="/" />
    <Route exact path="/shop/:category" />
    <Route exact path="/shop/:category/:product" />
    <Route exact path="/checkout" />
    <Route path="/account" />
    <Route exact path="/account/details" />
    <Route exact path="/account/orders" />
    <Route exact path="/account/reviews" />
    <Route path="/order/:id" />
    <Route path="/faq" />
    <Route path="/cart" />
    <Route path="/contact" />
    <Route />
	</Switch>
);