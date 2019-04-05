/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { Dimensions, AppRegistry, Platform, StyleSheet, Text, View, Alert, PermissionsAndroid, TouchableOpacity, ToastAndroid, Button } from 'react-native';
import Camera, { RNCamera } from 'react-native-camera';
import BarcodeFinder from './BarcodeFinder';


export default class App extends Component {
    constructor(props) {
        super(props);
        this.camera = null;
        this.barcodeCodes = [];

        this.state = {
          camera: {
            type: RNCamera.Constants.Type.back,
    	    flashMode: RNCamera.Constants.FlashMode.on,
    	    barcodeFinderVisible: true
          },
    	  openCamera: false,
    	  barcodeData: ''
        };
      }

      onBarCodeRead(scanResult) {
          ToastAndroid.show(scanResult.data, ToastAndroid.SHORT);
          // console.log('after scan', performance.now());
          this.setState({ openCamera: false, barcodeData: scanResult.data });
          if (scanResult.data != null) {
      	    if (!this.barcodeCodes.includes(scanResult.data)) {
      	        this.barcodeCodes.push(scanResult.data);
      	        }
           }
         return;
       }

       openCamera () {
           if(!this.state.openCamera) {
                this.setState({ barcodeData: '' });
           }
            this.setState({ openCamera: !this.state.openCamera });
       }

    takePicture() {
        const options = {}

        this.camera.capture({metadata: options}).then((data) => {
          console.log(data)
        }).catch((error) => {
          console.log(error)
        })
    }

    pendingView() {
        return (
          <View
            style={{
              flex: 1,
              backgroundColor: 'lightgreen',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text>Waiting</Text>
          </View>
        );
      }

  render() {
    const { height, width } = Dimensions.get('window');
    const maskRowHeight = (height - 300) / 5;
    const maskColWidth = (width - 300) / 2;
    const buttonTittle = this.state.openCamera ? 'Stop Scanning' : 'Start Scanning'
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to PLM Quality1</Text>
        {this.state.openCamera ?
            <RNCamera
                ref={(cam) => {
                    this.camera = cam
                  }}
              aspect={Camera.constants.Aspect.fill}
              onBarCodeRead={this.onBarCodeRead.bind(this)}
              permissionDialogTitle={'Permission to use camera'}
              permissionDialogMessage={'We need your permission to use your camera phone'}
              type={this.state.camera.type}
              style={styles.preview}
              defaultTouchToFocus
            >
               <View style={styles.maskOutter}>
                   <View style={[{ flex: maskRowHeight  }, styles.maskRow, styles.maskFrame]} />
                    <View style={[{ flex: 30 }, styles.maskCenter]}>
                    <View style={[{ width: maskColWidth }, styles.maskFrame]} />
                    <View style={styles.maskInner} />
                   <View style={[{ width: maskColWidth }, styles.maskFrame]} />
                 </View>
               <View style={[{ flex: maskRowHeight }, styles.maskRow, styles.maskFrame]} />
               </View>
            </RNCamera>
            :
            <Text style={{ marginTop: 10 }}>{this.state.barcodeData}</Text>
        }
        <View style={{ marginTop: 10 }}>
            <Button
              onPress={this.openCamera.bind(this)}
              title={buttonTittle}
              color="#841584"
            />
        </View>
      </View>
    );
  }
}

AppRegistry.registerComponent('App', () => App);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  preview: {
      flex: 1,
      justifyContent: 'flex-start',
    },
      scanScreenMessage: {
          fontSize: 14,
          color: 'white',
          textAlign: 'center',
          alignItems: 'center',
          justifyContent: 'center'
        },
        maskOutter: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'space-around',
          },
          maskInner: {
            width: 300,
            backgroundColor: 'transparent',
            borderColor: 'white',
            borderWidth: 1,
          },
          maskFrame: {
            backgroundColor: 'rgba(1,1,1,0.6)',
          },
          maskRow: {
            width: '100%',
          },
          maskCenter: { flexDirection: 'row' }
});
