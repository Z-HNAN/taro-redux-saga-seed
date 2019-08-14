## redux-saga集成taro
> taro中redux处理方案是采用redux-thunk,这里采用[redux-saga](https://redux-saga.js.org/)解决异步问题，*引入目前最新redux-saga@1.0.5*

#### redux-saga-seed
- 可以按照本例自己进行引入
- 也可以直接下载该种子项目，已经引入了saga相关

#### 安装redux-saga
```shell
npm i redux-saga
```

#### 更改目录形式
将每个文件放在模块中，利于查找，便于引入，后面引入saga文件也比较清晰，当然这里只是一个个人喜好，也可按照自己的目录形式来安排，这里只做一个参考,请多留意引入文件路径是否正确。
```shell
└─src                     
    │  app.jsx            
    │  app.less           
    │  index.html         
    │                     
    ├─pages               
    │  └─index            
    │          action.js  
    │          index.jsx  
    │          index.less 
    │          reducer.js 
    |          saga.js
    │                     
    └─store               
            index.js      
            reducer.js
            saga.js    
```

#### 引入index模块的saga
- `pages/index/saga.js`捕获当前模块中的action

```js
import { put, delay, takeEvery} from 'redux-saga/effects'

function* asyncAddRequest (action) {
  const { timeout } = action.payload
  yield delay(timeout)
  yield put({ type: 'ADD' })
}

export default function* () {
  yield takeEvery('ASYNC_ADD', asyncAddRequest)
}

```

#### 配置根saga文件
- `store/saga.js`启动各个模块的saga

```js
import { all } from 'redux-saga/effects'

import indexSaga from '../pages/index/saga'

export default function* () {
  yield all([
    indexSaga()
  ])
}

```

#### 在store中引入sagaMiddleware
- `store/index.js`saga连接到store
  + 引入saga
  + 配置saga中间件到middlewares
  + 启动saga

```js
import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import rootSaga from './saga'
import rootReducer from './reducer'

const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose

/* 处理redux-saga */
const sagaMiddleware = createSagaMiddleware();

const middlewares = [
  sagaMiddleware
]

/* 处理redux-logger */
if (process.env.NODE_ENV === 'development' && process.env.TARO_ENV !== 'quickapp') {
  middlewares.push(require('redux-logger').createLogger())
}

const enhancer = composeEnhancers(
  applyMiddleware(...middlewares),
  // other store enhancers if any
)

export default function configStore () {
  const store = createStore(rootReducer, enhancer)
  sagaMiddleware.run(rootSaga)
  return store
}

```

#### 检测saga
- `pages/index/index.jsx` 本例以taro的redux为基础进行测试

```js
import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import { add, minus, asyncAdd } from './action'

import './index.less'

const mapStateToProps = (state) => {
  return {
    counter: state.index.num
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    add: () => {
      dispatch(add())
    },
    asyncAdd: () => {
      dispatch(asyncAdd({ timeout: 3000 }))
    },
    minus: () => {
      dispatch(minus())
    }
  }
}

@connect(mapStateToProps, mapDispatchToProps)
class Index extends Component {

    config = {
    navigationBarTitleText: '首页'
  }

  componentWillReceiveProps (nextProps) {
    // console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        <Button className='add_btn' onClick={this.props.add}>+</Button>
        <Button className='dec_btn' onClick={this.props.minus}>-</Button>
        <Button className='dec_btn' onClick={this.props.asyncAdd}>async</Button>
        <View><Text>{this.props.counter}</Text></View>
        <View><Text>Hello, Redux-saga</Text></View>
      </View>
    )
  }
}

export default Index

```
