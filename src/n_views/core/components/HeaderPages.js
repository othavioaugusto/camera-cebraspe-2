import React from "react";
import { Header, Title, Button, Icon, Left, Right, Body } from "native-base";
import { StyleSheet } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const HeaderPages = ({ ...props }) => (
  <Header {...props}>
    { (props.navegarMenu || props.navegarBack) ?
    <Left style={{ flex: 1 }}>
      <Button  transparent onPress={props.navegarMenu ? props.navegarMenu : props.navegarBack}>
        <Icon name={props.navegarMenu ? "menu" : "arrow-back"} />
      </Button>
    </Left>
    : undefined }
    <Body style={ (props.navegarMenu || props.navegarBack) ? style.bodyHeader : style.bodyHeaderSozinho }>
      <Title style={{fontWeight:"bold"}} >{props.titulo ? props.titulo : ""}</Title>
    </Body>
    { (props.search || props.help || props.home || props.share) ?
    <Right style={{flex: 1}} >
      { props.home ?
        <Button transparent onPress={props.home}>
          {/* <Icon name="home" /> */}
          <FontAwesome5
            name={"home"}
            size={20}
            color="#fff"
          />
        </Button>
        : undefined }
    </Right>
    : undefined }
  </Header>
);

var style = StyleSheet.create({
  bodyHeader: {
    flex: 4,
    // justifyContent: "center",
    // alignItems: "center"
  },
  bodyHeaderSozinho: {
    flex: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  pesquisaButton: {
    marginRight: 5,
  },
  pesquisaShadow: {
    shadowColor: "rgba(0,0,0, .4)", // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity:  0.4, // IOS
    shadowRadius: 2, //IOS
    shadowOffset: { width: 1, height: 1 },
    elevation: 3,
    backgroundColor : "#0000", // invisible color 
    marginRight: 5
  },
  pesquisaSimples: {
    backgroundColor : "#cccddd" // invisible color
  }
});

export default HeaderPages;
