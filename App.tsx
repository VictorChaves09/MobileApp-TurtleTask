/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import React1, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  BottomNavigation,
  FAB,
  Portal,
  Modal,
  Provider,
  TextInput,
  Button,
  Card,
  Avatar,
  Surface,
  Divider,
  Dialog,
  Checkbox,
  IconButton,
} from 'react-native-paper';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import axios from 'axios';
import Strapi from 'strapi-sdk-js';
import moment from 'moment';

axios.defaults.baseURL = 'http://localhost:1337/api';
const strapi = new Strapi({url: 'http://localhost:1337'});

const Stack = createNativeStackNavigator();
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
let userLoggedUsername = '';
let userId = '';
let userToken = '';

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Cadastro" component={Cadastro} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="ConfigConta" component={ConfigConta} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Login');
    }, 3000);
  }, [navigation]);

  return (
    <View style={styles.containerSplashScreen}>
      <Image source={require('./assets/logo.jpg')} style={styles.imagemLogo} />
    </View>
  );
};

function Login({navigation, route}): JSX.Element {
  navigation = useNavigation();

  const [email, setEmail] = React.useState('');
  const [senha, setSenha] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const [visible2, setVisible2] = React.useState(false);
  const hideDialog = () => setVisible(false);
  const hideDialog2 = () => setVisible2(false);

  const Autenticar = async () => {
    try {
      const test = await axios.get('/users');
      const emailExists = test.data.find(user => user.email === email);
      if (!emailExists) {
        setVisible(true);
        return null;
      }
      const response = await axios.post('/auth/local', {
        identifier: email,
        password: senha,
      });
      userLoggedUsername = response.data.user.username;
      userToken = response.data.jwt;
      userId = response.data.user.id;
      navigation.navigate('Home');
    } catch (error) {
      setVisible2(true);
    }
  };
  const navegarCadastro = () => {
    navigation.navigate('Cadastro');
  };

  return (
    <Provider>
      <View style={styles.containerLoginCadastro}>
        <Image
          source={require('./assets/tartarugalogin.jpg')}
          style={styles.imagemLogin}
        />
        <View style={styles.containerTextLogin}>
          <TextInput
            mode="outlined"
            label="Email"
            activeOutlineColor="#018015"
            style={styles.campoLogin}
            onChangeText={email => setEmail(email)}
          />
          <TextInput
            mode="outlined"
            label="Senha"
            activeOutlineColor="#018015"
            style={styles.campoLogin}
            value={senha}
            secureTextEntry
            onChangeText={senha => setSenha(senha)}
          />
        </View>
        <View style={styles.containerButton}>
          <Button
            style={styles.botao}
            mode="contained"
            buttonColor="#5CE95E"
            onPress={() => Autenticar()}>
            Login
          </Button>
        </View>
        <View>
          <TouchableOpacity onPress={navegarCadastro}>
            <Text style={styles.textoRodape}>
              Não tem conta? <Text style={styles.textoPress}>Criar conta</Text>
            </Text>
          </TouchableOpacity>
        </View>
        <Portal>
          <Dialog visible={visible}>
            <Dialog.Content>
              <Text>Usuário não cadastrado.</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button textColor="#018015" onPress={hideDialog}>Ok</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <Portal>
          <Dialog visible={visible2}>
            <Dialog.Content>
              <Text>Erro ao fazer login.</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button textColor="#018015" onPress={hideDialog2}>Ok</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </Provider>
  );
}

function Cadastro(navigation, route): JSX.Element {
  navigation = useNavigation();

  const [username, setUsuario] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setSenha] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const [visible1, setVisible1] = React.useState(false);
  const [visible2, setVisible2] = React.useState(false);
  const [visible3, setVisible3] = React.useState(false);
  const [visible4, setVisible4] = React.useState(false);
  const [visible5, setVisible5] = React.useState(false);
  const hideDialog = () => setVisible(false);
  const hideDialog1 = () => setVisible1(false);
  const hideDialog2 = () => setVisible2(false);
  const hideDialog3 = () => setVisible3(false);
  const hideDialog4 = () => setVisible4(false);
  const hideDialog5 = () => setVisible5(false);

  const navegarLogin = () => {
    navigation.navigate('Login');
  };

  const Cadastrar = async () => {
    if (username.length < 3) {
      setVisible5(true);
      return null;
    }
    if (password.length < 6) {
      setVisible4(true);
      return null;
    }
    const data = {
      username,
      email,
      password,
    };
    try {
      const test = await axios.get('/users');
      const emailExists = test.data.find(user => user.email === email);
      if (emailExists) {
        setVisible(true);
        return null;
      }
      const userExists = test.data.find(user => user.username === username);
      if (userExists) {
        setVisible3(true);
        return null;
      }
      const response = await strapi.register(data);
      setVisible1(true);
      return null;
    } catch (error) {
      console.log(error);
      setVisible2(true);
    }
  };

  return (
    <Provider>
      <View style={styles.containerLoginCadastro}>
        <Text style={styles.textoTitulo}>Crie sua conta</Text>
        <View style={styles.containerTextCadastro1}>
          <TextInput
            style={styles.campoCadastro2}
            mode="outlined"
            label="Usuário"
            activeOutlineColor="#018015"
            onChangeText={setUsuario}
          />
          <TextInput
            style={styles.campoCadastro2}
            mode="outlined"
            label="Email"
            activeOutlineColor="#018015"
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.campoCadastro2}
            mode="outlined"
            label="Senha"
            secureTextEntry
            activeOutlineColor="#018015"
            onChangeText={setSenha}
          />
        </View>
        <View style={styles.containerButton}>
          <Button
            style={styles.botao}
            mode="contained"
            buttonColor="#5CE95E"
            onPress={() => Cadastrar()}>
            Cadastrar
          </Button>
        </View>
        <View style={styles.textoRodape}>
          <TouchableOpacity onPress={navegarLogin}>
            <Text>
              Já possui conta? <Text style={styles.textoPress}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
        <Portal>
          <Dialog visible={visible}>
            <Dialog.Content>
              <Text>Esse email já está cadastrado.</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button textColor="#018015" onPress={hideDialog}>Ok</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <Portal>
          <Dialog visible={visible3}>
            <Dialog.Content>
              <Text>Esse usuário já está cadastrado.</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button textColor="#018015" onPress={hideDialog3}>Ok</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <Portal>
          <Dialog visible={visible4}>
            <Dialog.Content>
              <Text>A senha deve ter ao menos 6 caracteres.</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button textColor="#018015" onPress={hideDialog4}>Ok</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <Portal>
          <Dialog visible={visible5}>
            <Dialog.Content>
              <Text>O usuário deve ter ao menos 3 caracteres.</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button textColor="#018015" onPress={hideDialog5}>Ok</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <Portal>
          <Dialog visible={visible1}>
            <Dialog.Content>
              <Text>Usuário cadastrado com sucesso.</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button textColor="#018015" onPress={hideDialog1}>Ok</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <Portal>
          <Dialog visible={visible2}>
            <Dialog.Content>
              <Text>Erro ao cadastrar usuário.</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button textColor="#018015" onPress={hideDialog2}>Ok</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </Provider>
  );
}

const taskRoute = () => {
  const [visible, setVisible] = React.useState(false);
  const [tarefa, setTarefa] = React.useState('');
  const [date, setDate] = React.useState('');
  const [descricao, setDescricao] = React.useState('');
  const [dados, setDados] = React.useState([]);
  const [visible1, setVisible1] = React.useState(false);
  const [visible2, setVisible2] = React.useState(false);
  const hideDialog = () => setVisible1(false);
  const hideDialog2 = () => setVisible2(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const criarTarefa = async () => {
    if (tarefa === '' || date === '' || descricao === '') {
      setVisible1(true);
      return null;
    }
    try {
      const response = await axios.post(
        '/tasks',
        {
          data: {
            Titulo: tarefa.toString(),
            Data: date.toString(),
            Detalhes: descricao.toString(),
            Concluido: false,
            Owner: userId.toString(),
          },
        },
        {
          headers: {Authorization: `Bearer ${userToken}`},
        },
      );
      hideModal();
      getTasks();
    } catch (error) {
      setVisible2(true);
    }
  };

  const getTasks = async () => {
    try {
      const response = await axios.get('/tasks', {
        headers: {Authorization: `Bearer ${userToken}`},
      });
      setDados(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const concluirTask = async (itemid) => {
    try {
      const response = await axios.put(
        `/tasks/${itemid}`,
        {
          data: {
            Concluido: true,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        },
      );
      getTasks();
    } catch (error) {
      console.error('Error updating resource:', error);
    }
  };

  const desmarcarTask = async (itemid) => {
    try {
      const response = await axios.put(
        `/tasks/${itemid}`,
        {
          data: {
            Concluido: false,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        },
      );
      getTasks();
    } catch (error) {
      console.error('Error updating resource:', error);
    }
  };

  const deletarTask = async(itemid) => {
    try {
      const response = await axios.delete(`/tasks/${itemid}`, {
        headers: {Authorization: `Bearer ${userToken}`},
      });
      getTasks();
    } catch (error) {
      console.log(error.response.data);
    }
  };

  React.useEffect(() => {
    getTasks();
  }, []);

  return (
    <Provider>
      <View style={styles.containerHome}>
        <ScrollView style={{backgroundColor: '#fcffff'}}>
          <Text style={styles.textTask}>Em andamento: </Text>
          {dados &&
            dados
              .filter(
                task =>
                  task.attributes.Owner === userId.toString() &&
                  task.attributes.Concluido === false,
              )
              .map(item => (
                <Card key={item.id} style={styles.taskCard}>
                  <Surface style={styles.taskSurface}>
                    <IconButton
                      icon={require('./assets/checkbox-blank-outline.png')}
                      iconColor={'#fcffff'}
                      size={20}
                      onPress={() => concluirTask(item.id)}
                    />
                    <Text style={styles.cardText}>
                      {item.attributes.Titulo}
                    </Text>
                  </Surface>
                  <ScrollView>
                    <Text> Prazo: {item.attributes.Data}</Text>
                    <Text> Detalhes: </Text>
                    <Text style={{margin: (screenHeight * 0.5) / 100}}>
                      {item.attributes.Detalhes}
                    </Text>
                    <IconButton
                      icon={require('./assets/delete.png')}
                      style={{marginTop: (screenHeight * 6) / 100}}
                      iconColor={'#757575'}
                      size={22}
                      onPress={() => deletarTask(item.id)}
                    />
                  </ScrollView>
                </Card>
              ))}
          <Text style={styles.textTask}>Concluídas: </Text>
          {dados
            .filter(
              task =>
                task.attributes.Owner === userId.toString() &&
                task.attributes.Concluido === true,
            )
            .map(item => (
              <Card key={item.id} style={styles.taskCard}>
                <Surface style={styles.taskSurface}>
                  <IconButton
                    icon={require('./assets/checkbox-marked-outline.png')}
                    iconColor={'#fcffff'}
                    size={20}
                    onPress={() => desmarcarTask(item.id)}
                  />
                  <Text style={styles.cardText}>{item.attributes.Titulo}</Text>
                </Surface>
                <ScrollView>
                  <Text> Prazo: {item.attributes.Data}</Text>
                  <Text> Detalhes: </Text>
                  <Text style={{margin: (screenHeight * 0.5) / 100}}>
                    {item.attributes.Detalhes}
                  </Text>
                  <IconButton
                    icon={require('./assets/delete.png')}
                    style={{marginTop: (screenHeight * 6) / 100}}
                    iconColor={'#757575'}
                    size={22}
                    onPress={() => deletarTask(item.id)}
                  />
                </ScrollView>
              </Card>
            ))}
        </ScrollView>
        <Portal>
          <Dialog visible={visible1}>
            <Dialog.Content>
              <Text>Campos não preenchidos.</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button textColor="#018015" onPress={hideDialog}>Ok</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <Portal>
          <Dialog visible={visible2}>
            <Dialog.Content>
              <Text>Erro ao criar tarefa.</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button textColor="#018015" onPress={hideDialog2}>Ok</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <Portal>
          <Modal visible={visible} onDismiss={hideModal}>
            <View>
              <Card style={styles.modalCard}>
                <Card.Content>
                  <TextInput
                    mode="outlined"
                    label="Título"
                    maxLength={18}
                    activeOutlineColor="#018015"
                    style={styles.modalTextInput}
                    onChangeText={setTarefa}
                  />
                  <TextInput
                    mode="outlined"
                    label="Data"
                    placeholder="DD/MM/YYYY"
                    maxLength={10}
                    activeOutlineColor="#018015"
                    style={styles.modalTextInput}
                    onChangeText={setDate}
                  />
                  <TextInput
                    mode="outlined"
                    placeholder="Detalhes"
                    multiline
                    activeOutlineColor="#018015"
                    style={styles.modalTextInput1}
                    onChangeText={setDescricao}
                  />
                </Card.Content>
                <Card.Actions>
                  <Button
                    mode="contained"
                    style={styles.modalButton}
                    onPress={criarTarefa}>
                    {' '}
                    Criar tarefa{' '}
                  </Button>
                </Card.Actions>
              </Card>
            </View>
          </Modal>
        </Portal>
        <FAB
          icon={require('./assets/plus.png')}
          color="#f3f9f5"
          style={styles.botaoHome}
          onPress={() => showModal()}
        />
      </View>
    </Provider>
  );
};

const configRoute = ({navigation, route}) => {
  navigation = useNavigation();

  const navegarConfig = () => {
    navigation.navigate('ConfigConta');
  };

  const sairConta = () => {
    userLoggedUsername = '';
    userToken = '';
    navigation.navigate('Login');
  };

  return (
    <View style={styles.containerHome}>
      <TouchableOpacity onPress={navegarConfig}>
        <Text style={styles.configText}> Conta </Text>
      </TouchableOpacity>
      <Divider />
      <TouchableOpacity onPress={sairConta}>
        <Text style={styles.configText}> Sair </Text>
      </TouchableOpacity>
    </View>
  );
};

const Home = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: 'task',
      title: 'Tarefas',
      focusedIcon: require('./assets/clipboard-text.png'),
      unfocusedIcon: require('./assets/clipboard-text-outline.png'),
      backgroundColor: '#018015',
    },
    {
      key: 'config',
      title: 'Configurações',
      focusedIcon: require('./assets/cog.png'),
      unfocusedIcon: require('./assets/cog-outline.png'),
      backgroundColor: '#018015',
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    task: taskRoute,
    config: configRoute,
  });

  return (
    <SafeAreaProvider>
      <BottomNavigation
        navigationState={{index, routes}}
        onIndexChange={setIndex}
        renderScene={renderScene}
        barStyle={{backgroundColor: '#35EC2D'}}
        theme={{colors: {secondaryContainer: '#8EFF30'}}}
        activeColor="#f3f9f5"
        inactiveColor="#323332"
      />
    </SafeAreaProvider>
  );
};

const ConfigConta = ({navigation, route}) => {
  const [visible, setVisible] = React.useState(false);
  const hideDialog = () => setVisible(false);
  const showDialog = () => setVisible(true);

  const deletarConta = async() => {
    try {
      const response = await axios.delete(`/users/${userId}`, {
        headers: {Authorization: `Bearer ${userToken}`},
      });
      navigation.navigate('Login');
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <Provider>
      <View style={styles.containerHome}>
        <Surface
          mode="flat"
          style={styles.surfaceConfig}
          elevation={1}
          children={undefined}
        />
        <Avatar.Image
          size={130}
          source={require('./assets/perfil.png')}
          style={styles.avatarConfig}
        />
        <Text style={styles.textoTituloConfig}>{userLoggedUsername}</Text>
        <View style={styles.containerButton}>
          <Button
            icon={require('./assets/delete.png')}
            mode="contained"
            textColor="#FE0F00"
            buttonColor="#FED0C2"
            style={styles.botaoDelete}
            onPress={showDialog}>
            Deletar Conta
          </Button>
        </View>
        <Portal>
          <Dialog visible={visible}>
            <Dialog.Content>
              <Text>Realmente deseja deletar a conta?</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button textColor="#018015" onPress={hideDialog}>
                Não
              </Button>
              <Button textColor="#018015" onPress={deletarConta}>
                Sim
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  containerSplashScreen: {
    backgroundColor: '#f3f9f5',
  },

  containerLoginCadastro: {
    flex: 1,
    backgroundColor: '#fcffff',
  },

  containerHome: {
    flex: 1,
    backgroundColor: '#fcffff',
  },

  imagemLogin: {
    width: (screenWidth * 60) / 100,
    height: (screenHeight * 30) / 100,
    marginTop: (screenHeight * 5) / 100,
    alignSelf: 'center',
  },

  imagemLogo: {
    width: (screenWidth * 60) / 100,
    height: (screenHeight * 30) / 100,
    marginTop: (screenHeight * 25) / 100,
    alignSelf: 'center',
  },

  containerTextLogin: {
    marginTop: (screenHeight * 5) / 100,
  },

  containerTextCadastro1: {
    marginTop: (screenHeight * 3) / 100,
  },

  containerTextCadastro2: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },

  containerButton: {
    marginTop: (screenHeight * 2) / 100,
    marginLeft: (screenWidth * 3.2) / 100,
    alignItems: 'center',
    justifyContent: 'center',
  },

  campoLogin: {
    height: (screenHeight * 6) / 100,
    width: (screenWidth * 77) / 100,
    alignSelf: 'center',
    marginBottom: (screenHeight * 2) / 100,
  },

  campoCadastro1: {
    height: (screenHeight * 6) / 100,
    width: (screenWidth * 38) / 100,
    marginBottom: (screenHeight * 2) / 100,
  },

  campoCadastro2: {
    height: (screenHeight * 6) / 100,
    width: (screenWidth * 84) / 100,
    alignSelf: 'center',
    marginBottom: (screenHeight * 2) / 100,
  },

  textoRodape: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    marginTop: (screenHeight * 4) / 100,
  },

  textoTitulo: {
    fontSize: 30,
    color: '#1A1A1A',
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: (screenHeight * 15) / 100,
  },

  textoPress: {
    color: '#5CE95E',
  },

  botao: {
    height: (screenHeight * 6) / 100,
    width: (screenWidth * 77) / 100,
    marginRight: (screenWidth * 3) / 100,
    marginTop: (screenHeight * 2) / 100,
  },

  botaoHome: {
    height: (screenWidth * 15) / 100,
    width: (screenWidth * 15) / 100,
    position: 'absolute',
    backgroundColor: '#5CE95E',
    marginLeft: (screenWidth * 80) / 100,
    marginTop: (screenHeight * 63) / 100,
  },

  textTask: {
    color: '#1A1A1A',
    fontSize: 20,
    marginTop: (screenHeight * 2) / 100,
    marginLeft: (screenWidth * 10) / 100,
  },

  taskCard: {
    marginTop: (screenHeight * 4) / 100,
    height: (screenHeight * 30) / 100,
    width: (screenWidth * 80) / 100,
    alignSelf: 'center',
  },

  taskSurface: {
    height: (screenHeight * 8) / 100,
    backgroundColor: '#349C08',
    flexDirection: 'row',
  },

  cardText: {
    fontSize: 18,
    color: '#fcffff',
    fontWeight: 'bold',
    marginTop: (screenHeight * 1.7) / 100,
  },

  modalCard: {
    height: (screenHeight * 70) / 100,
    width: (screenWidth * 90) / 100,
    alignSelf: 'center',
  },

  modalTextInput: {
    height: (screenHeight * 6) / 100,
    width: (screenWidth * 80) / 100,
    marginTop: (screenHeight * 3) / 100,
    alignSelf: 'center',
  },

  modalTextInput1: {
    height: (screenHeight * 30) / 100,
    width: (screenWidth * 80) / 100,
    marginTop: (screenHeight * 3) / 100,
    alignSelf: 'center',
  },

  modalButton: {
    width: (screenWidth * 50) / 100,
    marginTop: (screenHeight * 3) / 100,
    marginRight: (screenWidth * 2) / 100,
    backgroundColor: '#5CE95E',
  },

  surfaceBanner: {
    height: (screenHeight * 10) / 100,
    backgroundColor: '#349C08',
  },

  avatarBanner: {
    marginTop: (screenHeight * 1) / 100,
    marginLeft: (screenWidth * 3) / 100,
  },

  configText: {
    fontSize: 20,
    margin: (screenHeight * 3) / 100,
  },

  avatarConfig: {
    alignSelf: 'center',
    marginTop: (screenHeight * 6) / 100,
    position: 'absolute',
    borderWidth: 0.8,
    borderColor: '#000000',
    overflow: 'hidden',
    borderRadius: 100,
  },

  textoTituloConfig: {
    fontSize: 26,
    marginTop: (screenHeight * 1.4) / 100,
    alignSelf: 'center',
  },

  surfaceConfig: {
    height: (screenHeight * 17) / 100,
    backgroundColor: '#349C08',
    marginBottom: (screenHeight * 10) / 100,
  },

  botaoDelete: {
    height: (screenHeight * 6) / 100,
    width: (screenWidth * 55) / 100,
    marginRight: (screenWidth * 3) / 100,
    marginTop: (screenHeight * 40) / 100,
  },
});

export default App;
