export const API_URL = 'https://connect-staging-20.blackline-dev.com/1';

export const VSN_GATT_SERVICE_UDID = "fffffff0-00f7-4000-b000-000000000000";
export const MODE_CHARACTERISTICS_UUID = "fffffff1-00f7-4000-b000-000000000000";
export const KEY_PRESS_CHARACTERISTICS_UUID = "fffffff2-00f7-4000-b000-000000000000";
export const KEY_PRESS_FALL_DETECT_ACK_CHARACTERISTICS_UUID =
  "fffffff3-00f7-4000-b000-000000000000";
export const KEY_PRESS_FALL_DETECT_CHARACTERISTICS_UUID =
  "fffffff4-00f7-4000-b000-000000000000";
export const VERIFICATION_CHARACTERISTICS_UUID =
  "fffffff5-00f7-4000-b000-000000000000"
export const BLE_FALL_KEYPRESS_DETECTION_UUID = "fffffff4-00f7-4000-b000-000000000000";
export const EMERGENCY_ALERT_CHARACTERISTICS_UUID = "1802";
export const EMERGENCY_ALERT_CHARACTERISTICS = "2A06";

export const EmergencyAlertBytes = [0x02];
export const verificationBytes = [0x80, 0xbe, 0xf5, 0xac, 0xff];
export const KeyPressByte = [0x01];
export const valNormalMode = [0x00];
export const fallAndPress = [0x05];
