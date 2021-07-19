import { Container, Text, Header, Content, Body, Footer } from 'native-base';
import { Image } from 'react-native';
import React from 'react';
import styles from './style';
import { DrawerItemList } from '@react-navigation/drawer';
import Constants from 'expo-constants';
import { ScrollView } from 'react-native-gesture-handler';

export default function CustomDrawer (props) {
    const version = Constants.manifest.version;
    return (
        <Container style={{flex:1, backgroundColor: '#f16820'}}>
            <Header style={styles.header} androidStatusBarColor={'#e45205'}>
                <Body style={{alignItems: 'center'}}>
                    <Image
                        source={require('../../../assets/ase_nacional_blanco_imagen_app.png')}
                        style={styles.image}
                        testID={'imgAseNacional'}
                    />
                </Body>
            </Header>
            <ScrollView keyboardShouldPersistTaps='always' style={styles.scrollView} bounces={false}>
                <DrawerItemList testID={'drawerListButtons'} {...props} />
            </ScrollView>
            <Footer style={styles.footer}>
                <Text style={{color: 'white'}} testID={'lblVersion'}> Versión {version}</Text>
            </Footer>
        </Container>
    )
}