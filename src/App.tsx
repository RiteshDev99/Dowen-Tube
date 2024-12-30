import React from 'react';
import {
    Alert,
    PermissionsAndroid,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
const App = () => {
    const [pastedUrl, setPastedUrl] = React.useState('');

    const requestStoragePermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                    title: 'Down-Tube App',
                    message:
                        'Down-Tube App needs access to your storage ' +
                        'so you can download videos.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                DownloadFile();
            } else {
                Alert.alert('Storage permission denied');
            }
        } catch (err) {
            console.warn(err);
            Alert.alert('Error', 'Permission request failed');
        }
    };

    const DownloadFile = () => {
        const { config, fs } = RNFetchBlob;
        const fileDir = fs.dirs.DownloadDir;
        const fileName = `Download_${Math.floor(Date.now())}.mp4`; // Fixed file name format

        config({
            fileCache: true,
            addAndroidDownloads: {
                useDownloadManager: true,
                notification: true,
                path: `${fileDir}/${fileName}`,
                description: 'Downloading video...',
            },
        })
            .fetch('GET', pastedUrl)
            .then((res) => {
                console.log('The file saved to ', res.path());
                Alert.alert('File downloaded successfully');
            })
            .catch((error) => {
                console.error('Download error: ', error);
                Alert.alert('Download failed', 'Please check the URL or try again later.');
            });
    };

    return (
        <>
            <SafeAreaView>
                <View style={[styles.container, styles.background]}>
                    <Text style={styles.heading}>Down-Tube</Text>
                </View>
                <View style={styles.InBtn}>
                    <TextInput
                        style={styles.input}
                        value={pastedUrl}
                        onChangeText={setPastedUrl}
                        placeholder={'Paste Your URL'}
                    />
                    <TouchableOpacity
                        style={styles.Btn}
                        onPress={() => {
                            if (pastedUrl.trim() !== '') {
                                requestStoragePermission();
                            } else {
                                Alert.alert('Error', 'Please paste a valid URL.');
                            }
                        }}
                    >
                        <Text style={styles.btnText}>Download</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 80,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    background: {
        // backgroundColor: '#6A89CC',
    },
    heading: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#192A56',
        marginTop: 20,
    },
    input: {
        height: 70,
        margin: 25,
        borderWidth: 1,
        padding: 10,
        textAlign: 'center',
        color: '#192A56',
        borderRadius: 10,
    },
    InBtn: {
        height: 500,
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    Btn: {
        height: 50,
        width: 300,
        backgroundColor: '#74B9FF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginLeft: 46,
        borderRadius: 10,
    },
    btnText: {
        color: 'white',
        fontSize: 18,
    },
});

export default App;
