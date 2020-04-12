import React, { Component } from 'react';
import { List, Drawer, InputItem, Picker, Provider, Button, Flex, Grid, WingBlank, Modal, WhiteSpace } from '@ant-design/react-native';
import { Text, ART, ScrollView, Dimensions, View, StatusBar, Image, StyleSheet, TouchableNativeFeedback, BackHandler, ToastAndroid } from 'react-native';
import { IconOutline } from "@ant-design/icons-react-native";
import TcpSocket from 'react-native-tcp-socket';
import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';

const { Surface, Shape, Path, } = ART;

var baseImg;
//var baseImg='data:image/png;base64,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'

function str2utf8(str) {
  return eval('\'' + encodeURI(str).replace(/%/gm, '\\x') + '\'');
}

function bytesToBase64(bytes) {
  var bString = "";
  for (var i = 0, len = bytes.length; i < len; ++i) {
    bString += String.fromCharCode(bytes[i]);
  }
  console.log(bString);
  //return btoa(bString);
}

const storage = new Storage({
  // 最大容量，默认值1000条数据循环存储
  size: 1000,

  // 存储引擎：对于RN使用AsyncStorage，对于web使用window.localStorage
  // 如果不指定则数据只会保存在内存中，重启后即丢失
  storageBackend: AsyncStorage,

  // 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
  defaultExpires: null,

  // 读写时在内存中缓存数据。默认启用。
  enableCache: true, // 你可以在构造函数这里就写好sync的方法 // 或是在任何时候，直接对storage.sync进行赋值修改 // 或是写到另一个文件里，这里require引入

  // 如果storage中没有相应数据，或数据已过期，
  // 则会调用相应的sync方法，无缝返回最新数据。
  // sync方法的具体说明会在后文提到
  //sync: require('你可以另外写一个文件专门处理sync'),
});

var client;

var test = {};
var line = {};

function testAddOrModify(key, value) {
  test[key] = value;
}

function testDelete(key) {
  delete test[key];
}

function lineAdd(key, value) {
  if (line[key]) {
    line[key] = line[key] + "," + value;
  } else {
    line[key] = value;
  }

}

function lindModify(key, value) {
  line[key] = value;
}

function lineDelete(key) {
  delete line[key];
}

function lineConsole(key) {
  var strs = new Array();
  strs = line[key].split(",");
  for (var i = 0; i < strs.length; i++) {
    console.log(test[strs[i]] + "++"); //分割后的字符输出
  }
}

const speeds = [
  [
    {
      label: '低速',
      value: 'Low',
    },
    {
      label: '中速',
      value: 'Mid',
    },
    {
      label: '高速',
      value: 'High',
    },
  ],
];

function buildMap() {
  ToastAndroid.show('开始建图', ToastAndroid.SHORT);
}

function buttomToast() {
  ToastAndroid.show('任务按钮', ToastAndroid.SHORT);
}

var firstClick = 0;
export default class App extends Component {
  constructor(props) {
    super(props);

    this.onConnectClose = () => {
      this.setState({
        connectvisible: false,
      });
    }

    this.onClose1 = () => {
      this.setState({
        visible1: false,
      });
    };

    this.onClose2 = () => {
      this.setState({
        visible2: false,
      });
    };

    this.menuSelect = (index) => {
      this.setState({
        mapselectindex: index,
      });
      setTimeout(() => {
        this.drawer.closeDrawer();
      }, 200);

    }

    this.AddMenu = (v) => {
      if (v !== '') {
        var tempData = this.state.mapsname;
        tempData.push(v);
        this.setState({
          mapsname: tempData
        })
      }
    }

    this.deleteMunu = (index) => {
      var tempData = this.state.mapsname;
      tempData.splice(index, 1);
      this.setState({
        mapsname: tempData,
        mapselectindex: 0
      })
    }

    this.modifyMenu = (index, name) => {
      var tempData = this.state.mapsname;
      tempData.splice(index, 1, name);
      this.setState({
        mapsname: tempData
      })
    }

    this.onButtonClick2 = (index, value) => {
      Modal.operation([
        { text: '编辑地图名称', onPress: () => this.onButtonClick3(index, value) },
        { text: '删除地图', onPress: () => this.deleteMunu(index) },
      ]);
    };

    this.onButtonClick3 = (index, value) => {
      Modal.prompt(
        '地图名称',
        '请输入更改地图名称',
        [{
          text: '取消',
          //onPress: () => console.log('cancel'),
          style: 'cancel',
        },
        { text: '确定', onPress: (v) => this.modifyMenu(index, v) }],
        'default',
        value,
        ['请输入更改地图名称'],
      );
    };

    this.onButtonClick5 = () => {
      Modal.prompt(
        '地图名称',
        '请输入新增地图名称',
        [{
          text: '取消',
          //onPress: () => console.log('cancel'),
          style: 'cancel',
        },
        { text: '确定', onPress: (v) => this.AddMenu(v) }],
        'default',
        null,
        ['请输入新增地图名称'],
      );
    };

    this.onOpenChange = isOpen => {
      /* tslint:disable: no-console */
      //console.log('是否打开了 Drawer', isOpen.toString());
    };

    this.state = {
      connectvisible: true,
      visible1: false,
      visible2: false,
      forward: false,
      back: false,
      left: false,
      right: false,
      speedValue: ['Low'],
      name: 'ABB-001',
      socketString: '192.168.11.105:11111',
      rundistance: -1,
      power: -1,
      runtime: 0,
      mapsname: ['默认地图', 'F18-3F', 'G10-1.5F', 'E104F'],
      mapselectindex: 0
    };

    this.handleBack = this.handleBack.bind(this);
  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBack);
    //Toast.loading("ABB连接中...", 0); 
    this.socketStart();
    this.GetFromStorage();
    this.timer = setInterval(() => {
      this.setState({ runtime: this.state.runtime + 1 })
    }, 60000)

  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
    client.destroy();
    this.SaveToStorage();
    clearInterval(this.timer);
  }

  handleBack = () => {
    var timestamp = (new Date()).valueOf();
    if (timestamp - firstClick > 2000) {
      firstClick = timestamp;
      ToastAndroid.show('再按一次退出', ToastAndroid.SHORT);
      this.SaveToStorage();
      return true;
    } else {
      return false;
    }
  }

  GetFromStorage = () => {
    // 读取
    storage
      .load({
        key: 'userdatas',

        // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
        autoSync: true, // 设置为false的话，则等待sync方法提供的最新数据(当然会需要更多时间)。

        // syncInBackground(默认为true)意味着如果数据过期，
        // 在调用sync方法的同时先返回已经过期的数据。
        syncInBackground: true,
        // 你还可以给sync方法传递额外的参数
        syncParams: {
          extraFetchOptions: {
            // 各种参数
          },
          someFlag: true,
        },
      })
      .then(ret => {
        // 如果找到数据，则在then方法中返回
        // 注意：这是异步返回的结果（不了解异步请自行搜索学习）
        // 你只能在then这个方法内继续处理ret数据
        // 而不能在then以外处理
        // 也没有办法“变成”同步返回
        // 你也可以使用“看似”同步的async/await语法

        //console.log(ret);
        this.setState({
          speedValue: ret.speedValue,
          name: ret.name,
          socketString: ret.socketString,
        });
      })
      .catch(err => {
        //如果没有找到数据且没有sync方法，
        //或者有其他异常，则在catch中返回
        //console.warn(err.message);
        switch (err.name) {
          case 'NotFoundError':
            // TODO;
            break;
          case 'ExpiredError':
            // TODO
            break;
        }
      });
  }

  SaveToStorage = () => {
    // 使用key来保存数据（key-only）。这些数据一般是全局独有的，需要谨慎单独处理的数据
    // 批量数据请使用key和id来保存(key-id)，具体请往后看
    // 除非你手动移除，这些数据会被永久保存，而且默认不会过期。
    storage.save({
      key: 'userdatas', // 注意:请不要在key中使用_下划线符号!
      data: {
        speedValue: this.state.speedValue,
        name: this.state.name,
        socketString: this.state.socketString,
      },

      // 如果不指定过期时间，则会使用defaultExpires参数
      // 如果设为null，则永不过期
      expires: null,
    });
  }

  testPointAndLine = () => {
    testAddOrModify('3', 'Point(3,3,3)');
    testAddOrModify('1', 'Point(1,1,1)');
    testAddOrModify('2', 'Point(2,2,2)');
    testAddOrModify('3', 'Point(5,5,5)');

    lineAdd('计划路线', '1')
    lineAdd('计划路线', '2')
    lineAdd('计划路线', '1')
    lineAdd('计划路线', '3')

    lineAdd('计划路线2', '3')
    lineAdd('计划路线2', '2')
    lineAdd('计划路线2', '3')
    lineAdd('计划路线2', '2')

    //lineConsole('计划路线')
    //lineConsole('计划路线2')

    //console.log(test);
    //console.log(line);
  }

  socketStart = () => {
    var options = {
      host: this.state.socketString.substring(0, this.state.socketString.indexOf(":")),
      port: this.state.socketString.substring(this.state.socketString.indexOf(":") + 1),
    }
    //console.log(options);
    // Create socket
    client = TcpSocket.createConnection(options);

    client.on('data', (data) => {
      data2 = str2utf8(data);
      this.setState({
        connectvisible: false,
      })
      //var tempString = "ABB#ReturnBattery#88*";
      if (data2.indexOf('ReturnBattery') > -1) {
        var tempPower = data2.substring(data2.lastIndexOf('#') + 1, data2.lastIndexOf('*'));
        //console.log(tempPower + "%");
        this.setState({
          power: tempPower
        })
      }

      //解析图片
      if (data2.indexOf('PNG') > -1) {
        bytesToBase64(data2);
        bytesToBase64(data);
        this.setState({
          connectvisible: false
        })
      }

      console.log(data2);
    });

    client.on('error', (error) => {
      this.setState({
        connectvisible: true,
      })
      console.log(error);
    })

    client.on('close', () => {
      this.setState({
        connectvisible: true,
      })
      console.log('Connection closed!');
    });

  }

  ForwardIn = () => {
    this.setState({
      forward: true,
    });
    client.write("ABB#SetControlMode#Forward*");
    //console.log('Forward In');
    this.Forward();
  }

  Forward = () => {
    if (this.state.forward) {
      client.write("ABB#SetControlMode#Forward*");
      //console.log('Forward running');
      setTimeout(() => {
        this.Forward();
      }, 100);
    }
  }

  ForwardOut = () => {
    this.setState({
      forward: false,
    });
    //console.log('Forward Out');
  }

  LeftIn = () => {
    this.setState({
      left: true,
    });
    client.write("ABB#SetControlMode#Left*");
    //console.log('Left In');
    this.Left();
  }

  Left = () => {
    if (this.state.left) {
      client.write("ABB#SetControlMode#Left*");
      //console.log('Left running');
      setTimeout(() => {
        this.Left();
      }, 100);
    }
  }

  LeftOut = () => {
    this.setState({
      left: false,
    });
    //console.log('Left Out');
  }

  RightIn = () => {
    this.setState({
      right: true,
    });
    client.write("ABB#SetControlMode#Right*");
    //console.log('Right In');
    this.Right();
  }

  Right = () => {
    if (this.state.right) {
      client.write("ABB#SetControlMode#Right*");
      //console.log('Right running');
      setTimeout(() => {
        this.Right();
      }, 100);
    }
  }

  RightOut = () => {
    this.setState({
      right: false,
    });
    //console.log('Right Out');
  }

  BackIn = () => {
    this.setState({
      back: true,
    });
    client.write("ABB#SetControlMode#Back*");
    console.log('Back In');
    this.Back();
  }

  Back = () => {
    if (this.state.back) {
      client.write("ABB#SetControlMode#Back*");
      //console.log('Back running');
      setTimeout(() => {
        this.Back();
      }, 100);
    }
  }

  BackOut = () => {
    this.setState({
      back: false,
    });
    //console.log('Back Out');
  }

  Charge = () => {
    ToastAndroid.show('开始自动回充', ToastAndroid.SHORT);
    this.setState({
      connectvisible: false
    })
    baseImg = 'data:image/jpeg;base64,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AFFFLQAUUUUAFFFLQAlLRRQAUUtJQAUUUtIAooooAKKKKACiiigAooooAKKKKAFooooGFFFFAiOilpKYwoopaBCUUtFACUUUUAFFFFABSUtFACUUtFACUUtFACUUtFACUUtFACUUUtACUUUUwCilopAJS0UUAFAoooASilooASilooAVp0tbG4lcAg7U57EnrXMzLHBKVltfcMXJDe+a3dXJXQ5SBkmdOPXANQWUMc+nwfafnQL8qJ19Tya5Zq8mdcHaKM+3aBYvPaBEijbIbJyW9BWnrF2l7PBE0cSS+SskYk5VtwBx7Gsm9V3jZn2KicoEPylO22n+IVxc2ef4rOLt7VkaldppkkKG0gV1O0r5fINb+ivcxXIhkSPEykS7VxtO0lR7mqC3EVtIsFw+6bbhbgr80I9CP84rStUNvfWyQFmi81S5PIwe4PeqSvcluxJ2paUjDEehxSV2nCFFLRQAlFLRQAUUUUAFFLRQAUUUUAFFFLQAUUUUAFFFLSASilooASiiloASloooASilpKACiiigApaKWgBKKWigBmKSnEUlMBKKWkoAKKKKACiiigAooooASilooASiiloASilooAKSiloASilpKACiiimAUUUUgCilooASloooAKKKKACiiigAooooALy2WfR3LgsqS7tg43nGAM/jWTcb54UVI412qNxLY59B6CrusytFbWQ4KEyM6noRkDmqkFuI1U2kIkjbBIfB8skZ5PpXI/iZ2RXuoht7RpFFpIsZR3xgPkr05FbGvaaIPs9ysimWOFYQX6Lt/irEnlijSeKDO+QndIgxkk9B6LWr4huDbvbSIcGOWa3PuBtOPpzWRqYsNnbyXO+a5iYYBwGyWPvWzpk0Ed4sTzJ9mJyV6BG7EHtyOnvVCCMTzmTTwFlx88WcADuwPceo7VYlKGGQyBkQKSm4cMfX/AfjWiV1ZGb01NS4Xbcyqezn+dR1Pdndcs3ZwrfmAahrqi7pHJLRsSiloqiQooooAKKKKACilooASloooAKKKWgQlFLRSGFFFFABRRRQAUUUUAFFFLQAlFLRQAlFGKWgAoopaAEopaKBjaSlooENopaSmAUUUUAFFFFACUUtJQAUUUtACUUtFACUUtFACUUtFACUUtFACUUUtACUUUtACUUtFACUUtFABRRRQAUYoooAKKKDQBS1+E3KWkIO0JEX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'

    client.write("ABB#ReturnCharging*");
  }

  Safe = () => {
    ToastAndroid.show('暂不支持消毒功能', ToastAndroid.SHORT);
  }

  Close = () => {
    ToastAndroid.show('暂不支持关闭功能', ToastAndroid.SHORT);
  }

  Sound = () => {
    ToastAndroid.show('暂不支持音量功能', ToastAndroid.SHORT);
  }

  Speed = (v) => {
    this.setState({
      speedValue: v
    })
    client.write("ABB#SetSpeedMode#" + v[0] + "*");
    //console.log("ABB#SetSpeedMode#" + v[0] + "*");
  }

  IP = (v) => {
    this.setState({
      socketString: v
    })
    //console.log(v);
  }

  Name = (v) => {
    this.setState({
      name: v
    })
    //console.log(v);
  }

  render() {
    const path = ART.Path();
    if (this.state.mapselectindex === 0) {
      path.moveTo(1, 1); //将起始点移动到(1,1) 默认(0,0)
      path.lineTo(300, 300); //连线到目标点(300,1)
    }
    else if (this.state.mapselectindex === 1) {
      path.moveTo(1, 1); //将起始点移动到(1,1) 默认(0,0)
      path.lineTo(300, 300); //连线到目标点(300,1)
      path.lineTo(1, 300); //连线到目标点(300,1)
      path.lineTo(300, 1); //连线到目标点(300,1)
      path.close();
    } else {
      path.moveTo(150, 1)
        .arc(0, 149, 25)
        .arc(0, -99, 25)
        .close();
    }

    const itemArr = this.state.mapsname
      .map((value, index) => {
        if (index === this.state.mapselectindex) {
          return (
            <View key={index} >
              <WhiteSpace size="lg" />
              <WingBlank>
                <Button onLongPress={() => this.onButtonClick2(index, value)} type="primary"
                  style={{ backgroundColor: "#684ecd", borderColor: "#684ecd" }}
                  activeStyle={{ backgroundColor: '#877abb' }}>
                  {value}
                </Button>
              </WingBlank>
            </View>
          );
        }
        return (
          <View key={index}>
            <WhiteSpace size="lg" />
            <WingBlank>
              <Button onPress={() => this.menuSelect(index)}
                onLongPress={() => this.onButtonClick2(index, value)}>
                {value}
              </Button>
            </WingBlank>
          </View>
        );
      });
    const sidebar = (
      <View style={{ height: "100%" }}>
        <Flex style={{ backgroundColor: "#684ecd", height: 50 }}>
          <Flex.Item></Flex.Item>
          <Flex.Item >
            <Text style={{ color: "white", textAlign: "center", fontWeight: "bold", fontSize: 18 }}>地图选择</Text>
          </Flex.Item>
          <Flex.Item ></Flex.Item>
        </Flex>

        <ScrollView >
          <View style={{ height: "100%" }}>

            {itemArr}
            <WhiteSpace size="lg" />
            <WingBlank>
              <Button onPress={this.onButtonClick5}>
                新增地图
              </Button>
            </WingBlank>
          </View>
          <WhiteSpace size="lg" />
        </ScrollView>
      </View>
    );
    const data = [
      {
        icon: <TouchableNativeFeedback onPress={buttomToast}>
          <Image source={require('./Images/task2.png')} style={{ width: "50%", height: "50%" }} />
        </TouchableNativeFeedback>,
        text: <Text style={{ color: "#684ecd", fontWeight: "bold", fontSize: 12 }}>任务</Text>
      },
      {
        icon: <TouchableNativeFeedback onPress={() => this.setState({ visible2: true })}>
          <Image source={require('./Images/auto.png')} style={{ width: "50%", height: "50%" }} />
        </TouchableNativeFeedback>,
        text: <Text style={{ color: "#684ecd", fontWeight: "bold", fontSize: 12 }}>自动</Text>
      },
      {
        icon: <TouchableNativeFeedback onPress={this.Charge}>
          <Image source={require('./Images/charge.png')} style={{ width: "50%", height: "50%" }} />
        </TouchableNativeFeedback>,
        text: <Text style={{ color: "#684ecd", fontWeight: "bold", fontSize: 12 }}>充电</Text>
      },
      {
        icon: <TouchableNativeFeedback onPress={this.Safe}>
          <Image source={require('./Images/safe2.png')} style={{ width: "50%", height: "50%" }} />
        </TouchableNativeFeedback>,
        text: <Text style={{ color: "#684ecd", fontWeight: "bold", fontSize: 12 }}>消毒</Text>
      }
    ]
    return (

      <View style={{ backgroundColor: "#684ecd", height: "100%" }}>
        <Provider>
          <StatusBar backgroundColor="#684ecd" barStyle="light-content" />
          <Drawer
            sidebar={sidebar}
            position="left"
            open={false}
            drawerRef={el => (this.drawer = el)}
            onOpenChange={this.onOpenChange}
            drawerBackgroundColor="#ccc"
            drawerWidth={250}
          >
            <WingBlank style={{ marginBottom: 5 }}>
              <Flex>
                <Flex.Item>
                  <IconOutline onPress={() => this.drawer && this.drawer.openDrawer()} name="menu" style={{ position: "absolute", left: 4, color: "#ffffff", fontSize: 28 }} />
                </Flex.Item>
                <Flex.Item style={{ paddingTop: 5 }}>
                  <Text style={{ color: "white", textAlign: "center", fontWeight: "bold", fontSize: 18 }}>ABB({this.state.connectvisible ? "未连接" : "已连接"})</Text>
                </Flex.Item>
                <Flex.Item>
                  <IconOutline onPress={() => this.setState({ visible1: true })} name="setting" style={{ position: "absolute", right: 4, color: "#ffffff", fontSize: 28 }} />
                </Flex.Item>
              </Flex>
            </WingBlank>

            <Modal
              title="ABB连接失败"
              transparent
              onClose={this.onConnectClose}
              visible={this.state.connectvisible}
              maskClosable
            >
              <View style={{ height: 130 }}>
                <Flex direction="column">
                  <Flex.Item style={{ backgroundColor: "red" }}>
                    <Image source={require('./Images/nowifi.png')} />
                  </Flex.Item>
                </Flex>

              </View>
              <Text style={{ textAlign: "center" }}>{this.state.socketString}</Text>
              <Button onPress={this.socketStart} type="primary" style={{ backgroundColor: "#684ecd", borderColor: "#684ecd" }} activeStyle={{ backgroundColor: '#877abb' }}>
                点击重连
          </Button>
            </Modal>

            <Modal
              transparent={false}
              visible={this.state.visible1}
              animationType="slide-up"
              onClose={this.onClose1}
            >

              <Flex style={{ backgroundColor: "#684ecd", height: 50 }}>
                <Flex.Item>
                  <IconOutline onPress={this.onClose1} name="left" style={{ position: "absolute", left: 18, top: -12, color: "#ffffff", fontSize: 28 }} />
                </Flex.Item>
                <Flex.Item >
                  <Text style={{ color: "white", textAlign: "center", fontWeight: "bold", fontSize: 18 }}>设置</Text>
                </Flex.Item>
                <Flex.Item >
                </Flex.Item>
              </Flex>

              <View style={{ height: "100%" }}>
                <WhiteSpace size="lg" />

                <List>
                  <InputItem
                    clear
                    value={this.state.name}
                    onChange={v => this.Name(v)}
                    placeholder="请输入ABB名称"
                  >
                    名称
          </InputItem>
                  <InputItem
                    clear
                    type="number"
                    value={this.state.socketString}
                    onChange={v => this.IP(v)}
                    placeholder="请输入IP"
                  >
                    IP
          </InputItem>

                  <Picker
                    data={speeds}
                    title="选择速度"
                    cascade={false}
                    extra="请选择"
                    value={this.state.speedValue}
                    onChange={v => this.Speed(v)}
                  >
                    <List.Item arrow="horizontal">速度</List.Item>
                  </Picker>

                  <InputItem
                    clear
                    value="更多帮助请查看说明文档"
                    onChange={value => {
                      this.setState({
                        value,
                      });
                    }}
                    placeholder="更多帮助请查看说明文档"
                    editable={false}
                  >
                    帮助
          </InputItem>
                </List>

              </View>

            </Modal>

            <Modal
              popup
              visible={this.state.visible2}
              animationType="slide-up"
              onClose={this.onClose2}
            >
              <View style={{ height: 200, padding: 15 }}>
                <Flex>
                  <Flex.Item>
                  </Flex.Item>
                  <Flex.Item >
                    <Button onPressIn={this.ForwardIn} onPressOut={this.ForwardOut} style={{ width: "100%", height: 60, backgroundColor: "#684ecd", borderColor: "#684ecd" }} activeStyle={{ backgroundColor: '#877abb' }} >
                      <IconOutline name="caret-up" style={{ color: "#ffffff", fontSize: 80 }} />
                    </Button>
                  </Flex.Item>
                  <Flex.Item >
                  </Flex.Item>
                </Flex>
                <Flex>
                  <Flex.Item>
                    <Button onPressIn={this.LeftIn} onPressOut={this.LeftOut} style={{ width: "100%", height: 60, backgroundColor: "#684ecd", borderColor: "#684ecd" }} activeStyle={{ backgroundColor: '#877abb' }} >
                      <IconOutline name="caret-left" style={{ color: "#ffffff", fontSize: 80 }} />
                    </Button>
                  </Flex.Item>
                  <Flex.Item style={{ padding: 5 }}>
                    <Button type="primary" onPress={this.onClose2} style={{ width: "100%", height: 60, backgroundColor: "#684ecd", borderColor: "#684ecd" }} activeStyle={{ backgroundColor: '#877abb' }}>
                      完成
                </Button>
                  </Flex.Item>
                  <Flex.Item >
                    <Button onPressIn={this.RightIn} onPressOut={this.RightOut} style={{ width: "100%", height: 60, backgroundColor: "#684ecd", borderColor: "#684ecd" }} activeStyle={{ backgroundColor: '#877abb' }} >
                      <IconOutline name="caret-right" style={{ color: "#ffffff", fontSize: 80 }} />
                    </Button>
                  </Flex.Item>
                </Flex>
                <Flex>
                  <Flex.Item>
                  </Flex.Item>
                  <Flex.Item >
                    <Button onPressIn={this.BackIn} onPressOut={this.BackOut} style={{ width: "100%", height: 60, backgroundColor: "#684ecd", borderColor: "#684ecd" }} activeStyle={{ backgroundColor: '#877abb' }} >
                      <IconOutline name="caret-down" style={{ color: "#ffffff", fontSize: 80 }} />
                    </Button>
                  </Flex.Item>
                  <Flex.Item >
                  </Flex.Item>
                </Flex>
              </View>
              <WhiteSpace size="lg" />
            </Modal>

            <WingBlank style={{ marginBottom: 5 }}>
              <Flex>
                <Flex.Item >
                </Flex.Item>
                <Flex.Item >
                  <Text style={{ color: "white", textAlign: "center", fontWeight: "bold", fontSize: 14 }}>无任务</Text>
                </Flex.Item>
                <Flex.Item >
                </Flex.Item>
              </Flex>
            </WingBlank>

            <WingBlank style={{ marginBottom: 5 }}>
              <Flex>
                <Flex.Item>
                  <TouchableNativeFeedback onPress={() => this.setState({ connectvisible: true })}>
                    <Image source={require('./Images/close.png')} style={{ position: "absolute", left: "50%", width: 28, height: 28 }} />
                  </TouchableNativeFeedback>
                </Flex.Item>
                <Flex.Item >
                </Flex.Item>
                <Flex.Item>
                  <TouchableNativeFeedback onPress={this.Sound}>
                    <Image source={require('./Images/sound.png')} style={{ position: "absolute", right: "50%", width: 24, height: 24 }} />
                  </TouchableNativeFeedback>
                </Flex.Item>
              </Flex>
            </WingBlank>
            <View style={{ height: 30, width: '100%' }}></View>

            <View>
              <Image source={{ uri: baseImg }}
                style={{ position: 'absolute', top: 0 }} height={Dimensions.get('window').height - 260} width={Dimensions.get('window').width} />
              <Surface height={Dimensions.get('window').height - 260} width={Dimensions.get('window').width} >
                <Shape d={path} stroke="yellow" strokeWidth={2} strokeDash={[10, 10]} fill="blue" />
                <Shape d={new Path().moveTo(200, 0).lineTo(0, 200)} stroke="blue" strokeWidth={10} />
              </Surface>
            </View>

            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
              <View style={{ height: 25, width: "100%" }}>
                <WingBlank >
                  <Flex>
                    <Flex.Item >
                      <Text style={{ color: "#ffffff", textAlign: "center", fontWeight: "bold", fontSize: 20 }}>{this.state.rundistance != "-1" ? this.state.rundistance : "—"}M</Text>
                    </Flex.Item>
                    <Flex.Item ></Flex.Item>
                    <Flex.Item >
                      <Text style={{ color: "#ffffff", textAlign: "center", fontWeight: "bold", fontSize: 20 }}>{this.state.power != "-1" ? this.state.power : "—"}%</Text>
                    </Flex.Item>
                    <Flex.Item ></Flex.Item>
                    <Flex.Item >
                      <Text style={{ color: "#ffffff", textAlign: "center", fontWeight: "bold", fontSize: 20 }}>{this.state.runtime}min</Text>
                    </Flex.Item>
                  </Flex>
                </WingBlank>
              </View>

              <View style={{ height: 25, width: "100%" }}>
                <WingBlank >
                  <Flex>
                    <Flex.Item >
                      <Text style={{ color: "#ffffff", textAlign: "center", fontWeight: "bold", fontSize: 14 }}>运行距离</Text>
                    </Flex.Item>
                    <Flex.Item ></Flex.Item>
                    <Flex.Item >
                      <Text style={{ color: "#ffffff", textAlign: "center", fontWeight: "bold", fontSize: 14 }}>剩余电量</Text>
                    </Flex.Item>
                    <Flex.Item ></Flex.Item>
                    <Flex.Item >
                      <Text style={{ color: "#ffffff", textAlign: "center", fontWeight: "bold", fontSize: 14 }}>运行时间</Text>
                    </Flex.Item>
                  </Flex>
                </WingBlank>
              </View>

              <View style={{ height: 90, width: "100%", backgroundColor: "white" }}>
                <Grid data={data} hasLine={false} columnNum={4} />
              </View>

            </View>

          </Drawer>
        </Provider>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerHorizontal: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});