import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        // marginTop: Constants.statusBarHeight,
    },
    scrollView: {
        flex: 1,
        // justifyContent: 'space-between',
        // backgroundColor: 'pink',
    },
    contentModal: {
      backgroundColor: 'white',
      padding: 22,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 4,
      borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    contentTitleModal: {
      fontSize: 20,
      marginBottom: 12,
    }
});
