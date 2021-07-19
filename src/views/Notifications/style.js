import { StyleSheet } from "react-native";

export default StyleSheet.create({
    btnMoreContainer: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        margin: 10,
        position: 'relative'
    },
    btnMoreContent : {
        backgroundColor: "#f16921",
        borderRadius: 100,
        elevation: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        width: '100%'
    },
    btnMoreText: {
        alignSelf: "center",
        color: "#fff",
        fontSize: 12,
        fontWeight: "bold",
        textTransform: "uppercase"
    },
    header: {
        backgroundColor: '#f16820',
        height: 60,
    },
    headerTitle: {
        color: '#ffffff',
        fontSize: 18,
    },
    content:{
        flexGrow: 1,
        backgroundColor: '#ffffff',
    },
    centeredContent: {
        flex: 1,
    },
    centeredGrid: {
        alignItems: "center",
        justifyContent: "center",
    },
    icon: {
        color: 'white', 
    },
    image: {
        width: 64, height: 24,
        marginLeft: 24,
        resizeMode: 'stretch', 
        tintColor: 'white',
    },
    filterCardContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        borderBottomColor: '#b6b5b5a3',
        borderBottomWidth: 1,
        paddingTop: 20,
        paddingBottom: 20,
       
    },
    filterCardText: {
        flex: 1,
        fontWeight: "bold",
        color: "#5a6773",
    },
    filterCardDate: {
        color: "#575b5769",
        fontSize: 12,
        marginTop: 5,
    },
    filterArrow: {
        position: "absolute",
        right: 20,
    }
});
