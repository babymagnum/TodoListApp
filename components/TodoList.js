import React, { Component } from 'react';
import {Text, FlatList, ToastAndroid, Alert, ActivityIndicator, TouchableOpacity, StatusBar, View, StyleSheet} from 'react-native'
import firebase from 'react-native-firebase'
import SwipeOut from 'react-native-swipeout'

export default class TodoList extends Component {
    constructor(props){
        super(props);
        this.todoListRef = firebase.firestore().collection('Todo')
        //this.listener = firebase.firestore().collection('Todo').onSnapshot(function () {});

        this.state = {
            isLoading: true,
            dataSource: []
        }
    }

    onCollectionUpdate = (querySnapshot) => {
        const todo = [];

        querySnapshot.forEach((doc) => {
          const { id, alamat, deskripsi, judul, latlng, status, timeCreated } = doc.data();

          todo.push({
            id,
            alamat,
            deskripsi,
            judul,
            latlng,
            status,
            timeCreated
          });
        });

        this.setState({
          dataSource: todo,
          isLoading: false
       });
    }

    componentDidMount(){
        /*
        this.todoListRef.onSnapshot(function(querySnapshot){
            this.onCollectionUpdate(querySnapshot)
        })
        */
       
        this.todoListRef.onSnapshot(this.onCollectionUpdate)
    }

    logout(){
        firebase.auth().signOut().then(() => {
            
        this.props.navigation.dispatch(StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Register' })],
        }))

            //this.props.navigation.navigate('Register')  
        }).catch((error) => {
            ToastAndroid.show(error.message, ToastAndroid.SHORT)
        })
    }

    navigateToAddTodoList(){
        this.props.navigation.push('AddTodoList', {item: null})
    }

    render() { 
        return (  
            <View style={styles.container}>
                <StatusBar
                    backgroundColor= '#176ca5'
                    barStyle='light-content'
                />
                <View style={styles.toolbar}>
                    <Text style={{
                        alignSelf: "center",
                        fontSize: 20,
                        flex: 1,
                        color: 'white'
                    }}>Todo Apps</Text>
                    <TouchableOpacity 
                        onPress={() => this.navigateToAddTodoList()}
                        style={{borderRadius: 5, alignSelf: "center", backgroundColor: 'white'}}>
                        <Text style={{color: 'black', paddingHorizontal: 10, paddingVertical: 5, fontSize: 15}}>
                        ADD ITEM</Text>
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1, justifyContent: "center", flexDirection: "column"}}>
                    {this.state.isLoading ? <ActivityIndicator style={{alignSelf: "center", height: 50, width: 50}} /> : null}
                    {this.state.isLoading ? null : <FlatListData navigateTo={this.props.navigation} dataSource={this.state.dataSource} />}
                </View>
            </View>
        );
    }
}

class FlatListData extends Component{
    constructor(props){
        super(props)
    }

    updateData = (item) =>{
        var navigateItem =  this.props.navigateTo
        navigateItem.push("AddTodoList", {item, item})
    }

    showToast = (content) =>{
        ToastAndroid.show(content, ToastAndroid.SHORT)
    }

    deleteData = (id) => {
        firebase.firestore().collection('Todo').doc(id).delete()
            .then(function(){
                this.showToast('Sukses menghapus ' + item.judul + ' dari todo list')
            }).catch(function(error){
                this.showToast(error.message)
            })
    }

    render(){
        return(
            <FlatList
                data={this.props.dataSource}
                renderItem={({item}) => 
                    <SwipeOut
                        right= {[
                            {
                                onPress: () => {
                                    Alert.alert(
                                        'Delete Item',
                                        'Anda yakin ingin menghapus todo item ini??',
                                        [
                                            {text:'No', onPress: () => this.showToast('canceled')},
                                            {text:'Yes', onPress: () => {
                                                this.deleteData(item.id)
                                            }, style:'cancel'}
                                        ]
                                    )
                                },
                                text: 'Delete', type: 'delete'
                            },
                            {
                                onPress: () => {
                                    Alert.alert(
                                        'Update Item',
                                        'Are you sure want to update this item??',
                                        [
                                            {text:'No', onPress: () => this.showToast('canceled'), style:'cancel'},
                                            {text:'Yes', onPress: () => this.updateData(item), style:'cancel'}
                                        ]
                                    )
                                },
                                text: 'Update', type: 'primary'
                            },
                        ]}
                        autoClose = {true}
                    >
                        <TouchableOpacity 
                            onPress={() => this.updateData(item)}
                            style={{backgroundColor: 'white'}}>
                            <View style={{flexDirection: 'column'}}>
                                <View style={{flexDirection: 'row', padding: 10}}>
                                    <View style={{flexDirection: 'column', justifyContent: "center"}}>
                                        <View style={{justifyContent: 'center', backgroundColor: '#1e7ebf', height: 50, width: 50, borderRadius: 50/2}}>
                                            <Text style={{color: 'white', fontSize: 15, textAlign: "center", fontWeight: 'bold'}}>{item.status == 'Progress' ? 'P' : 'IP'}</Text>
                                        </View>
                                    </View>
                                    <View style={{marginLeft: 10, flex: 1, flexDirection: 'column'}}>
                                        <Text numberOfLines={2} style={{fontSize: 17, marginBottom: 5, color: '#66686b', fontWeight: 'bold'}}>{item.judul}</Text>
                                        <Text numberOfLines={4} style={{fontSize: 13, marginVertical: 5, color: '#8c8e91', fontWeight: 'normal'}}>{item.deskripsi}</Text>
                                        <Text style={{fontSize: 13, marginVertical: 5, color: '#8c8e91', fontWeight: 'normal'}}>{item.timeCreated}</Text>
                                    </View>
                                </View>
                                <View style={{backgroundColor: '#FAFAFA', height: 1}}></View>
                            </View>
                        </TouchableOpacity>
                    </SwipeOut>
                }
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white'
    },
    toolbar: {
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        flexDirection: 'row',
        backgroundColor: '#1e7ebf',
        height: 56
    },
    containerMain: {
        flexDirection: 'column',
        padding: 10
    }
})