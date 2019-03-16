import React, { Component } from "react";
import axios from "react-native-axios";
import {
  API_URL,
  VSN_GATT_SERVICE_UDID,
  MODE_CHARACTERISTICS_UUID,
  KEY_PRESS_CHARACTERISTICS_UUID,
  KEY_PRESS_FALL_DETECT_ACK_CHARACTERISTICS_UUID,
  KEY_PRESS_FALL_DETECT_CHARACTERISTICS_UUID,
  VERIFICATION_CHARACTERISTICS_UUID,
  BLE_FALL_KEYPRESS_DETECTION_UUID,
  EMERGENCY_ALERT_CHARACTERISTICS_UUIDEMERGENCY_ALERT_CHARACTERISTICS_UUID,
  EMERGENCY_ALERT_CHARACTERISTICS,
  EmergencyAlertBytes,
  verificationBytes,
  KeyPressByte,
  valNormalMode,
  fallAndPress
} from "./config";
import BleManager from "react-native-ble-manager";
import { Alert, NativeModules, NativeEventEmitter } from "react-native";
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

class Lonar extends Component {
  constructor(props) {
    super(props);
    this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
    this.handleUpdateValueForCharacteristic = this.handleUpdateValueForCharacteristic.bind(
      this
    );
    var baseClass;
  }
  state = {
    peripheral: []
  };
  startScan(target) {
    baseClass = target;
    BleManager.start({ showAlert: true }).then(() => {
      BleManager.scan(target.state.uuids, 10, false).then(() => {});
    });

    this.handlerDiscover = bleManagerEmitter.addListener(
      "BleManagerDiscoverPeripheral",
      this.handleDiscoverPeripheral
    );

    this.handlerUpdate = bleManagerEmitter.addListener(
      "BleManagerDidUpdateValueForCharacteristic",
      this.handleUpdateValueForCharacteristic
    );
  }

  getPeripheralList = () => {
    return this.state.peripheral;
  };

  handleUpdateValueForCharacteristic(data) {
    if (data.value == 3) {
    } else if (data.value == 0) {
      baseClass.setState({
        stateUpdate: "0" //// button press
      });
    } else if (data.value == 1) {
      baseClass.setState({
        stateUpdate: "1" //// button release
      });
    } else if (data.value == 4) {
      baseClass.setState({
        stateUpdate: "4" ///fall detection
      });
    }
  }

  handleDiscoverPeripheral(peripheral) {
    baseClass.setState({
      peripheral: [...baseClass.state.peripheral, peripheral]
    });
  }
  //// connect Ble Device
  connectWithDevice = item => {
    BleManager.connect(item.id)
      .then(() => {
        BleManager.retrieveServices(item.id).then(peripheralInfo => {
          ///// Retrive BLE Device service
          BleManager.write(
            /// SOS Button Verification
            item.id,
            VSN_GATT_SERVICE_UDID,
            VERIFICATION_CHARACTERISTICS_UUID,
            verificationBytes,
            5
          )
            .then(() => {
              BleManager.startNotification(
                // write service for Get notification from SOS button
                item.id,
                VSN_GATT_SERVICE_UDID,
                KEY_PRESS_FALL_DETECT_CHARACTERISTICS_UUID
              )
                .then(() => {
                  BleManager.write(
                    // write service for get fall detection event.
                    item.id,
                    VSN_GATT_SERVICE_UDID,
                    KEY_PRESS_CHARACTERISTICS_UUID,
                    fallAndPress,
                    1
                  )
                    .then(() => {
                      BleManager.write(
                        item.id,
                        VSN_GATT_SERVICE_UDID,
                        MODE_CHARACTERISTICS_UUID,
                        valNormalMode
                      )
                        .then(() => {
                          BleManager.writeWithoutResponse(
                            item.id,
                            VSN_GATT_SERVICE_UDID,
                            MODE_CHARACTERISTICS_UUID,
                            valNormalMode
                          )
                            .then(() => {})
                            .catch(error => {
                              //console.log(error);
                            });
                          // Success code
                        })
                        .catch(error => {
                          // Failure code
                          //console.log(error);
                        });
                    })
                    .catch(error => {
                     // console.log(error);
                    });
                })
                .catch(error => {
                  // Failure code
                  //console.log(error);
                });
              // Success code
              //console.log("Notification started");
            })
            .catch(error => {
              // Failure code
              //console.log(error);
            });
        });
      })
      .catch(error => {
        // Failure code
       // console.log(error);
      });
  };

  sendEmergencyAlert(item_id) {
    BleManager.writeWithoutResponse(
      item_id,
      EMERGENCY_ALERT_CHARACTERISTICS_UUID,
      EMERGENCY_ALERT_CHARACTERISTICS,
      EmergencyAlertBytes
    )
      .then(() => {})
      .catch(error => {
       // console.log(error);
      });
  }

  disconnectAllDevices(DeviceId) {
    BleManager.disconnect(DeviceId)
      .then(() => {
        // Success code
        //console.log("Disconnected");
      })
      .catch(error => {
        // Failure code
        // console.log(error);
      });
  }

  sendAlert = async (token, device_id, date, type) => {
    /// Api for emergency Alert trigger
    try {
      const postData = {
        date: date,
        device_id: device_id,
        type: type
      };
      let axiosConfig = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      };
      var Url = `${API_URL}${"/alert?access_token="}`;
      var token = token;
      var final = `${Url}${token}`;
      Alert.alert(final);
      const response = await axios.post(final, postData, axiosConfig);
      return response;
    } catch (err) {
      return { success: false, message: err };
    }
  };

  register = async activation_code => {
    //Api for registration
    try {
      const postData = {
        activation_code: activation_code
      };
      let axiosConfig = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      };
      var Url = `${API_URL}${"/register"}`;
      const response = await axios.post(Url, postData, axiosConfig);
      return response;
    } catch (err) {
      return { success: false, message: err };
    }
  };
}

export default new Lonar();
