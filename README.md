## Repositorio del proyecto

https://dev.azure.com/ASEConecta/ASE-VENTAS/_git/ase-ventas-mobile


## Prerequistos

* Tener instalado git
	https://git-scm.com/book/en/v2/Getting-Started-Installing-Git

* Tener instalado node (version 10)
    https://nodejs.org/en/

* Tener instalado expo
    https://docs.expo.io/get-started/installation/

* Tener permisos sobre el repositorio del proyecto


## Instalación

Desde una terminal clonar el proyecto, ejecutar:
```
git clone https://ASEConecta@dev.azure.com/ASEConecta/ASE-VENTAS/_git/ase-ventas-mobile
```

Luego ejecutar el comando npm para descargar dependencias
```
npm install
```


## Ejecución

#### Iniciar expo

Desde una terminal, en la raíz del proyecto, ejecutar:
```
npm start
```

En el navegador introducir la siguiente url: http://localhost:19002/

#### Iniciar la APP en el dispositivo

1.- Abrir la aplicación Expo en el dispositivo.

2.- Escanear el código QR que aparece en la webapp http://localhost:19002/


## Construcción de la APP

#### Android

1.- Desde una terminal, en la raíz del proyecto, ejecutar:
```
expo build:android --release-channel <AMBIENTE> -t apk
```

*Donde `<AMBIENTE>` puede tomar los siguientes valores:*
```
• development
• testing
• uat
• production
```

1.1- Si no tiene cuenta o no se encuentra logueado en expo, deberá seleccionar una de estas opciones:
```
An Expo user account is required to proceed.
? How would you like to authenticate? (Use arrow keys)
❯ Make a new Expo account 
  Log in with an existing Expo account 
  Cancel
```

2.- Seleccionar la opción que permite subir el propio keystore.
```
There is no valid Keystore defined for this app
? Would you like to upload a Keystore or have us generate one for you?
If you don't know what this means, let us generate it! :) › - Use arrow-keys. Return to submit.
    Generate new keystore
❯   I want to upload my own file
```

3.- Subir el archivo keystore ASE-Ventas.jks para firmar el apk 
```
WARNING! In this mode, we won't be able to make sure that your credentials are valid.
Please double check that you're uploading valid files for your app otherwise you may encounter strange errors!

When building for IOS make sure you've created your App ID on the Apple Developer Portal, that your App ID
is in app.json as `bundleIdentifier`, and that the provisioning profile you
upload matches that Team ID and App ID.

✔ Path to the Keystore file. … <PATH_ARCHIVO>
✔ Keystore password … c9870ee5dd6d46b587be0ecece7006e9
✔ Key alias … QHN0aWxsaXNhbm8ubS9BU0UtVmVudGFz
✔ Key password … df5e2179f73f4ec3bcd78dc4e771c2b7
Keystore updated successfully
```

*Donde `<PATH_ARCHIVO>` es la ruta completa del archivo ASE-Ventas.jks que se encuentra en la raíz del proyecto.*

4.- Expo generará un link (que tendrá una validez de 30 días) desde el cual se podrá descargar el archivo .apk
```
Waiting for build to complete.
You can press Ctrl+C to exit. It won't cancel the build, you'll be able to monitor it at the printed URL.
✔ Build finished.
Successfully built standalone app: https://expo.io/artifacts/.........
```

#### IOS

1.- Desde una terminal, en la raíz del proyecto, ejecutar:
```
expo build:ios --release-channel <AMBIENTE> -t archive --dist-p12-path <PATH_ARCHIVO_P12> --team-id 783Q8GWZKZ --provisioning-profile-path <PATH_ARCHIVO_PROVISIONING>
```

*Donde:*

*`<AMBIENTE>` puede tomar los siguientes valores:*
```
• development
• testing
• uat
• production
```
*`<PATH_ARCHIVO_P12>` es la ruta completa del archivo .p12*

*`<ARCHIVO_PROVISIONING>` es la ruta del archivo .mobileprovision*

1.1- Si no tiene cuenta o no se encuentra logueado en expo, deberá seleccionar una de estas opciones:
```
An Expo user account is required to proceed.
? How would you like to authenticate? (Use arrow keys)
❯ Make a new Expo account 
  Log in with an existing Expo account 
  Cancel
```

2.- Ingresar `n` ya que no se cuenta con los permisos necesarios para acceder al Apple Store.
```
Configuring credentials for mauroopendev in project ASE-Ventas
? Do you have access to the Apple account that will be used for submitting this app to the App Store? (Y/n)
```

3.- Seleccionar la opción que permite subir el propio certificado .p8.
```
? Will you provide your own Apple Push Notifications service key? › - Use arrow-keys. Return to submit.
    Let Expo handle the process
❯   I want to upload my own file
```

4.- Subir el archivo .p8
```
✔ Path to P8 file: … <PATH_ARCHIVO_P8>
✔ Key ID: … <KEY_ID>
✔ Apple Team ID: … 783Q8GWZKZ
```

*Donde: `<PATH_ARCHIVO_P8>` es la ruta completa al archivo .p8*

*`<KEY_ID>` es el identificador de la key asociada al certificado*

* **Nota:** *Lamentablemente en la cuenta de Apple de Medifé ya existen 2 certificados para Notificaciones Push (máximo permitido por Apple) y no se puede generar otro sin borrar uno de ellos.
Dado que estos certificados corresponden a aplicaciones mobile productivas, y el equipo de Medifé no cuenta con ellos, para sortear este paso, se debe incorporar un archivo 'ficticio' (realizar una copia del archivo .p12 y cambiarle la extensión a .p8). 
De igual manera con el ID de key asociada, se debe ingresar un ID aleatorio (por ej. 123456)* 

5.- Expo generará un link (que tendrá una validez de 30 días) desde el cual se podrá descargar el archivo .ipa
```
Waiting for build to complete.
You can press Ctrl+C to exit. It won't cancel the build, you'll be able to monitor it at the printed URL.
✔ Build finished.
Successfully built standalone app: https://expo.io/artifacts/.........
```

###### SHAREPOINT MEDIFE

Los certificados de iOS pueden descargarse del sharepoint de Medifé:
https://medife-my.sharepoint.com/personal/sebastianabate_medife_com_ar/_layouts/15/guestaccess.aspx?folderid=07d1badd5887644cebf37282005dc238f&authkey=AU5MYsygM2bM_9sQShG1sKI&expiration=2021-09-25T16%3A51%3A25.000Z&e=39cQnH
```
El usuario es anónimo y la clave es: 123456
```


## Instalación de la APP

#### Android

1.- En el dispositivo, ingresar a ajustes.

2.- Seleccionar la opción seguridad.

3.- Habilitar la opción `Origenes desconocidos`.

4.- Descargar el archivo .apk desde el link generado por Expo.

5.- Seleccionar el archivo .apk para instalar la App.

#### IOS

1.- Ingresar en la página https://www.diawi.com/

2.- Subir el archivo .ipa

3.- Desde el navegador del dispositivo ingresar a la url generada por diawi y continuar los pasos de instalación. 
