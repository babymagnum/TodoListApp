import React, { Component } from 'react';
import {StyleSheet, StatusBar, ActivityIndicator, Dimensions, Image, Text, ToastAndroid, View, TextInput, TouchableOpacity} from 'react-native'
import firebase from 'react-native-firebase'
import Modal from 'react-native-modal'
//import toast from 'react-native-toast-native'
import GooglePlacePicker from 'react-native-google-place-picker'

class AddTodoList extends Component {
    constructor(props) {
        super(props);
        this.ref = firebase.firestore().collection('Todo');

        this.state = {
            todoId: '',
            dataItem: null,
            inputTitle: '',
            inputDescription: '',
            address: '',
            showImage: false,
            latLng: '0,0',
            isModalVisible: false,
        };
    }

    async save(id) {
        const defaultDoc = {
            id: id,
            judul: this.state.inputTitle,
            deskripsi: this.state.inputDescription,
            alamat: this.state.address,
            latlng: this.state.latLng,
            status: 'Progress',
            timeCreated: new Date().toLocaleString()
        }

        await this.ref.doc(id).set(defaultDoc).then(function(){
            ToastAndroid.show('Berhasil menyimpan todo', ToastAndroid.SHORT)
        }).catch(function(error){
            ToastAndroid.show(error.message, ToastAndroid.SHORT)
        })

        this.setState({isModalVisible: false, inputDescription: '', inputDescription: '', address: ''})
    }

    generateKey = (number) =>{
        return require('random-string')({length: number})
    }

    openPlacePicker(){
        GooglePlacePicker.show((response) => {
            if (response.didCancel) {
                ToastAndroid.show('cancelled GooglePlacePicker', ToastAndroid.SHORT)
            }
            else if (response.error) {
                ToastAndroid.show(response.error.message, ToastAndroid.SHORT)
            }
            else {
              this.setState({
                latLng: response.latitude.toString() + ',' + response.longitude.toString(),
                address: response.address,
                showImage: true
              });
            }
          })
    }

    async updateData(id) {
        await firebase.firestore().collection('Todo').doc(id).update({
            id: id,
            judul: this.state.inputTitle == '' ? this.state.dataItem.judul : this.state.inputTitle,
            deskripsi: this.state.inputDescription == '' ? this.state.dataItem.deskripsi : this.state.inputDescription,
            alamat: this.state.address == '' ? this.state.dataItem.alamat : this.state.address,
            latlng: this.state.latLng == '' ? this.state.dataItem.latlng : this.state.latLng,
            status: 'Progress',
            timeCreated: this.state.dataItem.timeCreated
        }).then(function(){
            ToastAndroid.show("Sukses mengupdate data", ToastAndroid.SHORT)
        }).catch(function(error){
            ToastAndroid.show(error.message, ToastAndroid.SHORT)
        })

        this.setState({isModalVisible: false})
    }

    checkData = () => {
        if(this.state.inputTitle == '' && this.state.dataItem.judul == ''){
            ToastAndroid.show('Masukan judul terlebih dahulu', ToastAndroid.SHORT)
            return
        } else if(this.state.inputDescription == '' && this.state.dataItem.deskripsi == ''){
            ToastAndroid.show('Masukan deskripsi terlebih dahulu', ToastAndroid.SHORT)
            return
        } else if(this.state.address == '' && this.state.dataItem.alamat == ''){
            ToastAndroid.show('tentukan lokasi terlebih dahulu', ToastAndroid.SHORT)
            return
        }

        this.setState({isModalVisible: true})

        if(this.state.dataItem != null){
            this.updateData(this.state.dataItem.id)
        } else{
            this.save(this.generateKey(15))
        }
    }

    componentDidMount(){
        this.setState({
            dataItem: this.props.navigation.state.params.item == null ? null : this.props.navigation.state.params.item
        }) 

        console.log(this.state.todoId)
    }

    render() {
        return (  
            <View style={styles.container}>
                <StatusBar
                    backgroundColor='#176ca5'
                    barStyle='light-content'
                />
                <View style={styles.toolbar}>
                    <TouchableOpacity 
                        onPress={() => this.props.navigation.goBack()}
                        style={{alignSelf: "center"}}>
                        <Image 
                            style={{height: 20, width: 20, tintColor: 'white'}}
                            source={require('./assets/left.png')} />
                    </TouchableOpacity>
                    <Text 
                        numberOfLines={1}
                        style={{
                        alignSelf: "center",
                        fontSize: 20,
                        marginLeft: 20,
                        flex: 1,
                        color: 'white'
                    }}>{this.state.dataItem != null ? this.state.dataItem.judul : 'Add Todo List'}</Text>
                </View>
                <View style={{padding: 10, flexDirection: "column", flex: 1}}>
                    <Text style={{fontSize: 15}}>JUDUL</Text>
                    <TextInput 
                        placeholderTextColor= '#c8ccce'
                        placeholder='Tuliskan judul todo yang ingin dikerjakan...'
                        style={{color: '#949799', marginVertical: 5, borderRadius: 5, backgroundColor: '#FAFAFA', padding: 10}}
                        keyboardType='default'
                        returnKeyType='next'
                        onChangeText={(text) => this.setState({inputTitle: text})}
                        onSubmitEditing={() => this.refs.inputDeskripsi.focus()}
                    >{this.state.dataItem != null ? this.state.dataItem.judul : this.state.inputTitle}</TextInput>

                    <Text style={{marginTop: 5, fontSize: 15}}>DESKRIPSI</Text>
                    <TextInput 
                        placeholderTextColor= '#c8ccce'
                        placeholder='Tuliskan deskripsi todo yang ingin dikerjakan...'
                        style={{flexWrap: 'wrap', color: '#949799', marginVertical: 5, borderRadius: 5, backgroundColor: '#FAFAFA', padding: 10}}
                        keyboardType='default'
                        returnKeyType='done'
                        multiline={true}
                        onChangeText={(text) => this.setState({inputDescription: text})}
                        ref={'inputDeskripsi'}
                    >{this.state.dataItem != null ? this.state.dataItem.deskripsi : this.state.inputDescription}</TextInput>

                    <View style={{marginTop: 10, flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={{fontSize: 15, alignSelf: "center"}}>LOCATION</Text>
                        <TouchableOpacity 
                            onPress={() => this.openPlacePicker()}
                            style={{borderRadius: 5, backgroundColor: '#99dd92'}}>
                            <Text style={{fontSize: 15, color: 'white', paddingVertical: 5, paddingHorizontal: 10}}>{this.state.dataItem != null ? 'UBAH LOKASI' : 'PILIH LOKASI'}</Text>
                        </TouchableOpacity>
                    </View>

                    <TextInput 
                        placeholder='Tekan tombol Pilih Lokasi atau ketik manual alamat lokasi.'
                        placeholderTextColor='#c8ccce'
                        multiline={true}
                        onChangeText={(text) => this.setState({address: text})}
                        style={{padding: 10, backgroundColor: '#FAFAFA', borderRadius: 5, color: '#949799', marginTop: 10, fontSize: 15, lineHeight: 25}}>
                        {this.state.dataItem != null ? this.state.dataItem.alamat : this.state.address}
                    </TextInput>
                
                    <TouchableOpacity 
                        onPress={() => this.checkData()}
                        style={{
                        marginTop: 20, paddingHorizontal: 10, borderRadius: 100, 
                        paddingVertical: 15, alignSelf: "center", width: dimensions.width - 150, 
                        backgroundColor: '#1e7ebf'}}>
                        <Text style={{textAlign: "center", color: 'white', fontWeight: 'bold'}}>{this.state.dataItem != null ? 'Simpan Perubahan' : 'Simpan'}</Text>
                    </TouchableOpacity>

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


            </View>
        );
    }
}
 
const dimensions = Dimensions.get('window')

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white'
    },
    toolbar: {
        paddingHorizontal: 10,
        flexDirection: 'row',
        backgroundColor: '#1e7ebf',
        height: 56
    },
    contentMain: {
        flexDirection: 'column',
        justifyContent: 'center',
        flex: 1
    },
})

export default AddTodoList;