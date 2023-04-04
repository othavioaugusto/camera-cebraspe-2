import {
    PermissionsAndroid
} from "react-native";

async function getPermissao_WRITE_EXTERNAL_STORAGE() {
    const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
            title: "Armazenar arquivos",
            message: "O aplicativo precisa de permissão.",
            buttonNeutral: "Pergunte-me depois",
            buttonNegative: "Não",
            buttonPositive: "Sim"
        }
    );

    return granted;
}

async function getPermissao_READ_EXTERNAL_STORAGE() {
    const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
            title: "Consultar arquivos",
            message: "O aplicativo precisa de permissão.",
            buttonNeutral: "Pergunte-me depois",
            buttonNegative: "Não",
            buttonPositive: "Sim"
        }
    );

    return granted;
}

module.exports = {
    getPermissao_WRITE_EXTERNAL_STORAGE,
    getPermissao_READ_EXTERNAL_STORAGE
};
