jest.mock('react-native-gesture-handler', () => ({ GestureHandlerRootView: ({children}) => children }));
jest.mock('react-native-reanimated', () => ({
  default: { call: () => {} },
  useSharedValue: jest.fn(() => ({ value: 0 })),
  useAnimatedStyle: jest.fn(() => ({})),
  withTiming: jest.fn((v) => v),
}));
jest.mock('@react-navigation/native', () => ({ NavigationContainer: ({children}) => children, createNavigatorFactory: jest.fn(), useNavigation: jest.fn() }));
jest.mock('@react-navigation/stack', () => ({ createStackNavigator: jest.fn(() => ({ Navigator: ({children}) => children, Screen: () => null })), TransitionPresets: { ModalSlideFromBottomIOS: {} } }));
jest.mock('@react-navigation/bottom-tabs', () => ({ createBottomTabNavigator: jest.fn(() => ({ Navigator: ({children}) => children, Screen: () => null })) }));
jest.mock('@gorhom/bottom-sheet', () => ({
  BottomSheetModalProvider: ({children}) => children,
}));
jest.mock('react-native-maps', () => ({}));
jest.mock('react-native-fast-image', () => ({}));
jest.mock('react-native-linear-gradient', () => 'LinearGradient');
jest.mock('react-native-device-info', () => ({ getUniqueId: jest.fn(() => Promise.resolve('test-id')) }));
jest.mock('react-native-default-preference', () => ({ get: jest.fn(() => Promise.resolve(null)), set: jest.fn(() => Promise.resolve()) }));
jest.mock('@react-native-async-storage/async-storage', () => ({}));
jest.mock('react-native-image-crop-picker', () => ({ openPicker: jest.fn(), openCamera: jest.fn() }));
jest.mock('react-native-fast-image', () => 'FastImage');
jest.mock('react-native-linear-gradient', () => 'LinearGradient');
jest.mock('react-native-maps', () => ({ PROVIDER_GOOGLE: 'google', Marker: () => null }));
jest.mock('react-native-calendar-picker', () => 'CalendarPicker');
jest.mock('react-native-modal-datetime-picker', () => 'DateTimePickerModal');
jest.mock('react-native-dropdown-picker', () => 'DropDownPicker');
jest.mock('react-native-device-info', () => ({ getUniqueId: jest.fn(() => Promise.resolve('test-id')) }));
jest.mock('react-native-default-preference', () => ({ get: jest.fn(() => Promise.resolve(null)), set: jest.fn(() => Promise.resolve()) }));
jest.mock('react-native-location', () => ({ requestPermission: jest.fn(() => Promise.resolve(true)), configure: jest.fn(), getLatestLocation: jest.fn(() => Promise.resolve({})), subscribeToLocationUpdates: jest.fn() }));
jest.mock('react-native-app-settings', () => ({ open: jest.fn() }));
jest.mock('react-native-loading-spinner-overlay', () => 'Spinner');
jest.mock('react-native-tags', () => 'Tags');
jest.mock('react-native-sliders', () => 'Slider');
jest.mock('@react-native-community/slider', () => 'Slider');
jest.mock('react-native-search-bar', () => 'SearchBar');
jest.mock('react-native-pages', () => ({ Pages: ({children}) => children }));
jest.mock('react-native-otp-textinput', () => 'OTPTextView');
