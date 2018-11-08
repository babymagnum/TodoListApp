/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {createStackNavigator} from 'react-navigation'
import TodoList from './TodoList';
import Register from './Register';
import AddTodoList from './AddTodoList';

export default class Home extends Component{
  render() {
    return (
      <STACK_NAVIGATOR/>
    );
  }
}

const STACK_NAVIGATOR = createStackNavigator({
  Register: Register,
  TodoList: TodoList,
  AddTodoList: AddTodoList
},
{
  initialRouteName: 'Register',
  headerMode: 'none'
}
)
