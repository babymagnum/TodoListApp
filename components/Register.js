import React, { Component } from 'react';
import {Text, ActivityIndicator, Dimensions, ToastAndroid, StatusBar, KeyboardAvoidingView, View, StyleSheet, TextInput, TouchableOpacity} from 'react-native'
import Modal from 'react-native-modal';
import firebase from 'react-native-firebase';
import {NavigationActions, StackActions} from 'react-navigation'

const DIMENSIONS = Dimensions.get('window')

export default class Register extends Component {
    constructor(props){
        super(props)
        this.state = {
            email: '',
            password: '',
            isModalVisible: false,
            buttonString: 'Register'
        }
    }

    async componentDidMount(){
        var user = firebase.auth().currentUser;
        if(user != null){
            this.props.navigation.dispatch(StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'TodoList' })],
            }))
        }
    }

    register = (email, password) => {
        if(email == ''){
            ToastAndroid.show('email cant empty', ToastAndroid.SHORT)
            return
        } else if(password == ''){
            ToastAndroid.show('password cant empty', ToastAndroid.SHORT)
            return
        }

        this.setState({isModalVisible: true})
        
        if(this.state.buttonString == 'Register'){
            this.signup(email, password)
        } else{
            this.login(email, password)
        }
    }

    navigateToTodoList() {
        this.props.navigation.push('TodoList')
    }

    changeToLogin(){
        this.setState({buttonString: 'Login'})
    }

    changeToRegister(){
        this.setState({buttonString: 'Register'})
    }

    login(email, password){
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorMessage = error.message;
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT)
        this.setState({isModalVisible: false})
        }).then(() => {
            this.setState({isModalVisible: false})

            ToastAndroid.show('Berhasil Login', ToastAndroid.SHORT)
            
            this.props.navigation.dispatch(StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'TodoList' })],
            }))
        });
    }

    signup(email, pass) {
       firebase.auth().createUserWithEmailAndPassword(email, pass).catch(function(error) {
        // Handle Errors here.
        var errorMessage = error.message;
        ToastAndroid.show(errorMessage, ToastAndroid.SHORT)
        this.setState({isModalVisible: false})
        }).then(() => {
            this.setState({isModalVisible: false})

            ToastAndroid.show('Berhasil Register', ToastAndroid.SHORT)
            
            this.props.navigation.dispatch(StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'TodoList' })],
            }))
        });
    }

    render() { 
        return (  
            <View style={styles.container}>
                <StatusBar
                    backgroundColor= 'white'
                    barStyle='dark-content'
                />
                <View style={styles.toolbar}>
                    <TouchableOpacity 
                        onPress={() => this.changeToRegister()}
                        style={{alignSelf: "center"}}>
                        <Text style={{
                            padding: 10, 
                            color: this.state.buttonString == 'Register' ? '#1e7ebf' : 'black'
                        }}>REGISTER</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => this.changeToLogin()}
                        style={{alignSelf: "center"}}>
                        <Text style={{
                            padding: 10, 
                            color: this.state.buttonString == 'Login' ? '#1e7ebf' : 'black'
                        }}>LOGIN</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.contentMain}>
                    <KeyboardAvoidingView>
                        <View style={styles.form}>
                            <TextInput
                                placeholder = 'masukan email anda di sini...'
                                placeholderTextColor = 'white'
                                style={styles.input}
                                returnKeyType = 'next'
                                ref={'inputEmail'}
                                keyboardType= 'email-address'
                                autoCapitalize = 'none'
                                autoCorrect = {false}
                                autoFocus = {false}
                                onChangeText = {(text) => this.setState({email: text})}
                                onSubmitEditing={() => this.refs.inputPassword.focus()}
                            />
                            <TextInput 
                                placeholder = 'masukan password anda di sini...'
                                placeholderTextColor = 'white'
                                style={styles.input}
                                secureTextEntry = {true}
                                returnKeyType = 'done'
                                onChangeText = {(text) => this.setState({password: text})}
                                ref = {'inputPassword'}
                            />

                            <TouchableOpacity 
                                onPress={() => this.register(this.state.email, this.state.password)}
                                style={{backgroundColor: '#1e7ebf', borderRadius: 5, marginTop: 10}}>
                                <Text style={{color: 'white', textAlign: "center", padding: 15}}>{this.state.buttonString}</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </View>
                <Modal
                    onBackdropPress={() => this.setState({isModalVisible: false})}
                    onBackButtonPress={() => this.setState({isModalVisible: false})}
                    style={styles.contentMain}
                    isVisible={this.state.isModalVisible}
                    backdropColor='#FAFAFA'
                    backdropOpacity={0.70}>
                    <View style={{height: 80, width: 80, alignSelf: "center"}}>
                        <ActivityIndicator style={{margin: 10}}/>
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    input: {
        marginVertical: 5,
        padding: 10,
        backgroundColor: '#e5e5e5',
        borderRadius: 5
    },
    container:{
        flexDirection: 'column',
        flex: 1,
        backgroundColor: '#FAFAFA'
    },
    toolbar: {
        justifyContent: 'space-between',
        paddingHorizontal: 5,
        flexDirection: 'row',
        backgroundColor: 'white',
        height: 56
    },
    contentMain: {
        flexDirection: 'column',
        justifyContent: 'center',
        flex: 1
    },
    form: {
        borderRadius: 7, 
        padding: 15, 
        backgroundColor: 'white', 
        alignSelf: "center", 
        width: DIMENSIONS.width - 75
    }
})