import { COLORS, FONTS, SIZES } from "./theme";

export const GlobalStyleSheet = {
    headerBtn : {
        height:48,
        width:48,
        borderWidth:1,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10,
    },
    homeHeader : {
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal:15,
        paddingVertical:10,
    },
    container : {
        padding : 15,
        marginLeft : 'auto',
        marginRight : 'auto',
        width : '100%',
    },
    row : {
        flexDirection : 'row',
        marginHorizontal : -5,
        flexWrap : 'wrap',
    },
    col33 : {
        width : '33.33%',
        paddingHorizontal : 5,
    },
    col66 : {
        width : '66.67%',
        paddingHorizontal : 5,
    },
    col50 : {
        width : '50%',
        paddingHorizontal : 5,
    },
    col100:{
        width : '100%',
        paddingHorizontal : 5,
    },
    card : {
        padding:15,
        borderRadius:SIZES.radius,
        marginBottom:15,
        borderWidth:1,
    },
    shadow : {
        shadowColor : "rgba(0,0,0,.5)",
        shadowOffset : {
            width:0,
            height:4,
        },
        shadowOpacity : .30,
        shadowRadius : 4.65,
        elevation : 8,
    }
}